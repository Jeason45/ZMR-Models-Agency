import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false, // Désactivé pour bénéficier du cache Vercel
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
      "portfolioImage": portfolioImage.asset->url,
      "portfolioGallery": portfolioGallery[].asset->url,
      "instagramImage": instagramImage.asset->url,
      instagramUrl,
      "showsImage": showsImage.asset->url,
      "showsVideo": showsVideo.asset->url,
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

// ====== ACTORS ======

// Query to get all actors
export async function getAllActors() {
  return client.fetch(
    `*[_type == "actor"] | order(name asc) {
      _id,
      name,
      "slug": slug.current,
      category,
      "mainImage": mainImage.asset->url,
      "hoverImage": hoverImage.asset->url,
      ageRange,
      languages,
      skills
    }`
  )
}

// Query to get a single actor by slug
export async function getActorBySlug(slug: string) {
  return client.fetch(
    `*[_type == "actor" && slug.current == $slug][0] {
      _id,
      name,
      "slug": slug.current,
      category,
      "mainImage": mainImage.asset->url,
      "hoverImage": hoverImage.asset->url,
      "heroVideo": heroVideo.asset->url,
      ageRange,
      languages,
      skills,
      "showreelVideo": showreelVideo.asset->url,
      "showreelImage": showreelImage.asset->url,
      "reelsGallery": reelsGallery[].asset->url,
      credits,
      "creditsImage": creditsImage.asset->url,
      "instagramImage": instagramImage.asset->url,
      instagramUrl,
      height,
      eyes,
      hair
    }`,
    { slug }
  )
}

// ====== PROMO ======

// Query to get all promo talents
export async function getAllPromos() {
  return client.fetch(
    `*[_type == "promo"] | order(name asc) {
      _id,
      name,
      "slug": slug.current,
      categories,
      "mainImage": mainImage.asset->url,
      "hoverImage": hoverImage.asset->url,
      instagramFollowers,
      tiktokFollowers
    }`
  )
}

// Query to get a single promo by slug
export async function getPromoBySlug(slug: string) {
  return client.fetch(
    `*[_type == "promo" && slug.current == $slug][0] {
      _id,
      name,
      "slug": slug.current,
      categories,
      "mainImage": mainImage.asset->url,
      "hoverImage": hoverImage.asset->url,
      "heroVideo": heroVideo.asset->url,
      instagramFollowers,
      tiktokFollowers,
      instagramUrl,
      tiktokUrl,
      collaborations[] {
        brandName,
        "logo": logo.asset->url,
        "campaignImage": campaignImage.asset->url
      },
      "collaborationsImage": collaborationsImage.asset->url,
      "eventsGallery": eventsGallery[].asset->url,
      "eventsImage": eventsImage.asset->url,
      "socialImage": socialImage.asset->url,
      height,
      eyes,
      hair
    }`,
    { slug }
  )
}

// ====== DETAILS ======

// Query to get all details
export async function getAllDetails() {
  return client.fetch(
    `*[_type == "detail"] | order(name asc) {
      _id,
      name,
      "slug": slug.current,
      category,
      "mainImage": mainImage.asset->url,
      "hoverImage": hoverImage.asset->url
    }`
  )
}

// Query to get a single detail by slug
export async function getDetailBySlug(slug: string) {
  return client.fetch(
    `*[_type == "detail" && slug.current == $slug][0] {
      _id,
      name,
      "slug": slug.current,
      category,
      "mainImage": mainImage.asset->url,
      "hoverImage": hoverImage.asset->url,
      "heroImage": heroImage.asset->url,
      handSize,
      ringSize,
      wristSize,
      footSize,
      legLength,
      neckSize,
      waist,
      hips,
      bust,
      height,
      "portfolioGallery": portfolioGallery[].asset->url,
      "portfolioImage": portfolioImage.asset->url,
      campaigns[] {
        brandName,
        "logo": logo.asset->url,
        "campaignImage": campaignImage.asset->url
      },
      "campaignsImage": campaignsImage.asset->url,
      "instagramImage": instagramImage.asset->url,
      instagramUrl,
      eyes,
      hair,
      skinTone
    }`,
    { slug }
  )
}
