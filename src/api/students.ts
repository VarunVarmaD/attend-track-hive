
import { StudentService } from "../services/mongodb";
import type { Student } from "../services/mongodb";

export type { Student };

export async function getStudents(): Promise<Student[]> {
  try {
    return await StudentService.getAll();
  } catch (error) {
    console.error("Failed to fetch students:", error);
    throw new Error("Failed to fetch students");
  }
}

export async function addStudent(student: Student): Promise<Student> {
  try {
    return await StudentService.add(student);
  } catch (error) {
    console.error("Failed to add student:", error);
    throw new Error("Failed to add student");
  }
}

export async function deleteStudent(id: string): Promise<boolean> {
  try {
    return await StudentService.delete(id);
  } catch (error) {
    console.error("Failed to delete student:", error);
    throw new Error("Failed to delete student");
  }
}
