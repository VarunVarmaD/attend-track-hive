
import { AttendanceService } from "../services/mongodb";
import type { Attendance, AttendanceWithStudent } from "../services/mongodb";

export type { Attendance, AttendanceWithStudent };

export async function markAttendance(attendance: Attendance): Promise<Attendance> {
  try {
    return await AttendanceService.markAttendance(attendance);
  } catch (error) {
    console.error("Failed to mark attendance:", error);
    throw new Error("Failed to mark attendance");
  }
}

export async function getAbsenteesByDate(date: Date | string): Promise<AttendanceWithStudent[]> {
  try {
    return await AttendanceService.getAbsenteesByDate(date);
  } catch (error) {
    console.error("Failed to fetch absentees:", error);
    throw new Error("Failed to fetch absentees");
  }
}
