import mongoose from "mongoose";

const WorkingHoursSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  totalHours: { type: Number, default: 0 }, // Stores total hours worked in a day
  overtime: { type: Number, default: 0 }, // Overtime hours
});

export const WorkingHours = mongoose.model("workingHours", WorkingHoursSchema);
