"use client";
import Loading from "@/components/Loading";
import SectionTitle from "@/components/SectionTitle";
import { Student } from "@/Types";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";

export default function ViewStudentPage() {
  const searchParam = useSearchParams();
  const studentId = searchParam.get("studentId");

  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [risk, setRisk] = useState({
    dropout: null as number | null,
    probability: null as number | null,
    analysis: "",
  });

  const fetchStudentDetails = async (id: string) => {
    setLoading(true);
    try {
      const studentRes = await axios.get(
        `/api/students/get-student-by-id?studentId=${id}`
      );
      setStudent(studentRes.data.student);
    } catch (error) {
      console.error("Error fetching student details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (studentId) fetchStudentDetails(studentId);
  }, [studentId]);

  const analyzeDropout = async () => {
    if (!studentId) return;

    setAnalyzing(true);
    try {
      const res = await axios.get(
        `/api/analyze-student?studentId=${studentId}`
      );
      setRisk({
        dropout: res.data.dropout,
        probability: res.data.probability,
        analysis: res.data.analysis,
      });
      console.log("Dropout analysis result:", res.data);
    } catch (error) {
      console.error("Error analyzing dropout risk:", error);
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading || analyzing) return <Loading />;

  return (
    <>
      <SectionTitle title="Student Details" />

      {!student ? (
        <div className="text-center text-lg font-bold text-error">
          Student not found!
        </div>
      ) : (
        <div className="px-10 pb-4 space-y-6">
          {/* ---------------- PROFILE CARD ---------------- */}
          <div className="card bg-base-200 shadow-xl p-6">
            <div className="flex items-center gap-4">
              <div className="avatar">
                <div className="w-20 rounded-full">
                  {student.profileImage ? (
                    <img
                      src={`data:${
                        student.profileImage.contentType
                      };base64,${Buffer.from(
                        student.profileImage.data
                      ).toString("base64")}`}
                      alt="profile"
                    />
                  ) : (
                    <img src="/no-user.png" alt="Default" />
                  )}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold">{student.name}</h2>
                <p className="text-sm opacity-80">ID: {student.studentId}</p>
                <p className="text-sm opacity-80">Email: {student.email}</p>
                <p className="text-sm opacity-80">Phone: {student.phone}</p>
              </div>
            </div>
          </div>

          {/* ---------------- BASIC INFO ---------------- */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card bg-base-200 shadow p-6">
              <h3 className="text-lg font-bold mb-3">Basic Information</h3>
              <p>
                <strong>Age:</strong> {student.age}
              </p>
              <p>
                <strong>Gender:</strong> {student.gender}
              </p>
              <p>
                <strong>Date of Birth:</strong>{" "}
                {new Date(student.dateOfBirth).toLocaleDateString()}
              </p>
              <p>
                <strong>Address:</strong> {student.address}
              </p>
              <p>
                <strong>Travel Time:</strong> {student.travelTime} hrs
              </p>
              <p>
                <strong>Internet Access:</strong> {student.internetAccess}
              </p>
            </div>

            {/* ---------------- FAMILY INFO ---------------- */}
            <div className="card bg-base-200 shadow p-6">
              <h3 className="text-lg font-bold mb-3">Family Information</h3>
              <p>
                <strong>Father:</strong> {student.father.name}
              </p>
              <p>
                <strong>Father Occupation:</strong> {student.father.occupation}
              </p>
              <p>
                <strong>Father Education:</strong>{" "}
                {student.father.educationLevel}
              </p>
              <br />
              <p>
                <strong>Mother:</strong> {student.mother.name}
              </p>
              <p>
                <strong>Mother Occupation:</strong> {student.mother.occupation}
              </p>
              <p>
                <strong>Mother Education:</strong>{" "}
                {student.mother.educationLevel}
              </p>
              <br />
              <p>
                <strong>Family Size:</strong> {student.familySize}
              </p>
              <p>
                <strong>Family Relationship Quality:</strong>{" "}
                {student.familyRelationship}
              </p>
            </div>

            {/* ---------------- ACADEMIC INFO ---------------- */}
            <div className="card bg-base-200 shadow p-6">
              <h3 className="text-lg font-bold mb-3">Academic Details</h3>
              <p>
                <strong>Final Grade:</strong> {student.finalGrade}
              </p>
              <p>
                <strong>Mid Grade:</strong> {student.grade2}
              </p>
              <p>
                <strong>Starting Grade:</strong> {student.grade1}
              </p>
              <p>
                <strong>Failures:</strong> {student.numberOfFailures}
              </p>
              <p>
                <strong>Study Time:</strong> {student.studyTime}
              </p>
              <p>
                <strong>Reason for school:</strong>{" "}
                {student.reasonForChoosingSchool}
              </p>
            </div>

            {/* ---------------- PERSONAL HABITS ---------------- */}
            <div className="card bg-base-200 shadow p-6">
              <h3 className="text-lg font-bold mb-3">Behavior & Habits</h3>
              <p>
                <strong>Free Time:</strong> {student.freeTime}
              </p>
              <p>
                <strong>Going Out:</strong> {student.goingOut}
              </p>
              <p>
                <strong>Weekday Drinking:</strong>{" "}
                {student.weekdayAlcoholConsumption}
              </p>
              <p>
                <strong>Weekend Drinking:</strong>{" "}
                {student.weekendAlcoholConsumption}
              </p>
              <p>
                <strong>Health:</strong> {student.healthStatus}
              </p>
              <p>
                <strong>Extra Activities:</strong>{" "}
                {student.extraCurricularActivities}
              </p>
              <p>
                <strong>In Relationship:</strong> {student.inRelationship}
              </p>
              <p>
                <strong>Wants Higher Education:</strong>{" "}
                {student.wantsHigherEducation}
              </p>
            </div>
          </div>

          {/* ---------------- DROPOUT RISK ---------------- */}
          {risk !== null && (
            <div className="card bg-base-200 shadow-xl p-6">
              <h3 className="text-xl font-bold mb-2">
                Dropout Risk Prediction
              </h3>

              <p className="text-lg">
                Dropout Prediction :{" "}
                {risk.dropout === 0
                  ? "Student is not at risk of dropping out."
                  : "Student is at risk of dropping out."}
              </p>

              <p className="text-lg">
                Risk Score:{" "}
                <span
                  className={
                    risk?.probability! < 0.3
                      ? "text-success"
                      : risk?.probability! < 0.7
                      ? "text-warning"
                      : "text-error"
                  }
                >
                  {(risk?.probability! * 100).toFixed(1)}%
                </span>
              </p>
              <Markdown>{risk.analysis!}</Markdown>
            </div>
          )}

          {/* ---------------- ANALYZE BUTTON ---------------- */}
          <div className="flex justify-center mt-6 mb-4">
            <button
              className="btn btn-primary btn-lg"
              onClick={analyzeDropout}
              disabled={analyzing}
            >
              {analyzing ? "Analyzing..." : "Analyze Student Dropout Risk"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
