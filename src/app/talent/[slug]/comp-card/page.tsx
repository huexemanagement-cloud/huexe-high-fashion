import { notFound } from "next/navigation";
import { getModelBySlug } from "@/db/queries";
import { CompCard } from "@/components/talent/CompCard";

export const dynamic = "force-dynamic";

export default async function CompCardPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const model = await getModelBySlug(slug);
  if (!model) notFound();

  const images = [model.featuredImage, ...(model.galleryImages ?? []), ...(model.polaroidImages ?? [])]
    .filter(Boolean)
    .slice(0, 5);

  return (
    <CompCard
      name={model.name}
      category={model.category}
      location={model.location}
      instagram={model.instagram}
      stats={model.stats ?? {}}
      images={images}
    />
  );
}
