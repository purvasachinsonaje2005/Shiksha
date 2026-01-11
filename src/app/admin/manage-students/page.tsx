"use client";
import Loading from "@/components/Loading";
import SectionTitle from "@/components/SectionTitle";
import { Student } from "@/Types";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchParams, setSearchParams] = useState({
    school: "",
    name: "",
    class: "",
  });
  const classes = Array.from(
    new Set(students.map((student) => student.class?.name))
  );
  const schools = Array.from(
    new Set(students.map((student) => student.school?.name))
  );

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/students`);
      const data = await response.json();
      setStudents(data.students);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };
  const filteredStudents = students.filter((student) => {
    return (
      student.school?.name.includes(searchParams.school) &&
      student.name.includes(searchParams.name) &&
      student.class?.name.includes(searchParams.class)
    );
  });
  useEffect(() => {
    fetchStudents();
  }, []);
  if (loading) return <Loading />;
  return (
    <>
      <SectionTitle title="Manage Students" />
      <div className="flex flex-row gap-4 px-10">
        <fieldset className="fieldset w-full">
          <legend className="fieldset-legend">
            School Name <span className="text-error">*</span>
          </legend>
          <select
            className="select select-primary w-full"
            value={searchParams.school}
            onChange={(e) =>
              setSearchParams({ ...searchParams, school: e.target.value })
            }
          >
            <option value="">All Schools</option>
            {schools.map((schoolName) => (
              <option key={schoolName} value={schoolName}>
                {schoolName}
              </option>
            ))}
          </select>
        </fieldset>
        <fieldset className="fieldset w-full">
          <legend className="fieldset-legend">
            Student Name <span className="text-error">*</span>
          </legend>
          <input
            type="text"
            placeholder="Enter Student Name"
            value={searchParams.name}
            onChange={(e) =>
              setSearchParams({ ...searchParams, name: e.target.value })
            }
            className="input input-primary w-full"
          />
        </fieldset>
        <fieldset className="fieldset w-full">
          <legend className="fieldset-legend">
            Class <span className="text-error">*</span>
          </legend>
          <select
            className="select select-primary w-full"
            value={searchParams.class}
            onChange={(e) =>
              setSearchParams({ ...searchParams, class: e.target.value })
            }
          >
            <option value="">All Classes</option>
            {classes.map((className) => (
              <option key={className} value={className}>
                {className}
              </option>
            ))}
          </select>
        </fieldset>
      </div>
      <div className="overflow-x-auto mt-6 rounded-lg px-10">
        <table className="table table-zebra w-full bg-base-300 rounded-lg">
          <thead>
            <tr>
              <th>#</th>
              <th>Student ID</th>
              <th>Name</th>
              <th>School</th>
              <th>Class</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student, index) => (
                <tr key={student._id}>
                  <th>{index + 1}</th>
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
                  <td>
                    {student.school?.name || "N/A"},{" "}
                    {student.school?.village || "N/A"}
                  </td>
                  <td>{student.class?.name || "N/A"}</td>
                  <td>
                    <Link
                      href={`/admin/manage-students/view-student?studentId=${student._id}`}
                      className="btn btn-primary btn-sm"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center">
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
