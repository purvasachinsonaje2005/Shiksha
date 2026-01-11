"use client";

import Loading from "@/components/Loading";
import SectionTitle from "@/components/SectionTitle";
import { Class, Teacher } from "@/Types";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

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

export default function EditClassPage() {
  const [classData, setClassData] = useState<Class | null>(null);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  const searchParams = useSearchParams();
  const classId = searchParams.get("classId");

  const fetchTeachers = async () => {
    try {
      const response = await fetch("/api/principal/teachers");
      const data = await response.json();
      setTeachers(data.teachers);
    } catch (error) {
      console.error("Error fetching teachers:", error);
      toast.error("Failed to load teachers");
    }
  };

  const fetchClassData = async (id: string) => {
    try {
      const response = await fetch(
        `/api/principal/classes/get-class?classId=${id}`
      );
      const data = await response.json();
      setClassData(data.class);
    } catch (error) {
      console.error("Error fetching class data:", error);
      toast.error("Could not load class data");
    } finally {
      setLoading(false);
    }
  };

  const updateSubject = (
    index: number,
    key: "subjectName" | "teacher",
    value: string
  ) => {
    setClassData((prev) => {
      if (!prev) return prev;
      const subjects = [...prev.subjects!];
      subjects[index] = { ...subjects[index], [key]: value };
      return { ...prev, subjects };
    });
  };

  const handleAddSubject = () => {
    setClassData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        subjects: [...prev.subjects!, { subjectName: "", teacher: "" }],
      };
    });
  };

  const handleRemoveSubject = (index: number) => {
    setClassData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        subjects: prev.subjects?.filter((_, i) => i !== index),
      };
    });
  };

  const handleSaveClass = async () => {
    if (!classData) return;

    if (
      !classData.name ||
      !classData.subjects?.every(
        (s) => s.subjectName.trim() && s.teacher.trim()
      )
    ) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      setSaving(true);

      await toast.promise(
        axios.put("/api/principal/classes/update-class", {
          classId,
          classData,
        }),
        {
          loading: "Saving changes...",
          success: "Class updated successfully",
          error: "Failed to update class",
        }
      );

      // Reload page
      window.location.reload();
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (classId) {
      fetchTeachers();
      fetchClassData(classId);
    }
  }, [classId]);

  if (loading) return <Loading />;
  if (!classData) return <div>Class not found</div>;

  return (
    <>
      <SectionTitle title={`Edit Class: ${classData.name}`} />

      <div className="max-w-7xl mx-auto px-10">
        <Title title="Class Information" />
        <SubTitle title="Basic Information" />

        <div className="py-4 space-y-5">
          {/* Class Name */}
          <fieldset className="fieldset">
            <legend className="fieldset-legend">
              Class Name <span className="text-error">*</span>
            </legend>
            <input
              type="text"
              className="input w-full"
              value={classData.name}
              onChange={(e) =>
                setClassData((prev) =>
                  prev ? { ...prev, name: e.target.value } : prev
                )
              }
            />
          </fieldset>

          {/* Subjects List */}
          <div className="space-y-4">
            {classData.subjects.map((subject, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                {/* Subject Name */}
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">
                    Subject Name <span className="text-error">*</span>
                  </legend>
                  <input
                    type="text"
                    className="input w-full"
                    value={subject.subjectName}
                    onChange={(e) =>
                      updateSubject(index, "subjectName", e.target.value)
                    }
                  />
                </fieldset>

                {/* Teacher */}
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">
                    Assign Teacher <span className="text-error">*</span>
                  </legend>
                  <select
                    className="select select-bordered w-full"
                    value={subject.teacher}
                    onChange={(e) =>
                      updateSubject(index, "teacher", e.target.value)
                    }
                  >
                    <option value="">Select Teacher</option>
                    {teachers.map((t) => (
                      <option key={t._id} value={t._id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </fieldset>

                {/* Remove Button */}
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

          {/* Add Subject Button */}
          <button
            type="button"
            className="btn btn-secondary w-full"
            onClick={handleAddSubject}
          >
            Add Another Subject
          </button>

          {/* Save Class */}
          <button
            className={`btn btn-primary w-full`}
            disabled={saving}
            onClick={handleSaveClass}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </>
  );
}
