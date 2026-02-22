import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'
import { headers } from 'next/headers'
import type { Page } from '@/payload-types'

export type CmsMedia = {
  id: string
  alt: string
  url: string
  updatedAt?: string
}

type HeroCtaData = {
  text: string
  linkType: 'internal' | 'external' | 'anchor'
  internalPage?: string | { slug: string } | null
  externalUrl?: string
  anchorId?: string
  newTab?: boolean
}

export type PageData = {
  id: string
  slug: string
  title: string
  heroHeadline: string
  heroSubheadline: string
  heroCta: HeroCtaData
  heroImage: CmsMedia
  aboutHeading: string
  aboutBody: unknown
  aboutImage: CmsMedia
  updatedAt: string
}

type MediaInput = {
  id?: string | number
  alt?: string
  url?: string
  updatedAt?: string
}

export const canUserEdit = (role?: string | null) => role === 'admin' || role === 'owner'

export const getCurrentUser = async () => {
  const payload = await getPayloadClient()
  const result = await payload.auth({ headers: await headers() })
  return result.user as { role?: string } | null
}

const normalizeMedia = (value: Page['heroImage'] | Page['aboutImage']): CmsMedia => {
  if (!value || typeof value === 'number') {
    return { id: String(value ?? ''), alt: '', url: '' }
  }

  const media = value as MediaInput

  return {
    id: String(media.id ?? ''),
    alt: media.alt ?? '',
    url: media.url ?? '',
    updatedAt: media.updatedAt,
  }
}

const normalizeHeroCta = (heroCta: Page['heroCta']): HeroCtaData => {
  const internalPage = heroCta.internalPage

  return {
    text: heroCta.text,
    linkType: heroCta.linkType,
    internalPage:
      typeof internalPage === 'number'
        ? String(internalPage)
        : internalPage && typeof internalPage === 'object'
          ? { slug: internalPage.slug }
          : null,
    externalUrl: heroCta.externalUrl ?? undefined,
    anchorId: heroCta.anchorId ?? undefined,
    newTab: heroCta.newTab ?? undefined,
  }
}

export const getPageBySlug = async (slug: string): Promise<PageData> => {
  const payload = await getPayloadClient()
  const pageResult = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
  })

  const page = pageResult.docs[0]

  if (!page) {
    notFound()
  }

  return {
    id: String(page.id),
    slug: page.slug,
    title: page.title,
    heroHeadline: page.heroHeadline,
    heroSubheadline: page.heroSubheadline,
    heroCta: normalizeHeroCta(page.heroCta),
    heroImage: normalizeMedia(page.heroImage),
    aboutHeading: page.aboutHeading,
    aboutBody: page.aboutBody,
    aboutImage: normalizeMedia(page.aboutImage),
    updatedAt: page.updatedAt,
  }
}
