import { AboutSection } from "@/components/sections/AboutSection";
import { ContactsSection } from "@/components/sections/ContactsSection";
import { DocumentationSection } from "@/components/sections/DocumentationSection";
import { Hero } from "@/components/sections/Hero";
import { ProductsSection } from "@/components/sections/ProductsSection";
import { getPresentationVideo } from "@/lib/getSiteSettings";
import { getProducts } from "@/lib/getProducts";

export default async function HomePage() {
  const [products, presentationVideo] = await Promise.all([
    getProducts(),
    getPresentationVideo(),
  ]);

  return (
    <>
      <Hero />
      <ProductsSection products={products} presentationVideo={presentationVideo} />
      <AboutSection />
      <ContactsSection />
      <DocumentationSection />
    </>
  );
}
