import { SideNavItem } from "@/Types";
import {
  IconHome,
  IconSchool,
  IconUser,
  IconUsersGroup,
  IconMoneybag,
  IconReportAnalytics,
} from "@tabler/icons-react";

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    icon: <IconHome size={25} />,
    title: "Dashboard",
    path: "/admin/dashboard",
  },
  {
    title: "School Management",
    path: "/admin/manage-schools",
    icon: <IconSchool size={25} />,
  },
  {
    title: "Students",
    path: "/admin/manage-students",
    icon: <IconUser size={25} />,
  },

  // -----------------------
  // FINANCIAL SUPPORT SYSTEM
  // -----------------------
  {
    title: "Manage Scholarships",
    path: "/admin/manage-scholarships",
    icon: <IconMoneybag size={25} />,
  },
];
