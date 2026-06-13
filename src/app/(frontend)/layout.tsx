import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";

export default function FrontendLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SmoothScroll>
      <Header />
      <main>{children}</main>
      <Footer />
      <WhatsAppButton />
    </SmoothScroll>
  );
}
