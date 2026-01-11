"use client";

import { useAuth } from "@/context/AuthContext";
import SectionTitle from "@/components/SectionTitle";
import Loading from "@/components/Loading";
import { Student } from "@/Types";
import { useEffect, useState } from "react";
import { Line, Pie } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";
import {
  IconAlertCircle,
  IconCalendarWeek,
  IconNumber,
  IconSchool,
} from "@tabler/icons-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

interface DashboardData {
  attendanceTrend: { labels: string[]; data: number[] };
  recentMarks: { subject: string; marks: number }[];
}

export default function StudentDashboardPage() {
  const { user } = useAuth() as { user: Student };
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/students/dashboard`);
      setDashboardData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) fetchDashboard();
  }, [user]);

  if (loading || !dashboardData) return <Loading />;

  const { attendanceTrend, recentMarks } = dashboardData;

  const averageMarks =
    recentMarks.reduce((acc, curr) => acc + curr.marks, 0) /
    (recentMarks.length || 1);

  const latestAttendance = (attendanceTrend.data.slice(-1)[0] || 0) * 100;

  return (
    <>
      <SectionTitle title={`Welcome, ${user.name}!`} />

      <div className="px-10">
        <div className="stats shadow bg-base-200 w-full">
          {/* Attendance Card */}
          <div className="stat">
            <div className="stat-figure text-primary">
              <IconCalendarWeek size={40} />
            </div>
            <div className="stat-title">Attendance</div>
            <div className="stat-value text-primary">
              {latestAttendance.toFixed(1)}%
            </div>
          </div>

          {/* Avg Marks Card */}
          <div className="stat">
            <div className="stat-figure text-secondary">
              <IconNumber size={40} />
            </div>
            <div className="stat-title">Average Marks</div>
            <div className="stat-value text-secondary">
              {averageMarks.toFixed(1)}
            </div>
          </div>

          {/* Risk Score Card */}
          <div className="stat">
            <div className="stat-figure text-error">
              <IconAlertCircle size={40} />
            </div>
            <div className="stat-title">Dropout Risk</div>
            <p className="stat-value text-error">
              {user.dropoutPrediction?.willDropout === "yes"
                ? "At Risk"
                : "Safe"}
            </p>
          </div>

          {/* Class Card */}
          <div className="stat">
            <div className="stat-figure text-accent">
              <IconSchool size={40} />
            </div>
            <div className="stat-title">Class</div>
            <div className="stat-value text-accent">{user.class?.name}</div>
          </div>
        </div>
      </div>

      {/* --- CHARTS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-10 my-8">
        {/* Attendance Trend */}
        <div className="bg-base-200 p-4 shadow rounded-xl">
          <h3 className="text-lg font-bold mb-4 text-center uppercase">
            Attendance Trend
          </h3>
          <Line
            data={{
              labels: attendanceTrend.labels,
              datasets: [
                {
                  label: "Attendance %",
                  data: attendanceTrend.data.map((v) => v * 100),
                  borderColor: "rgba(37, 99, 235, 1)",
                  backgroundColor: "rgba(37, 99, 235, 0.2)",
                  fill: true,
                  tension: 0.4,
                },
              ],
            }}
          />
        </div>

        {/* Risk Pie */}
        <div className="bg-base-200 p-4 rounded-xl shadow h-120 flex flex-col items-center">
          <h3 className="text-lg font-bold mb-4 text-center uppercase">
            Dropout Risk Levels
          </h3>
          <Pie
            data={{
              labels: ["Risk", "Safe"],
              datasets: [
                {
                  data: [
                    user.dropoutPrediction?.confidence! * 100,
                    100 - (user.dropoutPrediction?.confidence ?? 0) * 100,
                  ],
                  backgroundColor: ["#ef4444", "#22c55e"],
                },
              ],
            }}
          />
        </div>
      </div>
    </>
  );
}
