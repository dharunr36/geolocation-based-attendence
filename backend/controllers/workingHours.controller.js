import mongoose from "mongoose";
import { WorkingHours } from "../models/workingHours.model.js";
import Attendance from "../models/attendence.model.js"; // Import Attendance model

export const getWorkingHours = async (req, res) => {
  try {
    const { userId } = req.query;

    // Validate userId
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid or missing userId." });
    }

    // Fetch WorkingHours and Attendance records
    const [workingHoursRecords, attendanceRecords] = await Promise.all([
      WorkingHours.find({ userId }),
      Attendance.find({ userId }),
    ]);

    // Handle no records scenario
    if (!workingHoursRecords.length) {
      return res.status(200).json({
        totalHours: 0,
        overtime: 0,
        activities: [],
        weeklyData: [],
      });
    }

    // Constants
    const MAX_HOURS_PER_DAY = 10;
    const IST_OPTIONS = { timeZone: "Asia/Kolkata", hour12: true };

    // Helper Function: Format Date to IST
    const formatDateToIST = (date) =>
      new Date(date).toLocaleDateString("en-IN", IST_OPTIONS);

    // Helper Function: Format DateTime to IST
    const formatDateTimeToIST = (dateTime) =>
      new Date(dateTime).toLocaleString("en-IN", IST_OPTIONS);

    // Activities Data
    const activities = workingHoursRecords.map((record) => {
      // Match attendance record for the same date
      const matchingAttendance = attendanceRecords.find((att) => {
        return (
          new Date(att.checkInTime).toDateString() ===
          new Date(record.date).toDateString()
        );
      });

      const dailyOvertime =
        record.totalHours > MAX_HOURS_PER_DAY
          ? record.totalHours - MAX_HOURS_PER_DAY
          : 0;

      return {
        date: formatDateToIST(record.date),
        checkIn: matchingAttendance
          ? formatDateTimeToIST(matchingAttendance.checkInTime)
          : null,
        checkOut: matchingAttendance
          ? formatDateTimeToIST(matchingAttendance.checkOutTime)
          : null,
        totalHours: record.totalHours,
        dailyOvertime: Math.round(dailyOvertime * 100) / 100,
      };
    });

    // Total Hours and Overtime Calculation
    const totalHours = workingHoursRecords.reduce(
      (sum, record) => sum + record.totalHours,
      0
    );

    const overtime = workingHoursRecords.reduce((sum, record) => {
      const excessHours =
        record.totalHours > MAX_HOURS_PER_DAY
          ? record.totalHours - MAX_HOURS_PER_DAY
          : 0;
      return sum + excessHours;
    }, 0);

    // Weekly Data: Last 7 Days
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const weeklyData = workingHoursRecords
      .filter((record) => new Date(record.date) >= last7Days)
      .map((record) => ({
        date: formatDateToIST(record.date),
        hoursWorked: record.totalHours,
        dailyOvertime:
          record.totalHours > MAX_HOURS_PER_DAY
            ? Math.round((record.totalHours - MAX_HOURS_PER_DAY) * 100) / 100
            : 0,
      }));

    // Final Response
    res.status(200).json({
      totalHours: Math.round(totalHours * 100) / 100,
      overtime: Math.round(overtime * 100) / 100,
      activities,
      weeklyData,
    });
  } catch (error) {
    console.error("Error fetching working hours:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
};
