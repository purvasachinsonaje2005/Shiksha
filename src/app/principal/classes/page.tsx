"use client";
import Loading from "@/components/Loading";
import SectionTitle from "@/components/SectionTitle";
import { Class, Teacher } from "@/Types";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Classes() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [newClass, setNewClass] = useState<Partial<Class>>({});
  const [searchParam, setSearchParam] = useState<string>("");
  const fetchClasses = async () => {
    try {
      const response = await fetch("/api/principal/classes", { method: "GET" });
      const data = await response.json();
      setClasses(data.classes);
    } catch (error) {
      console.error("Error fetching classes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  if (loading) return <Loading />;

  const filteredClasses = classes.filter((cls) =>
    cls.name.toLowerCase().includes(searchParam.toLowerCase())
  );

  return (
    <>
      <SectionTitle title="Manage Classes" />
      <div className="flex flex-row gap-4 px-10">
        <fieldset className="fieldset w-full">
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
        <Link
          href={"/principal/classes/add-class"}
          className="btn btn-primary lg:mt-8"
        >
          Add New Class
        </Link>
      </div>
      <div className="overflow-x-auto mt-6 rounded-lg px-10">
        <table className="table table-zebra w-full bg-base-300 rounded-lg">
          <thead>
            <tr>
              <th>#</th>
              <th>Class Name</th>
              <th>Subjects</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClasses.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center">
                  No classes found.
                </td>
              </tr>
            ) : (
              filteredClasses.map((cls, index) => (
                <tr key={cls._id}>
                  <td>{index + 1}</td>
                  <td>{cls.name}</td>
                  <td>
                    <ul>
                      {cls.subjects?.map((subject) => (
                        <li key={subject.subjectName}>
                          {subject.subjectName} : {subject.teacher.name}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>
                    <Link
                      href={`/principal/classes/edit-class?classId=${cls._id}`}
                      className="btn btn-sm btn-primary"
                    >
                      Edit
                    </Link>
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
