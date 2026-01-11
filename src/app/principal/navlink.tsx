import { SideNavItem } from "@/Types";
import {
  IconHome,
  IconUsersGroup,
  IconChalkboard,
  IconUserPlus,
  IconSchool,
  IconBrain,
  IconChartBar,
  IconChartDots,
  IconReportAnalytics,
  IconMessage,
  IconBook,
  IconBuildingCommunity,
} from "@tabler/icons-react";

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    icon: <IconHome size={25} />,
    title: "Dashboard",
    path: "/principal/dashboard",
  },

  // -----------------------
  // TEACHER & STUDENT MGMT
  // -----------------------
  {
    title: "Manage Staff",
    path: "/principal/manage-staff",
    icon: <IconChalkboard size={25} />,
  },

  {
    title: "Manage Students",
    path: "/principal/manage-students",
    icon: <IconUsersGroup size={25} />,
  },

  {
    title: "Community Forum",
    path: "/principal/community",
    icon: <IconBuildingCommunity size={25} />,
  },

  // -----------------------
  // ACADEMICS
  // -----------------------
  {
    title: "Academics",
    path: "#",
    icon: <IconSchool size={25} />,
    submenu: true,
    subMenuItems: [
      {
        title: "Classes",
        path: "/principal/classes",
        icon: <IconChartDots size={22} />,
      },
      {
        title: "Attendance",
        path: "/principal/attendance",
        icon: <IconChartDots size={22} />,
      },
      {
        title: "Marks & Performance",
        path: "/principal/performance",
        icon: <IconReportAnalytics size={22} />,
      },
      {
        title: "Notices",
        path: "/principal/manage-notices",
        icon: <IconMessage size={22} />,
      },
    ],
  },
  // -----------------------
  // SCHOLARSHIPS
  // -----------------------
  {
    title: "Scholarships",
    path: "/principal/manage-scholarships",
    icon: <IconBook size={25} />,
  },

  // -----------------------
  // COMMUNICATION
  // -----------------------
  {
    title: "Messages",
    path: "/principal/messages",
    icon: <IconMessage size={25} />,
  },
];
