
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { markAttendance, Attendance } from "@/api/attendance";
import { getStudents, Student } from "@/api/students";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const attendanceSchema = z.object({
  studentId: z.string({ required_error: "Please select a student" }),
  date: z.date({ required_error: "Please select a date" }),
  status: z.enum(["Present", "Absent"], {
    required_error: "Please select attendance status",
  }),
});

type AttendanceFormValues = z.infer<typeof attendanceSchema>;

const MarkAttendanceForm = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const form = useForm<AttendanceFormValues>({
    resolver: zodResolver(attendanceSchema),
    defaultValues: {
      date: new Date(),
      status: "Present",
    },
  });

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const data = await getStudents();
        setStudents(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch students",
          variant: "destructive",
        });
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const onSubmit = async (data: AttendanceFormValues) => {
    try {
      const attendanceData: Attendance = {
        studentId: data.studentId,
        date: data.date,
        status: data.status
      };
      await markAttendance(attendanceData);
      toast({
        title: "Success!",
        description: "Attendance recorded successfully",
      });
      // Reset form but keep the date
      form.reset({
        date: data.date,
        status: "Present",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to record attendance",
        variant: "destructive",
      });
      console.error("Error recording attendance:", error);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Mark Attendance</h2>

      {loading ? (
        <div className="text-center py-8">Loading students...</div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="studentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a student" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {students.map((student) => (
                        <SelectItem
                          key={student._id?.toString()}
                          value={student._id?.toString() || ""}
                        >
                          {student.name} ({student.rollNumber})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select a student from the list
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Select the date for attendance
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Attendance Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Present">Present</SelectItem>
                      <SelectItem value="Absent">Absent</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select if the student is present or absent
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Record Attendance</Button>
          </form>
        </Form>
      )}
    </div>
  );
};

export default MarkAttendanceForm;
