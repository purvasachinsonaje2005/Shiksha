"use client";
import Loading from "@/components/Loading";
import SectionTitle from "@/components/SectionTitle";
import { Student } from "@/Types";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function ManageStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useState({
    name: "",
    class: "",
  });
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/students/by-school");
      setStudents(response.data.students);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("Failed to fetch students. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredStudents = students.filter((student) => {
    return (
      student.name.toLowerCase().includes(searchParams.name.toLowerCase()) &&
      student.class?.name
        .toLowerCase()
        .includes(searchParams.class.toLowerCase())
    );
  });

  if (loading) return <Loading />;

  return (
    <>
      <SectionTitle title="Manage Students" />
      <div className="flex flex-row gap-4 px-10">
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
          <input
            type="text"
            placeholder="Enter Class"
            value={searchParams.class}
            onChange={(e) =>
              setSearchParams({ ...searchParams, class: e.target.value })
            }
            className="input input-primary w-full"
          />
        </fieldset>
        <Link
          href={"/principal/manage-students/add-student"}
          className="btn btn-primary lg:mt-8"
        >
          Add New Student
        </Link>
      </div>
      <div className="overflow-x-auto mt-6 rounded-lg px-10">
        <table className="table table-zebra w-full bg-base-300 rounded-lg">
          <thead>
            <tr>
              <th>#</th>
              <th>Student ID</th>
              <th>Name</th>
              <th>Risk</th>
              <th>Confidence</th>
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
                      <div>
                        <div className="font-bold">{student.name}</div>
                      </div>
                    </div>
                  </td>
                  <td>{student.class?.name || "N/A"}</td>
                  <td className="capitalize">
                    {student.dropoutPrediction?.willDropout || "N/A"}
                  </td>
                  <td>
                    {(student.dropoutPrediction?.confidence.toFixed(
                      2
                    ) as unknown as number) * 100 || "N/A"}
                    %
                  </td>
                  <td>
                    <Link
                      href={`/principal/manage-students/view-student?studentId=${student._id}`}
                      className="btn btn-sm btn-primary"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center">
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
