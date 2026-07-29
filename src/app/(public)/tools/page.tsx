import { Metadata } from "next";
import ToolsClient from "./ToolsClient";

export const metadata: Metadata = {
  title: "AI Tools Directory | DeskNomads",
  description: "Browse the best curated AI tools, software, and platforms to automate your workflow and scale your productivity.",
  alternates: {
    canonical: "/tools",
  },
};

export default function ToolsPage() {
  return <ToolsClient />;
}
