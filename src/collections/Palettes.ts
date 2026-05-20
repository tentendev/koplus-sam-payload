import type { CollectionConfig } from 'payload'

export const Palettes: CollectionConfig = {
  slug: 'palettes',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'key', 'type'],
    description: 'Color palettes grouped by layer purpose (exterior, interior, accessory).',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: { description: 'Human-readable name shown in admin (e.g., "Exterior (default)").' },
    },
    {
      name: 'key',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'Stable identifier used in code & API (e.g., "exterior", "accUpholstery").' },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Exterior', value: 'exterior' },
        { label: 'Interior', value: 'interior' },
        { label: 'Accessory', value: 'accessory' },
      ],
    },
  ],
}
