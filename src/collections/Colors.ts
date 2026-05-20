import type { CollectionConfig } from 'payload'

export const Colors: CollectionConfig = {
  slug: 'colors',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'code', 'palette', 'sortOrder'],
    description: 'Individual color swatches. Each belongs to a palette.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'palette',
      type: 'relationship',
      relationTo: 'palettes',
      required: true,
    },
    {
      name: 'code',
      type: 'text',
      required: true,
      admin: {
        description: 'SKU code used in image filenames (e.g., "WH", "GBN"). Must be unique within a palette.',
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: { description: 'Display name (e.g., "White", "Burgundy").' },
    },
    {
      name: 'bgColor',
      type: 'text',
      required: true,
      admin: { description: 'Hex color for swatch background (e.g., "#6b1d2a").' },
    },
    {
      name: 'borderColor',
      type: 'text',
      admin: { description: 'Optional. Hex color for swatch border. Defaults to bgColor.' },
    },
    {
      name: 'swatchImage',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Optional. Used for textured swatches (e.g., interior PET fabric).' },
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      admin: { description: 'Display order within the palette.' },
    },
  ],
}
