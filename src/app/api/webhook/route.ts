import { Buffer } from 'node:buffer';
import crypto from 'crypto';
import { connectToDB } from '@/lib/mongodb';
import Applicant from '@/models/Applicant';
import { generatePDFAndSendEmail } from '@/utils/pdfHandler';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  const payload = await req.text();
  const signature = req.headers.get('x-paystack-signature');

  // 1. Verify the event is actually from Paystack
  const hash = crypto.createHmac('sha512', secret!).update(payload).digest('hex');
  
  if (hash !== signature) {
    return new NextResponse('Invalid signature', { status: 401 });
  }

  const event = JSON.parse(payload);

  // 2. Only process successful payments
  if (event.event === 'charge.success') {
    const { user_id, full_form } = event.data.metadata.custom_fields.reduce((acc: any, field: any) => {
      acc[field.variable_name] = field.value;
      return acc;
    }, {});

    const fullFormData = JSON.parse(full_form);

    try {
      await connectToDB();

      // 3. Save to Database
      await Applicant.findOneAndUpdate(
        { userId: user_id },
        {
          ...fullFormData,
          submitted: true,
          paymentReference: event.data.reference,
          paidAmount: event.data.amount / 100,
        },
        { upsert: true }
      );

      // 4. Send the Email & PDF
      await generatePDFAndSendEmail(user_id, fullFormData);

      return new NextResponse('OK', { status: 200 });
    } catch (err) {
      console.error('Webhook DB Error:', err);
      return new NextResponse('Internal Error', { status: 500 });
    }
  }

  return new NextResponse('Event ignored', { status: 200 });
}