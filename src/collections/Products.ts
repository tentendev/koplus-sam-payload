import type { CollectionConfig } from 'payload'

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
              name: 'slug',
              type: 'text',
              required: true,
              unique: true,
              admin: { description: 'Internal key (e.g., "single", "medium", "large"). No spaces.' },
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
              required: true,
              admin: { description: 'S3 folder URL for this booth\'s images (e.g., "https://kolo-website.s3.../sam_single").' },
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
              required: true,
              admin: { description: 'Which palette to use for interior PET color options.' },
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
          label: 'Layers & Restrictions',
          fields: [
            {
              name: 'layers',
              type: 'array',
              admin: { description: 'Render layers, in z-index order (low = back, high = front).' },
              fields: [
                {
                  name: 'key',
                  type: 'text',
                  required: true,
                  admin: { description: 'Layer identifier (e.g., "panel", "interior", "exterior", "door", "accBench").' },
                },
                {
                  name: 'folder',
                  type: 'text',
                  required: true,
                  admin: { description: 'S3 subfolder name (e.g., "panel", "frame", "accessories").' },
                },
                {
                  name: 'zIndex',
                  type: 'number',
                  required: true,
                  admin: { description: 'Stack order: lower numbers render behind higher ones.' },
                },
              ],
            },
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
