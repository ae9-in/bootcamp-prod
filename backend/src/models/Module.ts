import mongoose, { Document, Schema } from 'mongoose';

export interface IModule extends Document {
  title: string;
  shortCode: string;
  description: string;
  topics: string[];
}

const ModuleSchema = new Schema<IModule>({
  title: { type: String, required: true },
  shortCode: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  topics: [{ type: String }]
});

export const Module = mongoose.model<IModule>('Module', ModuleSchema);