
import { MongoClient, ObjectId } from "mongodb";

// Use environment variables for connection strings in production
const uri = "mongodb+srv://VarunVarma:<db_password>@cluster0.oj3oz4a.mongodb.net/";
const client = new MongoClient(uri);

// Connect to MongoDB
let clientPromise: Promise<MongoClient>;

if (!global._mongoClientPromise) {
  clientPromise = client.connect();
  global._mongoClientPromise = clientPromise;
} else {
  clientPromise = global._mongoClientPromise;
}

export { clientPromise, ObjectId };

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

// Student service
export const StudentService = {
  async getAll(): Promise<Student[]> {
    const client = await clientPromise;
    const collection = client.db().collection("students");
    return await collection.find({}).sort({ name: 1 }).toArray() as Student[];
  },

  async add(student: Student): Promise<Student> {
    const client = await clientPromise;
    const collection = client.db().collection("students");
    const result = await collection.insertOne(student);
    return { ...student, _id: result.insertedId };
  },

  async delete(id: string): Promise<boolean> {
    const client = await clientPromise;
    const collection = client.db().collection("students");
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  }
};

// Attendance service
export const AttendanceService = {
  async markAttendance(attendance: Attendance): Promise<Attendance> {
    const client = await clientPromise;
    const collection = client.db().collection("attendances");
    const result = await collection.insertOne({
      ...attendance,
      studentId: new ObjectId(attendance.studentId),
      date: new Date(attendance.date)
    });
    return { ...attendance, _id: result.insertedId };
  },

  async getAbsenteesByDate(date: Date | string): Promise<AttendanceWithStudent[]> {
    const client = await clientPromise;
    
    // Convert string date to Date object if needed
    const queryDate = typeof date === 'string' ? new Date(date) : date;
    
    // Set time to beginning of day
    queryDate.setHours(0, 0, 0, 0);
    
    // Set end date to end of the same day
    const endDate = new Date(queryDate);
    endDate.setHours(23, 59, 59, 999);

    const pipeline = [
      {
        $match: {
          status: "Absent",
          date: { 
            $gte: queryDate,
            $lte: endDate
          }
        }
      },
      {
        $lookup: {
          from: "students",
          localField: "studentId",
          foreignField: "_id",
          as: "studentDetails"
        }
      },
      {
        $unwind: "$studentDetails"
      },
      {
        $project: {
          _id: 1,
          date: 1,
          status: 1,
          studentId: 1,
          studentName: "$studentDetails.name",
          rollNumber: "$studentDetails.rollNumber"
        }
      }
    ];

    const collection = client.db().collection("attendances");
    return await collection.aggregate(pipeline).toArray() as AttendanceWithStudent[];
  }
};
