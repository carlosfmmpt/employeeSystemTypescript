import mongoose, { Document, Schema } from 'mongoose';

interface IEmployee extends Document {
  name: string;
  position: string;
  salary: number;
  photoUrl?: string;
}

const employeeSchema: Schema = new Schema({
  name: { type: String, required: true },
  position: { type: String, required: true },
  salary: { type: Number, required: true },
  photoUrl: { type: String, required: false }
});

const Employee = mongoose.model<IEmployee>('Employee', employeeSchema);

export default Employee;
