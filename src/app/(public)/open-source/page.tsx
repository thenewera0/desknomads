import { Metadata } from "next";
import OpenSourceClient from "./OpenSourceClient";

export const metadata: Metadata = {
  title: "Open Source Gems | DeskNomads",
  description: "The best 100% free, open-source AI tools, frameworks, and models curated for developers and creators.",
};

export default function OpenSourcePage() {
  return <OpenSourceClient />;
}
