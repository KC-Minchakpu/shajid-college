import mongoose, { Schema, model, models } from 'mongoose';

// 1. Sub-schema for O-Level Subject Results
const SubjectResultSchema = new Schema({
  subject: { type: String, required: true },
  grade: { type: String, required: true },
});

// 2. Sub-schema for Examination Sittings (Step 4)
const ExamSittingSchema = new Schema({
  examType: { type: String, required: true },
  examYear: { type: String, required: true },
  examNumber: { type: String, required: true },
  subjects: [SubjectResultSchema],
});

// 3. Main Applicant Schema
const ApplicantSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    // Unique identifier for the application (e.g., SON/2025/1234)
    applicationId: {
      type: String,
      unique: true,
      sparse: true, // Allows nulls for drafts but enforces uniqueness for submitted ones
    },
    personalInfo: {
      fullName: { type: String },
      gender: { type: String },
      email: { type: String },
      phone: { type: String },
      passportUrl: { type: String },
      contactAddress: { type: String },
      dateOfBirth: { type: String },
      parentsName: { type: String },
      parentsContactAddress: { type: String },
    },
    healthInfo: {
      bloodGroup: { type: String },
      genotype: { type: String },
      disability: { type: String },
      chronicIllness: { type: String },
      emergencyContact: { type: String },
    },
    schoolsAttended: {
      primarySchool: { type: String },
      secondarySchool: { type: String },
      otherInstitutions: { type: String },
    },
    // Array to handle up to 2 sittings
    examResults: [ExamSittingSchema],
    
    programDetails: {
      program: { type: String },
      mode: { type: String, enum: ['Full-time', 'Part-time'], default: 'Full-time' },
      campus: { type: String },
    },
    utmeInfo: {
      jambRegNo: { type: String },
      jambScore: { type: Number },
      jambSubjects: [{ type: String }],
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
  { 
    timestamps: true // Automatically adds createdAt and updatedAt
  }
);

// Prevent re-compilation of model during Next.js Hot Module Replacement (HMR)
const Applicant = models.Applicant || model('Applicant', ApplicantSchema);

export default Applicant;