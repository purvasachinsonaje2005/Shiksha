"use client";
import Loading from "@/components/Loading";
import SectionTitle from "@/components/SectionTitle";
import { useAuth } from "@/context/AuthContext";
import { Class, Student, Teacher } from "@/Types";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AttendancePage() {
  const { user } = useAuth() as { user: Teacher };
  const [date, setDate] = useState<string>("");
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedClass, setSelectedClass] = useState<Class>();
  const [loading, setLoading] = useState<boolean>(false);
  const [classes, setClasses] = useState<Class[]>([]);
  const [absentStudentIds, setAbsentStudentIds] = useState<Set<string>>(
    new Set()
  );

  const fetchStudents = async () => {
    if (!selectedClass) {
      toast.error("Please select a course");
      return;
    }
    try {
      const res = axios.get(
        `/api/students/get-by-class?classId=${selectedClass._id}`
      );
      toast.promise(res, {
        loading: "Fetching students...",
        success: (data) => {
          setStudents(data.data.students);
          return "Students fetched successfully";
        },
        error: "Failed to fetch students",
      });
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/teacher/classes?teacherId=" + user?._id);
      if (res.ok) {
        const data = await res.json();
        setClasses(data.classes);
      } else {
        console.error("Failed to fetch classes");
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAbsent = (studentId: string) => {
    setAbsentStudentIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(studentId)) {
        newSet.delete(studentId);
      } else {
        newSet.add(studentId);
      }
      return newSet;
    });
  };

  const markAttendance = async () => {
    if (!date || !selectedClass) {
      toast.error("Date and Course must be selected");
      return;
    }

    const attendanceData = students.map((student) => ({
      studentId: student._id,
      date,
      status: absentStudentIds.has(student._id!) ? "Absent" : "Present",
    }));

    try {
      const promise = axios.post("/api/teacher/attendance/mark", {
        records: {
          date,
          class: selectedClass._id,
          teacher: user?._id,
          records: attendanceData.map((record) => ({
            student: record.studentId,
            status: record.status,
            timeMarked: new Date(),
          })),
        },
      });
      toast.promise(promise, {
        loading: "Submitting attendance...",
        success: "Attendance marked successfully!",
        error: "Failed to mark attendance",
      });
    } catch (err) {
      console.error("Error submitting attendance:", err);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  if (loading) return <Loading />;

  return (
    <>
      <SectionTitle title="Manage Student's Attendance" />

      <div className="flex lg:flex-row flex-col gap-4 w-full px-10">
        <fieldset className="fieldset w-full">
          <legend className="fieldset-legend">
            Select Class <span className="text-error">*</span>
          </legend>
          <select
            className="select select-primary w-full"
            value={selectedClass?._id || ""}
            onChange={(e) =>
              setSelectedClass(
                classes.find((cls) => cls._id === e.target.value)!
              )
            }
          >
            <option value="">Select Class</option>
            {classes.map((classItem) => (
              <option key={classItem.name} value={classItem._id}>
                {classItem.name}
              </option>
            ))}
          </select>
        </fieldset>
        <fieldset className="fieldset w-full">
          <legend className="fieldset-legend">
            Select Date<span className="text-error">*</span>
          </legend>
          <input
            type="date"
            className="input input-primary w-full"
            value={date}
            max={new Date().toISOString().split("T")[0]}
            onChange={(e) => setDate(e.target.value)}
          />
        </fieldset>

        <button className="btn btn-primary mt-8.25" onClick={fetchStudents}>
          Fetch Students
        </button>
      </div>

      {students.length > 0 && (
        <div className="w-full px-10 mt-6">
          <button
            className="btn btn-success mb-4 w-full"
            onClick={markAttendance}
          >
            Mark Attendance
          </button>
          <div className="overflow-x-auto mt-6 rounded-lg">
            <table className="table table-zebra w-full bg-base-300 rounded-lg">
              <thead>
                <tr>
                  <th>Absent</th>
                  <th>Student ID</th>
                  <th>Student</th>
                  <th>Class</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id}>
                    <td>
                      <label>
                        <input
                          type="checkbox"
                          className="checkbox"
                          checked={absentStudentIds.has(student._id!)}
                          onChange={() => toggleAbsent(student._id!)}
                        />
                      </label>
                    </td>
                    <td>{student.studentId}</td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="mask mask-squircle h-12 w-12">
                            <img
                              src={`data:${
                                student.profileImage?.contentType
                              };base64,${Buffer.from(
                                student.profileImage?.data!
                              ).toString("base64")}`}
                              alt={student.name}
                            />
                          </div>
                        </div>
                        <div className="font-bold">{student.name}</div>
                      </div>
                    </td>
                    <td>{selectedClass?.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
