"use client";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import {
  IconSchool,
  IconUserShield,
  IconUsersGroup,
  IconMoneybag,
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

// Cleaned Admin Dashboard Types
interface DashboardData {
  totalSchools: number;
  totalHeadmasters: number;
  totalStudents: number;
  totalScholarships: number;
  riskDistribution: number[];
  schoolsRegisteredLabels: string[];
  schoolsRegisteredData: number[];

  studentsGrowthLabels: string[];
  studentsGrowthData: number[];
}

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalSchools: 0,
    totalHeadmasters: 0,
    totalStudents: 0,
    totalScholarships: 0,

    riskDistribution: [0, 0, 0],

    schoolsRegisteredLabels: [],
    schoolsRegisteredData: [],

    studentsGrowthLabels: [],
    studentsGrowthData: [],
  });

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/dashboard");
      const data: DashboardData = await res.json();
      setDashboardData(data);
    } catch (error) {
      console.error("Failed to load dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) return <Loading />;

  const schoolsLineConfig = {
    labels: dashboardData.schoolsRegisteredLabels,
    datasets: [
      {
        label: "Schools Registered",
        data: dashboardData.schoolsRegisteredData,
        borderColor: "#4f46e5",
        backgroundColor: "rgba(79,70,229,0.3)",
        tension: 0.3,
      },
    ],
  };

  const studentsLineConfig = {
    labels: dashboardData.studentsGrowthLabels,
    datasets: [
      {
        label: "Students Growth",
        data: dashboardData.studentsGrowthData,
        borderColor: "#10b981",
        backgroundColor: "rgba(16,185,129,0.3)",
        tension: 0.3,
      },
    ],
  };

  const riskPieConfig = {
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
      <SectionTitle title={`Welcome, ${user?.name}!`} />

      {/* STATS ROW */}
      <div className="w-full flex justify-center px-8 lg:px-20">
        <div className="stats shadow stats-vertical lg:stats-horizontal w-full bg-base-200">
          <div className="stat">
            <div className="stat-figure text-primary">
              <IconSchool size={32} />
            </div>
            <div className="stat-title">Total Schools</div>
            <div className="stat-value text-primary">
              {dashboardData.totalSchools}
            </div>
          </div>

          <div className="stat">
            <div className="stat-figure text-secondary">
              <IconUserShield size={32} />
            </div>
            <div className="stat-title">Total Headmasters</div>
            <div className="stat-value text-secondary">
              {dashboardData.totalHeadmasters}
            </div>
          </div>

          <div className="stat">
            <div className="stat-figure text-accent">
              <IconUsersGroup size={32} />
            </div>
            <div className="stat-title">Total Students</div>
            <div className="stat-value text-accent">
              {dashboardData.totalStudents}
            </div>
          </div>

          <div className="stat">
            <div className="stat-figure text-primary">
              <IconMoneybag size={32} />
            </div>
            <div className="stat-title">Scholarships</div>
            <div className="stat-value text-primary">
              {dashboardData.totalScholarships}
            </div>
          </div>
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-8 lg:px-20 my-6">
        <div className="bg-base-200 p-4 rounded-xl shadow">
          <h3 className="text-lg font-bold mb-4 text-center uppercase">
            Schools Registered Over Time
          </h3>
          <Line data={schoolsLineConfig} />
        </div>

        <div className="bg-base-200 p-4 rounded-xl shadow">
          <h3 className="text-lg font-bold mb-4 text-center uppercase">
            Students Growth Over Time
          </h3>
          <Line data={studentsLineConfig} />
        </div>

        <div className="bg-base-200 p-4 rounded-xl shadow col-span-1 lg:col-span-2 h-120 flex flex-col items-center">
          <h3 className="text-lg font-bold mb-4 text-center uppercase">
            AI Risk Level Distribution
          </h3>
          <Pie data={riskPieConfig} />
        </div>
      </div>
    </>
  );
}
