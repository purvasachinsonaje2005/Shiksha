import { SideNavItem } from "@/Types";
import {
  IconHome,
  IconChalkboard,
  IconUsersGroup,
  IconClipboardCheck,
  IconWriting,
  IconBrain,
  IconMessage,
  IconBook2,
  IconBuildingCommunity,
} from "@tabler/icons-react";

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    icon: <IconHome size={25} />,
    title: "Dashboard",
    path: "/teacher/dashboard",
  },

  // Assigned Classes
  {
    title: "My Classes",
    path: "/teacher/classes",
    icon: <IconChalkboard size={25} />,
  },

  // Attendance
  {
    title: "Attendance",
    path: "/teacher/attendance",
    icon: <IconClipboardCheck size={25} />,
  },

  // Students & Performance
  {
    title: "Students",
    path: "#",
    icon: <IconUsersGroup size={25} />,
    submenu: true,
    subMenuItems: [
      {
        title: "Student List",
        path: "/teacher/students",
        icon: <IconUsersGroup size={22} />,
      },
      {
        title: "Enter Marks",
        path: "/teacher/students/marks",
        icon: <IconWriting size={22} />,
      },
    ],
  },
  // Communication
  {
    title: "Messages",
    path: "/teacher/messages",
    icon: <IconMessage size={25} />,
  },

  // Resources
  {
    title: "Resources",
    path: "/teacher/resources",
    icon: <IconBook2 size={25} />,
  },
  {
    title: "Community Forum",
    path: "/teacher/community",
    icon: <IconBuildingCommunity size={25} />,
  },
  {
    title: "Notices",
    path: "/teacher/notices",
    icon: <IconClipboardCheck size={25} />,
  },
];
