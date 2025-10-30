import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})

const builder = imageUrlBuilder(client)

export function urlFor(source: any) {
  return builder.image(source)
}

// Query to get all models
export async function getAllModels() {
  return client.fetch(
    `*[_type == "model"] | order(name asc) {
      _id,
      name,
      "slug": slug.current,
      category,
      "mainImage": mainImage.asset->url,
      "hoverImage": hoverImage.asset->url,
      height,
      neck,
      bust,
      chest,
      waist,
      hips,
      suit,
      inseam,
      shoes,
      eyes,
      hair
    }`
  )
}

// Query to get a single model by slug
export async function getModelBySlug(slug: string) {
  return client.fetch(
    `*[_type == "model" && slug.current == $slug][0] {
      _id,
      name,
      "slug": slug.current,
      category,
      "mainImage": mainImage.asset->url,
      "hoverImage": hoverImage.asset->url,
      "heroVideo": heroVideo.asset->url,
      "galleryImages": galleryImages[].asset->url,
      height,
      neck,
      bust,
      chest,
      waist,
      hips,
      suit,
      inseam,
      shoes,
      eyes,
      hair
    }`,
    { slug }
  )
}
