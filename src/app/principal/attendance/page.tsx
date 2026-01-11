"use client";
import Loading from "@/components/Loading";
import SectionTitle from "@/components/SectionTitle";
import { Attendance } from "@/Types";
import axios from "axios";
import { useEffect, useState } from "react";

export default function AttendancePage() {
  const [attendanceData, setAttendanceData] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedAttendance, setSelectedAttendance] =
    useState<Attendance | null>(null);

  const [searchParams, setSearchParams] = useState({
    date: "",
    class: "",
  });

  const fetchAttendanceData = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/principal/attendance");
      setAttendanceData(res.data);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  if (loading) return <Loading />;

  // Filter logic
  const filteredAttendance = attendanceData.filter((record) => {
    const matchesClass = searchParams.class
      ? record.class.name
          .toLowerCase()
          .includes(searchParams.class.toLowerCase())
      : true;

    const formattedDate = new Date(record.date).toISOString().split("T")[0];
    const matchesDate = searchParams.date
      ? formattedDate === searchParams.date
      : true;

    return matchesClass && matchesDate;
  });

  return (
    <>
      <SectionTitle title="Attendance Records" />

      {/* FILTERS */}
      <div className="flex flex-row gap-4 px-10 mt-4">
        <fieldset className="fieldset w-full">
          <legend className="fieldset-legend">Class Name</legend>
          <input
            type="text"
            placeholder="Enter Class Name"
            value={searchParams.class}
            onChange={(e) =>
              setSearchParams({ ...searchParams, class: e.target.value })
            }
            className="input input-primary w-full"
          />
        </fieldset>

        <fieldset className="fieldset w-full">
          <legend className="fieldset-legend">Date</legend>
          <input
            type="date"
            value={searchParams.date}
            onChange={(e) =>
              setSearchParams({ ...searchParams, date: e.target.value })
            }
            className="input input-primary w-full"
          />
        </fieldset>
      </div>

      {/* RECORDS TABLE */}
      <div className="px-10 mt-8">
        <div className="overflow-x-auto bg-base-200 rounded-xl shadow">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Class</th>
                <th>Date</th>
                <th>Teacher</th>
                <th>Present</th>
                <th>Absent</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendance.length === 0 ? (
                <tr key={"no-records"}>
                  <td colSpan={7} className="text-center opacity-50 py-6">
                    No attendance records found.
                  </td>
                </tr>
              ) : (
                filteredAttendance.map((record: Attendance, index) => {
                  const presentCount = record.records.filter(
                    (r: any) => r.status === "Present"
                  ).length;

                  const absentCount = record.records.filter(
                    (r: any) => r.status === "Absent"
                  ).length;

                  return (
                    <>
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{record.class.name}</td>
                        <td>{new Date(record.date).toLocaleDateString()}</td>
                        <td>{record.teacher.name}</td>
                        <td className="text-success font-bold">
                          {presentCount}
                        </td>
                        <td className="text-error font-bold">{absentCount}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => {
                              setSelectedAttendance(record);
                              (
                                document.getElementById(
                                  "details-attendance"
                                ) as HTMLDialogElement
                              ).showModal();
                            }}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    </>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      <dialog id={`details-attendance`} className="modal">
        <div className="modal-box w-11/12 max-w-4xl">
          <h3 className="font-bold text-lg mb-4">
            Attendance Details - {selectedAttendance?.class.name} on{" "}
            {new Date(selectedAttendance?.date || "").toDateString()}
          </h3>

          <div className="overflow-x-auto bg-base-300 rounded-xl shadow">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Student</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {selectedAttendance?.records.map((rec: any, i: number) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{rec.student.name}</td>
                    <td
                      className={
                        rec.status === "Present"
                          ? "text-success font-bold"
                          : "text-error font-bold"
                      }
                    >
                      {rec.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-error">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}
