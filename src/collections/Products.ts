import type { CollectionConfig, FieldHook } from 'payload'

// ── Constants for auto-derived fields ───────────────────────────────────
const S3_BASE = 'https://kolo-website.s3.eu-west-1.amazonaws.com/KoplusSam'
const ASSET_FOLDER_PREFIX = 'sam_'

// Lowercase + dash-separate from a title (e.g. "Sam Single Booth" → "sam-single-booth")
const toSlug = (s: string): string =>
  s.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')

// Auto-fill slug from title when slug is empty
const fillSlugFromTitle: FieldHook = ({ value, data }) => {
  if (typeof value === 'string' && value.length) return toSlug(value)
  if (data && typeof data.title === 'string') return toSlug(data.title)
  return value
}

// Auto-build assetBaseUrl from slug when empty
const fillAssetBaseFromSlug: FieldHook = ({ value, data }) => {
  if (typeof value === 'string' && value.length) return value
  if (data && typeof data.slug === 'string' && data.slug.length) {
    return `${S3_BASE}/${ASSET_FOLDER_PREFIX}${data.slug}`
  }
  return value
}

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'label', 'skuPrefix', 'sortOrder', 'status'],
    description: 'SAM booth variants. Each booth has its own image set on S3 and palette of options.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Basic',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              admin: { description: 'Full booth name (e.g., "Sam Single Booth").' },
            },
            {
              name: 'label',
              type: 'text',
              required: true,
              admin: { description: 'Short label for header tab (e.g., "Single").' },
            },
            {
              // Intentionally NOT `required` so the DB column stays nullable —
              // this lets the schema push onto the existing products table without
              // a data-loss table rebuild. Every product still gets a series in
              // practice: the async defaultValue resolves new ones to SAM, and the
              // seed backfills existing ones. Can be tightened to required later
              // via a proper migration once all rows are populated.
              name: 'series',
              type: 'relationship',
              relationTo: 'series',
              defaultValue: async ({ req }) => {
                const result = await req.payload.find({
                  collection: 'series',
                  where: { key: { equals: 'sam' } },
                  limit: 1,
                })
                return result.docs[0]?.id
              },
              admin: {
                description: 'Product line this booth belongs to (e.g., SAM). Defaults to SAM.',
              },
            },
            {
              name: 'slug',
              type: 'text',
              unique: true,
              hooks: { beforeValidate: [fillSlugFromTitle] },
              admin: {
                description: 'Auto-generated from the title (e.g., "sam-single-booth"). You can override if needed.',
              },
            },
            {
              name: 'subtitle',
              type: 'textarea',
              admin: { description: 'Short description shown below the title.' },
            },
            {
              name: 'sortOrder',
              type: 'number',
              defaultValue: 0,
              admin: { description: 'Order in which booths appear in the header.' },
            },
            {
              name: 'status',
              type: 'select',
              defaultValue: 'published',
              options: [
                { label: 'Published', value: 'published' },
                { label: 'Draft', value: 'draft' },
              ],
            },
            {
              name: 'defaultDoor',
              type: 'select',
              defaultValue: 'LT',
              options: [
                { label: 'Left Handed', value: 'LT' },
                { label: 'Right Handed', value: 'RT' },
              ],
              admin: {
                description: 'Which door orientation is selected by default when this product loads.',
              },
            },
          ],
        },
        {
          label: 'SKU & Assets',
          fields: [
            {
              name: 'skuPrefix',
              type: 'text',
              required: true,
              admin: { description: '2-letter prefix used in SKU codes (e.g., "SS", "SM", "SL").' },
            },
            {
              name: 'assetBaseUrl',
              type: 'text',
              hooks: { beforeValidate: [fillAssetBaseFromSlug] },
              admin: {
                description: `Auto-built from slug as "${S3_BASE}/${ASSET_FOLDER_PREFIX}{slug}". Override only if assets live elsewhere.`,
              },
            },
            {
              name: 'allGlassCode',
              type: 'text',
              required: true,
              admin: { description: 'Panel code that means "no walls, all glass" (e.g., "GS_NA").' },
            },
          ],
        },
        {
          label: 'Palettes & Options',
          fields: [
            {
              name: 'exteriorPalette',
              type: 'relationship',
              relationTo: 'palettes',
              required: true,
              admin: { description: 'Which palette to use for exterior color options.' },
            },
            {
              name: 'interiorPalette',
              type: 'relationship',
              relationTo: 'palettes',
              defaultValue: async ({ req }) => {
                const result = await req.payload.find({
                  collection: 'palettes',
                  where: { key: { equals: 'interior' } },
                  limit: 1,
                })
                return result.docs[0]?.id
              },
              admin: {
                description: 'Defaults to the "interior" palette. Change only if a booth uses a different interior PET set.',
              },
            },
            {
              name: 'accessories',
              type: 'relationship',
              relationTo: 'accessories',
              hasMany: true,
              admin: { description: 'Accessories available on this booth (leave empty if none).' },
            },
            {
              name: 'panels',
              type: 'array',
              admin: { description: 'Back panel options available on this booth.' },
              fields: [
                {
                  name: 'code',
                  type: 'text',
                  required: true,
                  admin: { description: 'Panel SKU code (e.g., "GS_GS", "GS_WL").' },
                },
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                  admin: { description: 'Display name (e.g., "2 Glasses").' },
                },
                {
                  name: 'icon',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Glass', value: 'glass' },
                    { label: 'Wall', value: 'wall' },
                    { label: '2 Glass', value: '2glass' },
                    { label: '2 Wall', value: '2wall' },
                    { label: 'Glass + Wall', value: 'glass-wall' },
                    { label: 'Wall + Glass', value: 'wall-glass' },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Restrictions',
          fields: [
            {
              name: 'panelRestrictions',
              type: 'array',
              admin: { description: 'Disallowed combinations (e.g., "WL_WL" panel cannot use "BUR" interior).' },
              fields: [
                {
                  name: 'panelCode',
                  type: 'text',
                  required: true,
                  admin: { description: 'Panel code that triggers the restriction.' },
                },
                {
                  name: 'excludedInteriorCodes',
                  type: 'array',
                  fields: [
                    {
                      name: 'code',
                      type: 'text',
                      required: true,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
