"use client";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

import {
  IconChalkboard,
  IconUsersGroup,
  IconClipboardCheck,
  IconBrain,
} from "@tabler/icons-react";

import { Line, Pie } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import SectionTitle from "@/components/SectionTitle";
import Loading from "@/components/Loading";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface TeacherDashboardData {
  assignedClasses: number;
  totalStudents: number;
  pendingAttendance: number;
  atRiskStudents: number;

  attendanceTrend: {
    labels: string[];
    data: number[];
  };

  riskDistribution: {
    data: number[];
  };
}

export default function TeacherDashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const [dashboardData, setDashboardData] = useState<TeacherDashboardData>({
    assignedClasses: 0,
    totalStudents: 0,
    pendingAttendance: 0,
    atRiskStudents: 0,

    attendanceTrend: {
      labels: [],
      data: [],
    },

    riskDistribution: {
      data: [0, 0, 0],
    },
  });

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/teacher/stats");
      const data: TeacherDashboardData = await res.json();
      setDashboardData(data);
    } catch (err) {
      console.error("Failed to load teacher dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) return <Loading />;

  return (
    <>
      <SectionTitle title={`Welcome, ${user?.name}!`} />

      {/* TOP STATS */}
      <div className="w-full flex justify-center px-8 lg:px-20">
        <div className="stats shadow stats-vertical lg:stats-horizontal bg-base-200 w-full">
          <div className="stat">
            <div className="stat-figure text-primary">
              <IconChalkboard size={32} />
            </div>
            <div className="stat-title">Assigned Classes</div>
            <div className="stat-value text-primary">
              {dashboardData.assignedClasses}
            </div>
          </div>

          <div className="stat">
            <div className="stat-figure text-secondary">
              <IconUsersGroup size={32} />
            </div>
            <div className="stat-title">Total Students</div>
            <div className="stat-value text-secondary">
              {dashboardData.totalStudents}
            </div>
          </div>

          <div className="stat">
            <div className="stat-figure text-accent">
              <IconClipboardCheck size={32} />
            </div>
            <div className="stat-title">Pending Attendance</div>
            <div className="stat-value text-accent">
              {dashboardData.pendingAttendance}
            </div>
          </div>

          <div className="stat">
            <div className="stat-figure text-primary">
              <IconBrain size={32} />
            </div>
            <div className="stat-title">At-Risk Students</div>
            <div className="stat-value text-primary">
              {dashboardData.atRiskStudents}
            </div>
          </div>
        </div>
      </div>

      {/* CHART SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-8 lg:px-20 my-6">
        <div className="bg-base-200 p-4 rounded-xl shadow">
          <h3 className="text-lg font-bold mb-4 text-center uppercase">
            Attendance Trend
          </h3>
          <Line
            data={{
              labels: dashboardData.attendanceTrend.labels,
              datasets: [
                {
                  label: "Attendance %",
                  data: dashboardData.attendanceTrend.data,
                  borderColor: "#3b82f6",
                  backgroundColor: "rgba(59,130,246,0.3)",
                },
              ],
            }}
          />
        </div>

        <div className="bg-base-200 p-4 rounded-xl shadow h-96 flex flex-col items-center justify-center">
          <h3 className="text-lg font-bold mb-4 text-center uppercase">
            AI Risk Distribution
          </h3>
          <Pie
            data={{
              labels: ["Low", "Medium", "High"],
              datasets: [
                {
                  data: dashboardData.riskDistribution.data,
                  backgroundColor: ["#34d399", "#fbbf24", "#ef4444"],
                },
              ],
            }}
          />
        </div>
      </div>
    </>
  );
}
