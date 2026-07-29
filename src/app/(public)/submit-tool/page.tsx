import { Metadata } from "next";
import SubmitToolClient from "./SubmitToolClient";

export const metadata: Metadata = {
  title: "Submit a Tool | DeskNomads",
  description: "Get your AI tools or software featured on DeskNomads and reach 50K+ developers, remote professionals, and content creators.",
  alternates: {
    canonical: "/submit-tool",
  },
};

export default function SubmitToolPage() {
  return <SubmitToolClient />;
}
