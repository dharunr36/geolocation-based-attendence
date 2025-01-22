import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Reference to the User model
            required: true,
        },
        checkInTime: {
            type: Date,
            required: true,
        },
        checkOutTime: {
            type: Date,
        },
    }
);

const Attendance = mongoose.model("Attendance", attendanceSchema);

export default Attendance;
