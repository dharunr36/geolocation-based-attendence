
import Attendance from "../models/attendence.model.js";
import User from "../models/user.model.js";

import { WorkingHours } from "../models/workingHours.model.js";



const getISTTime = () => {
  const currentUTCDate = new Date();
  const offsetIST = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds
  return new Date(currentUTCDate.getTime() + offsetIST);
};


export const checkIn = async (req, res) => {
    try {
        const { userId } = req.body; // Assuming userId is passed in the request body
        

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check if the user is already checked in
        const existingRecord = await Attendance.findOne({
            userId,
            checkOutTime: { $exists: false },
        });

        if (existingRecord) {
            return res
                .status(400)
                .json({ error: "You are already checked in. Please check out first." });
        }
        
        // Create a new check-in record
        const attendance = new Attendance({
            userId,
            checkInTime: getISTTime(),
        });

        await attendance.save();

        res.status(200).json({
            message: "Check-in successful",
            checkInTime: attendance.checkInTime,
        });
    } catch (error) {
        console.error("Error in check-in controller:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};



export const checkOut = async (req, res) => {
    try {
        const { userId } = req.body; // Assuming userId is passed in the request body

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Find the latest attendance record without a check-out time
        const attendance = await Attendance.findOne({
            userId,
            checkOutTime: null, // Find records where checkOutTime is not yet set
        });

        if (!attendance) {
            return res.status(400).json({ error: "You haven't checked in yet." });
        }

        // Update the attendance record with check-out time
        attendance.checkOutTime = getISTTime();
        await attendance.save();
        await updateOvertime(userId);

        // Calculate working hours
        const checkInTime = attendance.checkInTime;
        const checkOutTime = attendance.checkOutTime;
        const timeDiff = (checkOutTime - checkInTime) / (1000 * 60 * 60); // Difference in hours

        // Get the current date (reset to 00:00:00 for the day)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Find or create a working hours record for the current date and user
        const workingHoursRecord = await WorkingHours.findOneAndUpdate(
            { userId, date: today },
            { $inc: { totalHours: timeDiff } }, // Increment total hours
            { new: true, upsert: true } // Create if not found
        );

        res.status(200).json({
            message: "Check-out successful",
            checkInTime,
            checkOutTime,
            totalHours: workingHoursRecord.totalHours, // Total working hours for the day
        });
    } catch (error) {
        console.error("Error in check-out controller:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};


const updateOvertime = async (userId) => {
    try {
        const DAILY_WORK_HOURS = 10; // Daily work hours limit
        const today = new Date();
        today.setHours(0, 0, 0, 0); 

        const workingHoursRecord = await WorkingHours.findOne({ userId, date: today });

        if (!workingHoursRecord) {
            console.error("No working hours record found for today.");
            return { message: "No record found to update overtime." };
        }

        // Calculate overtime
        const overtime = Math.max(0, workingHoursRecord.totalHours - DAILY_WORK_HOURS);

        // Update the record
        workingHoursRecord.overtime = overtime;
        await workingHoursRecord.save();

        console.log(`Overtime updated: ${overtime} hours`);
        return {
            message: "Overtime updated successfully",
            totalHours: workingHoursRecord.totalHours,
            overtime: workingHoursRecord.overtime,
        };
    } catch (error) {
        console.error("Error updating overtime:", error.message);
        return { message: "Error updating overtime", error: error.message };
    }
};
