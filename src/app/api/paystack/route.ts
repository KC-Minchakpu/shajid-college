import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  const body = await req.json();

  // 1. Verify the signature (Security: Ensure this actually came from Paystack)
  const hash = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
    .update(JSON.stringify(body))
    .digest('hex');

  if (hash !== req.headers.get('x-paystack-signature')) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  // 2. If payment is successful, update the Database
  if (body.event === 'charge.success') {
    const userEmail = body.data.customer.email;
    
    // UPDATE DATABASE LOGIC HERE
    // await db.application.update({ 
    //   where: { email: userEmail }, 
    //   data: { isPaid: true, status: 'SUBMITTED' } 
    // });
  }

  return NextResponse.json({ status: 'ok' });
}