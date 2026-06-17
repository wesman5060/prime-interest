import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/site/ScrollToTop";
import CustomCursor from "@/components/site/CustomCursor";
import ScrollProgress from "@/components/site/ScrollProgress";
import PageTransition from "@/components/site/PageTransition";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <ScrollProgress />
      <CustomCursor />
      <Header />
      <PageTransition>
        <main id="main" className="flex-1">{children}</main>
      </PageTransition>
      <Footer />
      <ScrollToTop />
    </>
  );
}
