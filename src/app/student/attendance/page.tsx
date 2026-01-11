"use client";
import Loading from "@/components/Loading";
import SectionTitle from "@/components/SectionTitle";
import { useAuth } from "@/context/AuthContext";
import { Attendance, Student } from "@/Types";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AttendancePage() {
  const { user } = useAuth() as { user: Student };
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/students/attendance`);
      setAttendance(response.data.attendance);
    } catch (error) {
      console.error("Error fetching attendance:", error);
      toast.error("Failed to fetch attendance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  if (loading) return <Loading />;

  return (
    <>
      <SectionTitle title="Your Attendance" />
      <div className="overflow-x-auto px-10 mb-10">
        <table className="table table-zebra w-full bg-base-300 rounded-lg">
          <thead>
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Class</th>
              <th>Teacher</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {attendance.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center">
                  No attendance records found.
                </td>
              </tr>
            ) : (
              attendance.map((record, index) => (
                <tr key={record._id!}>
                  <td>{index + 1}</td>
                  <td>{new Date(record.date).toDateString()}</td>
                  <td>{record.class.name}</td>
                  <td>{record.teacher.name}</td>
                  <td>
                    <span>
                      {record.records.find((r) => r.student._id === user._id)
                        ?.status === "Present" ? (
                        <span className="text-success font-semibold">
                          Present
                        </span>
                      ) : (
                        <span className="text-error font-semibold">Absent</span>
                      )}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
