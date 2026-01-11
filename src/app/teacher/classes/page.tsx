"use client";
import SectionTitle from "@/components/SectionTitle";
import { useAuth } from "@/context/AuthContext";
import { Class } from "@/Types";
import { useEffect, useState } from "react";

export default function AssignedClassesPage() {
  const { user } = useAuth();
  const [classes, setClasses] = useState<Class[]>([]);
  const [searchParam, setSearchParam] = useState<string>("");
  const fetchCourses = async () => {
    try {
      const res = await fetch(`/api/teacher/classes?teacherId=${user?._id}`);
      if (res.ok) {
        const data = await res.json();
        setClasses(data.classes);
      } else {
        console.error("Failed to fetch assigned classes");
      }
    } catch (error) {
      console.error("Failed to fetch assigned classes");
    }
  };
  useEffect(() => {
    fetchCourses();
  }, []);
  const filteredClasses = classes.filter((cls) =>
    cls.name.toLowerCase().includes(searchParam.toLowerCase())
  );
  return (
    <>
      <SectionTitle title="Assigned Classes" />
      <fieldset className="fieldset w-full px-10">
        <legend className="fieldset-legend">
          Class Name <span className="text-error">*</span>
        </legend>
        <input
          type="text"
          placeholder="Enter Class Name"
          value={searchParam}
          onChange={(e) => setSearchParam(e.target.value)}
          className="input input-primary w-full"
        />
      </fieldset>
      <div className="overflow-x-auto mt-6 rounded-lg px-10">
        <table className="table table-zebra w-full bg-base-300 rounded-lg">
          <thead>
            <tr>
              <th>#</th>
              <th>Class Name</th>
              <th>Subject</th>
            </tr>
          </thead>
          <tbody>
            {classes.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center">
                  No assigned classes found.
                </td>
              </tr>
            ) : (
              classes.map((classItem, index) => (
                <tr key={classItem._id}>
                  <td>{index + 1}</td>
                  <td>{classItem.name}</td>
                  <td>
                    <ul className="list-disc">
                      {classItem.subjects?.map((subject) => (
                        <li key={subject.subjectName}>{subject.subjectName}</li>
                      ))}
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
