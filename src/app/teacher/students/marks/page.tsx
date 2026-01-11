"use client";
import Loading from "@/components/Loading";
import SectionTitle from "@/components/SectionTitle";
import { useAuth } from "@/context/AuthContext";
import { Class, Result, Student, Teacher } from "@/Types";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function MarksPage() {
  const { user } = useAuth() as { user: Teacher };
  const [results, setResults] = useState<Result[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
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

  const fetchMarks = async () => {
    if (!selectedClass || !selectedStudent)
      return toast.error("Please select class and student");
    setLoading(true);
    try {
      const res = await axios.get(
        `/api/teacher/results/get-results?classId=${selectedClass._id}&studentId=${selectedStudent._id}`
      );
      setResults(res.data.results);
    } catch (error) {
      console.error("Error fetching marks:", error);
      toast.error("Failed to fetch marks");
    } finally {
      setLoading(false);
    }
  };
  if (loading) return <Loading />;
  return (
    <>
      <SectionTitle title="Students Marks" />
      <div className="grid lg:grid-cols-3 grid-cols-1 gap-4 px-10 mb-8">
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
              setSelectedClass(found);
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

        <div className="mt-0 lg:mt-8 flex lg:flex-row flex-col gap-4 w-full">
          <button
            className="btn btn-secondary"
            onClick={() => {
              fetchMarks();
            }}
          >
            View Marks
          </button>
          <Link
            href={"/teacher/students/marks/add-new-marks"}
            className="btn btn-primary"
          >
            Add New Marks
          </Link>
        </div>
      </div>
      {results && (
        <div className="overflow-x-auto px-10 mb-10">
          <table className="table table-zebra w-full bg-base-300 rounded-lg">
            <thead>
              <tr>
                <th>#</th>
                <th>Student Name</th>
                <th>Class</th>
                <th>Exam Type</th>
                <th>Subject / Marks</th>
              </tr>
            </thead>
            <tbody>
              {!results || results.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center">
                    No marks available. Please select class & student to view
                    marks.
                  </td>
                </tr>
              ) : (
                results.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.student.name}</td>
                    <td>{item.class.name}</td>
                    <td>{item.examType}</td>
                    <td>
                      <ul>
                        {item.subjectResults.map((subject, idx) => (
                          <li key={idx}>
                            {subject.subjectName}: {subject.marks} /{" "}
                            {subject.maxMarks}
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
