import { SideNavItem } from "@/Types";
import {
  IconHome,
  IconClipboardCheck,
  IconBook,
  IconFileCertificate,
  IconBrain,
  IconMessage,
  IconUser,
  IconSchool,
  IconBook2,
  IconRobot,
  IconBuildingCommunity,
} from "@tabler/icons-react";

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    icon: <IconHome size={25} />,
    title: "Dashboard",
    path: "/student/dashboard",
  },
  {
    icon: <IconClipboardCheck size={25} />,
    title: "Attendance",
    path: "/student/attendance",
  },
  {
    icon: <IconBook size={25} />,
    title: "Subjects & Class",
    path: "/student/class",
  },
  {
    icon: <IconFileCertificate size={25} />,
    title: "Results",
    path: "/student/results",
  },
  {
    icon: <IconBook2 size={25} />,
    title: "Resources",
    path: "/student/resources",
  },
  {
    icon: <IconBuildingCommunity size={25} />,
    title: "Community Forum",
    path: "/student/community",
  },
  {
    icon: <IconMessage size={25} />,
    title: "Messages",
    path: "/student/messages",
  },
  {
    icon: <IconRobot size={25} />,
    title: "AI Assistant",
    path: "/student/assistant",
  },
  {
    icon: <IconBook size={25} />,
    title: "Scholarships",
    path: "/student/scholarships",
  },
];
