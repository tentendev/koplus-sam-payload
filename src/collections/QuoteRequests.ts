import type { CollectionConfig } from 'payload'

export const QuoteRequests: CollectionConfig = {
  slug: 'quoteRequests',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'company', 'product', 'quantity', 'status', 'createdAt'],
    description: 'Quote requests submitted from the SAM configurator "Request a quote" form.',
  },
  access: {
    // Public submissions from the configurator form. Reading / editing / deleting
    // stays restricted to authenticated admins (Payload's default when omitted).
    create: () => true,
  },
  fields: [
    // ── Admin workflow status (sidebar) ──
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Quoted', value: 'quoted' },
        { label: 'Closed', value: 'closed' },
      ],
      admin: { position: 'sidebar', description: 'Internal follow-up status.' },
    },

    // ── Contact details ──
    {
      type: 'row',
      fields: [
        { name: 'firstName', type: 'text', required: true, admin: { width: '50%' } },
        { name: 'lastName', type: 'text', required: true, admin: { width: '50%' } },
      ],
    },
    { name: 'email', type: 'email', required: true },
    {
      type: 'row',
      fields: [
        { name: 'phone', type: 'text', required: true, admin: { width: '50%' } },
        { name: 'country', type: 'text', required: true, admin: { width: '50%' } },
      ],
    },
    { name: 'address', type: 'text' },
    {
      type: 'row',
      fields: [
        { name: 'company', type: 'text', required: true, admin: { width: '50%' } },
        // Kept as free text (not a select) so the values stay decoupled from the
        // form's option labels — the configurator can change wording without
        // breaking validation here.
        { name: 'companyType', type: 'text', admin: { width: '50%' } },
      ],
    },
    { name: 'companySize', type: 'text' },

    // ── Quote subject ──
    {
      type: 'row',
      fields: [
        { name: 'product', type: 'text', admin: { width: '70%', description: 'e.g. "SAM Single Acoustic Booth".' } },
        { name: 'quantity', type: 'number', defaultValue: 1, min: 1, admin: { width: '30%' } },
      ],
    },
    { name: 'productSlug', type: 'text', admin: { description: 'single / medium / large.' } },

    // ── Configuration snapshot at time of request ──
    {
      name: 'configuration',
      type: 'group',
      admin: { description: 'The booth specification captured when the quote was requested.' },
      fields: [
        {
          name: 'summary',
          type: 'textarea',
          admin: { description: 'One-line summary of all selected options.' },
        },
        {
          type: 'row',
          fields: [
            { name: 'door', type: 'text', admin: { width: '50%' } },
            { name: 'backPanel', type: 'text', admin: { width: '50%' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'exterior', type: 'text', admin: { width: '50%' } },
            { name: 'interior', type: 'text', admin: { width: '50%' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'tabletop', type: 'text', admin: { width: '50%' } },
            { name: 'accessories', type: 'text', admin: { width: '50%' } },
          ],
        },
      ],
    },
  ],
}
