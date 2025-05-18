
import React, { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { AttendanceWithStudent } from "@/services/mongodb";
import { getAbsenteesByDate } from "@/api/attendance";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";

const searchSchema = z.object({
  date: z.date({ required_error: "Please select a date" }),
});

type SearchFormValues = z.infer<typeof searchSchema>;

const AbsenteesList = () => {
  const [absentees, setAbsentees] = useState<AttendanceWithStudent[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const { toast } = useToast();

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      date: new Date(),
    },
  });

  const onSubmit = async (data: SearchFormValues) => {
    try {
      setLoading(true);
      setSearched(true);
      const results = await getAbsenteesByDate(data.date);
      setAbsentees(results);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch absentees",
        variant: "destructive",
      });
      console.error("Error fetching absentees:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Absentees by Date</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Select Date</FormLabel>
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
                  Select a date to view absentees
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={loading}>
            {loading ? "Loading..." : "Show Absentees"}
          </Button>
        </form>
      </Form>

      {searched && !loading && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">
            Absentees for {format(form.getValues("date"), "PPP")}
          </h3>

          {absentees.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Roll Number</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {absentees.map((absentee) => (
                  <TableRow key={absentee._id?.toString()}>
                    <TableCell className="font-medium">
                      {absentee.studentName}
                    </TableCell>
                    <TableCell>{absentee.rollNumber}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No absentees found for this date
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AbsenteesList;
