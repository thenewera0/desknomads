import { Metadata } from "next";
import SearchClient from "./SearchClient";

export const metadata: Metadata = {
  title: "Search Results | DeskNomads",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SearchPage() {
  return <SearchClient />;
}
