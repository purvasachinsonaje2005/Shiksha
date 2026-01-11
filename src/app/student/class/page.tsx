"use client";
import Loading from "@/components/Loading";
import SectionTitle from "@/components/SectionTitle";
import { Class, Student } from "@/Types";
import { useEffect, useState } from "react";

export default function ClassPage() {
  const [classData, setClassData] = useState<Class | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchClassData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/students/class");
      const data = await res.json();
      setClassData(data.class);
    } catch (error) {
      console.error("Error fetching class data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassData();
  }, []);

  if (loading) return <Loading />;
  return (
    <>
      <SectionTitle title="Class Information" />
      <div className="px-10 space-y-8">
        {/* CLASS HEADER */}
        <div className="card bg-base-200 shadow p-6">
          <h2 className="text-2xl font-bold">Class: {classData?.name}</h2>
        </div>

        {/* GRID: SUBJECTS + STUDENTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* --------------------- SUBJECTS LIST --------------------- */}
          <div className="card bg-base-200 shadow p-6">
            <h3 className="text-xl font-bold mb-4">Subjects & Teachers</h3>

            {classData?.subjects?.length === 0 ? (
              <p className="opacity-60">No subjects found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>Subject</th>
                      <th>Teacher</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classData?.subjects?.map((sub, idx) => (
                      <tr key={idx}>
                        <td>{sub.subjectName}</td>
                        <td>{sub.teacher?.name || "Not Assigned"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* --------------------- STUDENTS LIST --------------------- */}
          <div className="card bg-base-200 shadow p-6">
            <h3 className="text-xl font-bold mb-4">Students</h3>

            {classData?.students?.length === 0 ? (
              <p className="opacity-60">No students in this class.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classData?.students?.map((stu: Student, idx) => (
                      <tr key={idx}>
                        <td>{stu.name}</td>
                        <td>{stu.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
