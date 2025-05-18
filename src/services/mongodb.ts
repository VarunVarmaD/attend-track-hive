
import { v4 as uuidv4 } from 'uuid';

// Create ObjectId type for compatibility
export type ObjectId = string;

export const ObjectId = {
  createFromHexString: (hexString: string): ObjectId => hexString,
  // For new ObjectId() usage
  create: (): ObjectId => uuidv4(),
};

// Student type
export interface Student {
  _id?: string | ObjectId;
  name: string;
  rollNumber: string;
}

// Attendance type
export interface Attendance {
  _id?: string | ObjectId;
  studentId: string | ObjectId;
  date: Date | string;
  status: "Present" | "Absent";
}

// Attendance with student details for display
export interface AttendanceWithStudent extends Attendance {
  studentName: string;
  rollNumber: string;
}

// Mock in-memory database for demonstration
const db = {
  students: [] as Student[],
  attendances: [] as Attendance[],
};

// Student service
export const StudentService = {
  async getAll(): Promise<Student[]> {
    console.log("Fetching all students");
    // Return a copy to prevent direct mutation
    return [...db.students].sort((a, b) => a.name.localeCompare(b.name));
  },

  async add(student: Student): Promise<Student> {
    console.log("Adding student:", student);
    const newStudent = { 
      ...student, 
      _id: ObjectId.create() 
    };
    db.students.push(newStudent);
    return newStudent;
  },

  async delete(id: string): Promise<boolean> {
    console.log("Deleting student:", id);
    const initialLength = db.students.length;
    db.students = db.students.filter(student => student._id !== id);
    return db.students.length < initialLength;
  }
};

// Attendance service
export const AttendanceService = {
  async markAttendance(attendance: Attendance): Promise<Attendance> {
    console.log("Marking attendance:", attendance);
    const newAttendance = {
      ...attendance,
      _id: ObjectId.create(),
      date: attendance.date instanceof Date ? attendance.date : new Date(attendance.date)
    };
    db.attendances.push(newAttendance);
    return newAttendance;
  },

  async getAbsenteesByDate(date: Date | string): Promise<AttendanceWithStudent[]> {
    console.log("Fetching absentees for date:", date);
    
    // Convert string date to Date object if needed
    const queryDate = typeof date === 'string' ? new Date(date) : date;
    
    // Set time to beginning of day
    queryDate.setHours(0, 0, 0, 0);
    
    // Set end date to end of the same day
    const endDate = new Date(queryDate);
    endDate.setHours(23, 59, 59, 999);

    // Filter absentees by date
    const absentees = db.attendances.filter(att => {
      const attDate = att.date instanceof Date ? att.date : new Date(att.date);
      return att.status === "Absent" && 
             attDate >= queryDate && 
             attDate <= endDate;
    });

    // Join with student information
    return absentees.map(absentee => {
      const student = db.students.find(s => s._id === absentee.studentId);
      return {
        ...absentee,
        studentName: student?.name || "Unknown Student",
        rollNumber: student?.rollNumber || "Unknown"
      };
    });
  }
};

// Initialize with some sample data
const initializeSampleData = () => {
  // Add some sample students
  const student1 = StudentService.add({
    name: "John Doe",
    rollNumber: "R001"
  });
  const student2 = StudentService.add({
    name: "Jane Smith",
    rollNumber: "R002"
  });
  const student3 = StudentService.add({
    name: "Alice Johnson",
    rollNumber: "R003"
  });

  // Resolve the promises to get the actual student objects
  Promise.all([student1, student2, student3]).then(students => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    // Add some sample attendance records
    AttendanceService.markAttendance({
      studentId: students[0]._id!,
      date: today,
      status: "Present"
    });
    AttendanceService.markAttendance({
      studentId: students[1]._id!,
      date: today,
      status: "Absent"
    });
    AttendanceService.markAttendance({
      studentId: students[2]._id!,
      date: yesterday,
      status: "Absent"
    });
  });
};

// Initialize sample data
initializeSampleData();
