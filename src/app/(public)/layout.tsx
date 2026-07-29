import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BackToTop from "@/components/shared/BackToTop";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {/* Offset for the fixed navbar + a small comfort buffer below it */}
      <main className="flex-1 pt-24 md:pt-28">{children}</main>
      <Footer />
      <BackToTop />
    </div>
  );
}
