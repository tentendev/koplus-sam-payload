import type { CollectionConfig } from 'payload'

// A product line / family (e.g. SAM, Duo, Solo). Products belong to a series,
// and the configurator loads one series at a time (filtered by `key`). The
// series carries the front-of-page branding — the big heading and tagline —
// so those are no longer hardcoded as "SAM" in the configurator.
export const Series: CollectionConfig = {
  slug: 'series',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'key', 'tagline', 'sortOrder'],
    description: 'Product lines / families (e.g. SAM, Duo, Solo). The configurator loads one series at a time.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: { description: 'Display name shown as the big page heading (e.g., "SAM").' },
    },
    {
      name: 'key',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'Stable identifier used in code & the ?series= URL param (e.g., "sam", "duo").' },
    },
    {
      name: 'tagline',
      type: 'text',
      admin: { description: 'Sub-heading under the name (e.g., "Sustainable Acoustic Modular Booth").' },
    },
    {
      name: 'assetBase',
      type: 'text',
      admin: {
        description:
          'Optional S3 base for this line\'s assets (e.g., ".../KoplusSam"). Informational for now — each product still sets its own assetBaseUrl.',
      },
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      admin: { description: 'Order in which series appear if a family switcher is added later.' },
    },
  ],
}
