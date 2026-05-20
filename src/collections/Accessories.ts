import type { CollectionConfig } from 'payload'

export const Accessories: CollectionConfig = {
  slug: 'accessories',
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label', 'code', 'layerKey', 'palette'],
    description: 'Add-on items (benches, desks, sofas) that can be toggled on a booth.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'label',
      type: 'text',
      required: true,
      admin: { description: 'Display name shown in the configurator (e.g., "Flex Bench").' },
    },
    {
      name: 'code',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'Stable identifier (e.g., "flex-bench").' },
    },
    {
      name: 'layerKey',
      type: 'text',
      required: true,
      admin: { description: 'Which render layer this accessory occupies (e.g., "accBench").' },
    },
    {
      name: 'skuTemplate',
      type: 'text',
      required: true,
      admin: { description: 'SKU pattern, use {colour} as placeholder (e.g., "L3_AC_FB_{colour}").' },
    },
    {
      name: 'palette',
      type: 'relationship',
      relationTo: 'palettes',
      required: true,
      admin: { description: 'Which color palette this accessory pulls from.' },
    },
    {
      name: 'defaultColorCode',
      type: 'text',
      required: true,
      admin: { description: 'Pre-selected color SKU code (must exist in the palette).' },
    },
    {
      name: 'excludedColorCodes',
      type: 'array',
      fields: [
        {
          name: 'code',
          type: 'text',
          required: true,
        },
      ],
      admin: {
        description: 'Optional. Color codes from the palette to hide for this accessory (e.g., ["GLB"]).',
      },
    },
  ],
}
