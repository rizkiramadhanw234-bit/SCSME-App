import { LuNetwork } from "react-icons/lu";
import { GiGraduateCap } from "react-icons/gi";
import { PiCertificateFill } from "react-icons/pi";
import { FaBusinessTime } from "react-icons/fa";

export const eventCategories = [
  {
    icon: <LuNetwork />,
    title: "Networking Sessions",
    description:
      "Lunches, tea sessions, industry exchanges and member meetups.",
  },
  {
    icon: <GiGraduateCap />,
    title: "Training Courses",
    description: "Digital marketing, finance, HR, management and sales.",
  },
  {
    icon: <PiCertificateFill />,
    title: "Certification Courses",
    description: "Download an e-certificate after course completion.",
  },
  {
    icon: <FaBusinessTime />,
    title: "Exhibitions / Business Opportunities",
    description: "Showcase member business and sponsor resources.",
  },
];
