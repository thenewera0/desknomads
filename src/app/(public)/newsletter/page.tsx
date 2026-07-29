import { Metadata } from "next";
import NewsletterClient from "./NewsletterClient";

export const metadata: Metadata = {
  title: "Subscribe to Newsletter | DeskNomads",
  description: "Join 50K+ readers subscribing to DeskNomads weekly newsletters for curated AI tools, remote jobs, and passive income hacks.",
  alternates: {
    canonical: "/newsletter",
  },
};

export default function NewsletterPage() {
  return <NewsletterClient />;
}
