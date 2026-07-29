import { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "About Us | DeskNomads",
  description: "Learn about the mission, values, and story behind DeskNomads, your ultimate guide to AI tools, remote jobs, and passive income.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
