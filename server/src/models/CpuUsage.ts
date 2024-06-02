import mongoose, { Document, Schema } from 'mongoose';

export interface ICpuUsage extends Document {
  clientId: string;
  pid: number;
  cpu: number;
  memory: number;
  timestamp: Date;
}

const CpuUsageSchema: Schema = new Schema({
  clientId: { type: String, required: true },
  pid: { type: Number, required: true },
  cpu: { type: Number, required: true },
  memory: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

export const CpuUsage = mongoose.model<ICpuUsage>('CpuUsage', CpuUsageSchema);
