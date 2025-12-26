import mongoose from 'mongoose';

const SubjectResultSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  grade: { type: String, required: true },
});

const ExamSittingSchema = new mongoose.Schema({
  examType: { type: String, required: true },
  examYear: { type: String, required: true },
  examNumber: { type: String, required: true },
  subjects: [SubjectResultSchema],
});

const ApplicantSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    personalInfo: {
      fullName: String,
      gender: String,
      email: String,
      phone: String,
      passportUrl: String,
      contactAddress: String,
      dateOfBirth: String,
      parentsName: String,
      parentsContactAddress: String,
    },
    healthInfo: {
      bloodGroup: String,
      genotype: String,
      disability: String,
      chronicIllness: String,
      emergencyContact: String,
    },
    schoolsAttended: {
      primarySchool: String,
      secondarySchool: String,
      otherInstitutions: String,
    },
    // This stores an array of sittings (1 or 2 sittings)
    examResults: [ExamSittingSchema],
    
    programDetails: {
      program: String,
      mode: { type: String, enum: ['Full-time', 'Part-time'], default: 'Full-time' },
      campus: String,
    },
    utmeInfo: {
      jambRegNo: String,
      jambScore: Number,
      jambSubjects: [String],
    },
    submitted: {
      type: Boolean,
      default: false,
    },
    applicationStatus: {
      type: String,
      enum: ['Pending', 'Reviewed', 'Accepted', 'Rejected'],
      default: 'Pending',
    }
  },
  { timestamps: true }
);

// Prevent re-compilation of model if it already exists
const Applicant = mongoose.models.Applicant || mongoose.model('Applicant', ApplicantSchema);

export default Applicant;