
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { addStudent } from "@/api/students";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const studentSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  rollNumber: z.string().min(1, { message: "Roll number is required" }),
});

type StudentFormValues = z.infer<typeof studentSchema>;

const AddStudentForm = () => {
  const { toast } = useToast();
  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: "",
      rollNumber: "",
    },
  });

  const onSubmit = async (data: StudentFormValues) => {
    try {
      await addStudent(data);
      toast({
        title: "Success!",
        description: "Student added successfully",
        variant: "default",
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add student. Please try again.",
        variant: "destructive",
      });
      console.error("Error adding student:", error);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Add New Student</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Student Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter student name" {...field} />
                </FormControl>
                <FormDescription>
                  Enter the student's full name
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rollNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Roll Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter roll number" {...field} />
                </FormControl>
                <FormDescription>
                  Enter the student's unique roll number
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Add Student</Button>
        </form>
      </Form>
    </div>
  );
};

export default AddStudentForm;
