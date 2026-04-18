import mongoose, { Document, Schema } from 'mongoose';

export interface ITestimonial extends Document {
  name: string;
  role: string;
  text: string;
  rating: number;
  avatarInitials: string;
  imageUrl?: string;
  videoUrl?: string;
}

const TestimonialSchema = new Schema<ITestimonial>({
  name: { type: String, required: true },
  role: { type: String, required: true },
  text: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  avatarInitials: { type: String, required: true },
  imageUrl: { type: String },
  videoUrl: { type: String }
});

export const Testimonial = mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);