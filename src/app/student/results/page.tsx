"use client";

import Loading from "@/components/Loading";
import SectionTitle from "@/components/SectionTitle";
import { useAuth } from "@/context/AuthContext";
import { Result } from "@/Types";
import axios from "axios";
import { useState, useEffect } from "react";

export default function ResultsPage() {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const fetchResults = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/students/results");
      setResults(res.data.results);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching results:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  if (loading) return <Loading />;

  return (
    <>
      <SectionTitle title="Your Results" />
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
    </>
  );
}
