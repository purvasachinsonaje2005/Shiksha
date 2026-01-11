import { SideNavItem } from "@/Types";
import {
  IconHome,
  IconClipboardCheck,
  IconFileCertificate,
  IconBrain,
  IconMessage,
  IconBook,
  IconUsers,
  IconUser,
  IconMoneybag,
} from "@tabler/icons-react";

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    icon: <IconHome size={25} />,
    title: "Dashboard",
    path: "/parent/dashboard",
  },
  {
    icon: <IconClipboardCheck size={25} />,
    title: "Attendance",
    path: "/parent/attendance",
  },
  {
    icon: <IconBook size={25} />,
    title: "Results",
    path: "/parent/results",
  },
  {
    icon: <IconMessage size={25} />,
    title: "Notices",
    path: "/parent/notices",
  },
  {
    icon: <IconBrain size={25} />,
    title: "Dropout Insight",
    path: "/parent/dropout-risk",
  },
  {
    icon: <IconMoneybag size={25} />,
    title: "Scholarship Status",
    path: "/parent/scholarship",
  },
];
