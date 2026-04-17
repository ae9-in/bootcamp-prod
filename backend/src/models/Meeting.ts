import mongoose, { Document, Schema } from 'mongoose';

export interface IMeeting extends Document {
  hostId: mongoose.Types.ObjectId;
  hostName: string;
  startTime: Date;
  endTime?: Date;
  status: 'live' | 'ended';
  participants: { id: string; name: string }[];
}

const MeetingSchema = new Schema<IMeeting>({
  hostId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  hostName: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  status: { type: String, enum: ['live', 'ended'], default: 'live' },
  participants: [{ id: String, name: String }]
});

export const Meeting = mongoose.model<IMeeting>('Meeting', MeetingSchema);