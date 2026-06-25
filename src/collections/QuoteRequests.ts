import type { CollectionConfig } from 'payload'

// Build the HTML body for the quote-notification email (sent on each submission).
function quoteEmailHtml(doc: Record<string, any>): string {
  const c = doc.configuration || {}
  const row = (label: string, val: unknown) =>
    val
      ? `<tr><td style="padding:4px 14px 4px 0;color:#555;white-space:nowrap">${label}</td><td style="padding:4px 0"><strong>${val}</strong></td></tr>`
      : ''
  return `
    <div style="font-family:system-ui,Arial,sans-serif;font-size:14px;color:#111;line-height:1.5">
      <h2 style="margin:0 0 12px">New quote request</h2>
      <p style="margin:0 0 16px"><strong>${doc.product || 'SAM'}</strong> &times; ${doc.quantity || 1}</p>
      <h3 style="margin:16px 0 4px">Contact</h3>
      <table>
        ${row('Name', `${doc.firstName || ''} ${doc.lastName || ''}`.trim())}
        ${row('Email', doc.email)}
        ${row('Phone', doc.phone)}
        ${row('Country', doc.country)}
        ${row('Company', doc.companyType ? `${doc.company} (${doc.companyType})` : doc.company)}
        ${row('Address', doc.address)}
        ${row('Notes', doc.notes)}
      </table>
      <h3 style="margin:16px 0 4px">Configuration</h3>
      <table>
        ${row('Summary', c.summary)}
        ${row('Door', c.door)}
        ${row('Back Panel', c.backPanel)}
        ${row('Exterior', c.exterior)}
        ${row('Interior', c.interior)}
        ${row('Tabletop', c.tabletop)}
        ${row('Accessories', c.accessories)}
      </table>
    </div>`
}

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
  hooks: {
    // Email the quote details to the sales inbox on each new submission.
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation !== 'create') return doc
        const to = process.env.QUOTE_NOTIFY_TO || 'sales@koplusbrand.com'
        try {
          await req.payload.sendEmail({
            to,
            subject: `New quote request — ${doc.product || 'SAM'} (${doc.firstName || ''} ${doc.lastName || ''})`.trim(),
            html: quoteEmailHtml(doc),
          })
        } catch (err) {
          // Never let a failed email block the submission.
          req.payload.logger.error(`Quote notification email failed: ${String(err)}`)
        }
        return doc
      },
    ],
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
    // Deprecated: replaced by the "Notes" field on the form. Kept (hidden) so the
    // existing column isn't dropped (avoids a destructive schema change).
    { name: 'companySize', type: 'text', admin: { hidden: true } },
    { name: 'notes', type: 'textarea', admin: { description: 'Optional notes from the customer.' } },

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
