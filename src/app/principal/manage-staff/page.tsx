"use client";
import Loading from "@/components/Loading";
import SectionTitle from "@/components/SectionTitle";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Teacher {
  _id: string;
  name: string;
  email: string;
  phone: string;
  qualifications: string;
  profileImage: {
    data: Buffer;
    contentType: string;
  };
  assignedSubjects: {
    className: string;
    subjectName: string;
  }[];
}

export default function ManageStaffPage() {
  const [searchParams, setSearchParams] = useState({
    name: "",
  });
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const fetchTeachers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/principal/teachers");
      const data = await res.json();
      setTeachers(data.teachers);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchTeachers();
  }, []);
  const filteredTeachers = teachers.filter((teacher) =>
    teacher.name.includes(searchParams.name)
  );
  if (isLoading) return <Loading />;
  return (
    <>
      <SectionTitle title="Manage Staff" />
      <div className="flex flex-row gap-4 px-10">
        <fieldset className="fieldset w-full">
          <legend className="fieldset-legend">
            Teacher Name <span className="text-error">*</span>
          </legend>
          <input
            type="text"
            placeholder="Enter Teacher Name"
            value={searchParams.name}
            onChange={(e) =>
              setSearchParams({ ...searchParams, name: e.target.value })
            }
            className="input input-primary w-full"
          />
        </fieldset>
        <Link
          href={"/principal/manage-staff/add-teacher"}
          className="btn btn-primary lg:mt-8"
        >
          Add New Teacher
        </Link>
      </div>
      <div className="overflow-x-auto mt-6 rounded-lg px-10">
        <table className="table table-zebra w-full bg-base-300 rounded-lg">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Qualifications</th>
              <th>Assigned Subjects / Classes</th>
            </tr>
          </thead>
          <tbody>
            {filteredTeachers.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center">
                  No teachers found.
                </td>
              </tr>
            ) : (
              filteredTeachers.map((teacher, index) => (
                <tr key={teacher._id}>
                  <td>{index + 1}</td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle h-12 w-12">
                          <img
                            src={`data:${
                              teacher.profileImage.contentType
                            };base64,${Buffer.from(
                              teacher.profileImage.data
                            ).toString("base64")}`}
                            alt={`${teacher.name} Profile`}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{teacher.name}</div>
                      </div>
                    </div>
                  </td>
                  <td>{teacher.email}</td>
                  <td>{teacher.phone}</td>
                  <td>{teacher.qualifications}</td>
                  <td>
                    <ul>
                      {teacher.assignedSubjects.map(
                        (assignment: any, idx: number) => (
                          <li key={idx}>
                            {assignment.subjectName} - Class{" "}
                            {assignment.className}
                          </li>
                        )
                      )}
                    </ul>
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
