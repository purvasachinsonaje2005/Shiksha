"use client";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

import {
  IconUsersGroup,
  IconChalkboard,
  IconSchool,
  IconChartBar,
} from "@tabler/icons-react";

import { Line, Bar, Pie } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import SectionTitle from "@/components/SectionTitle";
import Loading from "@/components/Loading";
import { School } from "@/Types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface PrincipalDashboardData {
  totalTeachers: number;
  totalStudents: number;
  totalScholarships: number;
  totalClasses: number;

  attendanceLabels: string[];
  attendanceData: number[];

  studentsPerClassLabels: string[];
  studentsPerClassData: number[];

  riskDistribution: number[];
}

export default function HeadmasterDashboardPage() {
  const { user } = useAuth() as { user: School };
  const [loading, setLoading] = useState(false);

  const [dashboardData, setDashboardData] = useState<PrincipalDashboardData>({
    totalTeachers: 0,
    totalStudents: 0,
    totalScholarships: 0,
    totalClasses: 0,

    attendanceLabels: [],
    attendanceData: [],

    studentsPerClassLabels: [],
    studentsPerClassData: [],

    riskDistribution: [0, 0, 0],
  });

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/principal/dashboard");
      const data = await res.json();
      setDashboardData(data);
    } catch (error) {
      console.error("Failed to load principal dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) return <Loading />;

  // -----------------------------------------------
  // CHART CONFIGS HERE (COLORS ARE PLACED HERE)
  // -----------------------------------------------

  const attendanceChart = {
    labels: dashboardData.attendanceLabels,
    datasets: [
      {
        label: "Attendance %",
        data: dashboardData.attendanceData,
        borderColor: "#0ea5e9",
        backgroundColor: "rgba(14,165,233,0.3)",
        tension: 0.3,
      },
    ],
  };

  const studentsPerClassChart = {
    labels: dashboardData.studentsPerClassLabels,
    datasets: [
      {
        label: "Students",
        data: dashboardData.studentsPerClassData,
        backgroundColor: "rgba(79,70,229,0.7)",
      },
    ],
  };

  const riskChart = {
    labels: ["Low", "Medium", "High"],
    datasets: [
      {
        label: "Risk Levels",
        data: dashboardData.riskDistribution,
        backgroundColor: ["#34d399", "#fbbf24", "#ef4444"],
      },
    ],
  };

  return (
    <>
      <SectionTitle title={`Welcome Principal, ${user?.principal.name}!`} />

      {/* STATS */}
      <div className="w-full flex justify-center px-8 lg:px-20">
        <div className="stats shadow stats-vertical lg:stats-horizontal w-full bg-base-200">
          <div className="stat">
            <div className="stat-figure text-primary">
              <IconChalkboard size={32} />
            </div>
            <div className="stat-title">Total Teachers</div>
            <div className="stat-value text-primary">
              {dashboardData.totalTeachers || 0}
            </div>
          </div>

          <div className="stat">
            <div className="stat-figure text-secondary">
              <IconUsersGroup size={32} />
            </div>
            <div className="stat-title">Total Students</div>
            <div className="stat-value text-secondary">
              {dashboardData.totalStudents || 0}
            </div>
          </div>

          <div className="stat">
            <div className="stat-figure text-accent">
              <IconSchool size={32} />
            </div>
            <div className="stat-title">Total Classes</div>
            <div className="stat-value text-accent">
              {dashboardData.totalClasses || 0}
            </div>
          </div>

          <div className="stat">
            <div className="stat-figure text-primary">
              <IconChartBar size={32} />
            </div>
            <div className="stat-title">Scholarships</div>
            <div className="stat-value text-primary">
              {dashboardData.totalScholarships || 0}
            </div>
          </div>
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-8 lg:px-20 my-6">
        <div className="bg-base-200 p-4 rounded-xl shadow">
          <h3 className="text-lg font-bold mb-4 text-center uppercase">
            Attendance Trend
          </h3>
          <Line data={attendanceChart} />
        </div>

        <div className="bg-base-200 p-4 rounded-xl shadow">
          <h3 className="text-lg font-bold mb-4 text-center uppercase">
            Students Per Class
          </h3>
          <Bar data={studentsPerClassChart} />
        </div>

        <div className="bg-base-200 p-4 rounded-xl shadow col-span-1 lg:col-span-2 h-120 flex flex-col items-center">
          <h3 className="text-lg font-bold mb-4 text-center uppercase">
            AI Risk Level Distribution
          </h3>
          <Pie data={riskChart} />
        </div>
      </div>
    </>
  );
}
