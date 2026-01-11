"use client";
import Loading from "@/components/Loading";
import SectionTitle from "@/components/SectionTitle";
import { useAuth } from "@/context/AuthContext";
import { Class, Result, Student, Teacher } from "@/Types";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AddMarksPage() {
  const { user } = useAuth() as { user: Teacher };

  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);

  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const [marks, setMarks] = useState<any[]>([]);
  const [examType, setExamType] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const studentsResponse = await fetch("/api/teacher/students");
      const classesResponse = await fetch(
        `/api/teacher/classes?teacherId=${user._id}`
      );

      const studentsData = await studentsResponse.json();
      const classesData = await classesResponse.json();

      setStudents(studentsData.students);
      setClasses(classesData.classes);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleClassSelect = (cls: Class | null) => {
    setSelectedClass(cls);
    if (cls) {
      const subjectMarks = cls.subjects?.map((subject) => ({
        subjectName: subject.subjectName,
        marks: "",
        maxMarks: 100,
      }));
      setMarks(subjectMarks!);
    } else {
      setMarks([]);
    }
  };

  const saveResult = async () => {
    if (!selectedClass || !selectedStudent || !examType) {
      toast.error("Please select class, student, and exam type");
      return;
    }
    try {
      const res = axios.post("/api/teacher/results", {
        student: selectedStudent._id,
        classId: selectedClass._id,
        examType,
        marks,
        teacherId: user._id,
      });
      toast.promise(res, {
        loading: "Saving marks...",
        success: () => {
          setSelectedClass(null);
          setSelectedStudent(null);
          setExamType("");
          setMarks([]);
          return "Marks saved successfully";
        },
        error: "Error saving marks",
      });
    } catch (err) {
      console.error(err);
      toast.error("Error saving marks");
    }
  };

  if (loading) return <Loading />;

  return (
    <>
      <SectionTitle title="Add Marks" />

      <div className="flex lg:flex-row flex-col gap-4 w-full px-10">
        {/* Select Class */}
        <fieldset className="fieldset w-full">
          <legend className="fieldset-legend">
            Select Class <span className="text-error">*</span>
          </legend>

          <select
            className="select select-primary w-full"
            value={selectedClass?._id || ""}
            onChange={(e) => {
              const found =
                classes.find((cls) => cls._id === e.target.value) || null;
              handleClassSelect(found);
            }}
          >
            <option value="">Select Class</option>
            {classes.map((classItem) => (
              <option key={classItem._id} value={classItem._id}>
                {classItem.name}
              </option>
            ))}
          </select>
        </fieldset>

        {/* Select Student */}
        <fieldset className="fieldset w-full">
          <legend className="fieldset-legend">
            Select Student<span className="text-error">*</span>
          </legend>

          <select
            className="select select-primary w-full"
            value={selectedStudent?._id || ""}
            onChange={(e) => {
              const found =
                students.find((stu) => stu._id === e.target.value) || null;
              setSelectedStudent(found);
            }}
          >
            <option value="">Select Student</option>
            {students
              .filter((stu) => selectedClass?.students?.includes(stu._id!))
              .map((student) => (
                <option key={student._id} value={student._id}>
                  {student.name}
                </option>
              ))}
          </select>
        </fieldset>

        {/* Exam Type */}
        <fieldset className="fieldset w-full">
          <legend className="fieldset-legend">Exam Type</legend>
          <select
            className="select select-secondary w-full"
            value={examType}
            onChange={(e) => setExamType(e.target.value)}
          >
            <option value="">Select Exam</option>
            <option value="FA1">FA1</option>
            <option value="FA2">FA2</option>
            <option value="MidTerm">Mid Term</option>
            <option value="Final">Final</option>
            <option value="Custom">Custom</option>
          </select>
        </fieldset>
      </div>

      {/* --- SUBJECT MARKS TABLE --- */}
      {selectedClass && selectedStudent && (
        <div className="overflow-x-auto px-10 mt-8">
          <table className="table table-zebra w-full bg-base-300 rounded-lg">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Marks</th>
                <th>Max Marks</th>
              </tr>
            </thead>
            <tbody>
              {marks.map((item, index) => (
                <tr key={index}>
                  <td>{item.subjectName}</td>
                  <td>
                    <input
                      type="number"
                      className="input input-bordered w-32"
                      value={item.marks}
                      onChange={(e) => {
                        const newMarks = [...marks];
                        newMarks[index].marks = Number(e.target.value);
                        setMarks(newMarks);
                      }}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="input input-bordered w-32"
                      value={item.maxMarks}
                      onChange={(e) => {
                        const newMarks = [...marks];
                        newMarks[index].maxMarks = Number(e.target.value);
                        setMarks(newMarks);
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* --- SAVE BUTTON --- */}
          <div className="mt-6 flex justify-end">
            <button className="btn btn-primary" onClick={saveResult}>
              Save Marks
            </button>
          </div>
        </div>
      )}
    </>
  );
}
