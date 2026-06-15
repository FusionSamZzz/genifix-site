import { AboutSection } from "@/components/sections/AboutSection";
import { ContactsSection } from "@/components/sections/ContactsSection";
import { DocumentationSection } from "@/components/sections/DocumentationSection";
import { Hero } from "@/components/sections/Hero";
import { ProductsSection } from "@/components/sections/ProductsSection";
import { getSiteSettings } from "@/lib/getSiteSettings";
import { getProducts } from "@/lib/getProducts";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [{ heroImageUrl, presentationVideo }, products] = await Promise.all([
    getSiteSettings(),
    getProducts(),
  ]);

  return (
    <>
      <Hero heroImageUrl={heroImageUrl} />
      <ProductsSection products={products} presentationVideo={presentationVideo} />
      <AboutSection />
      <ContactsSection />
      <DocumentationSection />
    </>
  );
}
