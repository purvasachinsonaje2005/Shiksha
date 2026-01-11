"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import SectionTitle from "@/components/SectionTitle";
import { Teacher } from "@/Types";

const Title = ({ title }: { title: string }) => (
  <div className="bg-primary/30 p-4 rounded-t-lg mt-8 mb-0">
    <h3 className="text-lg font-semibold uppercase">{title}</h3>
    <hr />
  </div>
);

const SubTitle = ({ title }: { title: string }) => (
  <h4 className="text-md font-semibold border-b text-center pt-2 bg-primary/20">
    {title}
  </h4>
);
export default function AddClass() {
  const [loading, setLoading] = useState(false);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classData, setClassData] = useState({
    name: "",
    subjects: [{ subjectName: "", teacher: "" }] as {
      subjectName: string;
      teacher: string;
    }[],
  });

  const handleAddSubject = () => {
    setClassData((prevClassData) => ({
      ...prevClassData,
      subjects: [...prevClassData.subjects, { subjectName: "", teacher: "" }],
    }));
  };

  const handleRemoveSubject = (index: number) => {
    setClassData((prevClassData) => ({
      ...prevClassData,
      subjects: prevClassData.subjects.filter((_, i) => i !== index),
    }));
  };

  const handleAddClass = async () => {
    if (
      !classData.name ||
      !classData.subjects.every(
        (subject) => subject.subjectName && subject.teacher
      )
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }
    try {
      setLoading(true);
      const res = axios.post("/api/principal/classes/add-class", { classData });
      toast.promise(res, {
        loading: "Adding Class...",
        success: () => {
          window.location.reload();
          return "Class Added Successfully";
        },
        error: (err: unknown) => `This just happened: ${err}`,
      });
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await fetch("/api/principal/teachers", {
        method: "GET",
      });
      const data = await response.json();
      setTeachers(data.teachers);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  return (
    <>
      <SectionTitle title="Add New Class" />
      <div className="max-w-7xl mx-auto px-10">
        <Title title="Class Information" />
        <SubTitle title="Basic Information" />
        <div className="py-4 space-y-5">
          <fieldset className="fieldset">
            <legend className="fieldset-legend">
              Class Name <span className="text-error">*</span>
            </legend>
            <input
              type="text"
              className="input w-full"
              placeholder="Enter Class Name"
              value={classData.name}
              onChange={(e) =>
                setClassData({ ...classData, name: e.target.value })
              }
            />
          </fieldset>
          <div className="space-y-4">
            {/* Render dynamic subjects */}
            {classData.subjects.map((subject, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">
                    Subject Name <span className="text-error">*</span>
                  </legend>
                  <input
                    type="text"
                    className="input w-full"
                    placeholder="Enter Subject Name"
                    value={subject.subjectName}
                    onChange={(e) => {
                      const updatedSubjects = [...classData.subjects];
                      updatedSubjects[index] = {
                        ...updatedSubjects[index],
                        subjectName: e.target.value,
                      };
                      setClassData({ ...classData, subjects: updatedSubjects });
                    }}
                  />
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">
                    Assign Teacher <span className="text-error">*</span>
                  </legend>
                  <select
                    className="select select-bordered w-full"
                    value={subject.teacher}
                    onChange={(e) => {
                      const updatedSubjects = [...classData.subjects];
                      updatedSubjects[index] = {
                        ...updatedSubjects[index],
                        teacher: e.target.value,
                      };
                      setClassData({ ...classData, subjects: updatedSubjects });
                    }}
                  >
                    <option value="">Select Teacher</option>
                    {teachers.map((teacher) => (
                      <option key={teacher._id} value={teacher._id}>
                        {teacher.name}
                      </option>
                    ))}
                  </select>
                </fieldset>
                <button
                  type="button"
                  className="btn btn-error mt-8.25 w-full"
                  onClick={() => handleRemoveSubject(index)}
                  disabled={classData.subjects.length === 1}
                >
                  Remove Subject
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="btn btn-secondary w-full"
            onClick={handleAddSubject}
          >
            Add Another Subject
          </button>
          <button
            className={`btn btn-primary ${
              loading ? "loading" : ""
            } w-full mt-4`}
            onClick={handleAddClass}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Class"}
          </button>
        </div>
      </div>
    </>
  );
}
