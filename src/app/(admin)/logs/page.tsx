import LogsViewer from "@/components/admin/LogsViewer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Application Logs - Admin",
  description: "View and manage application logs",
};

// Force dynamic rendering for admin pages
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function LogsPage() {
  return <LogsViewer />;
}
