/* eslint-disable react/no-unescaped-entities */
import React from 'react'

/**
 * Guides — the "User Manual" content. Rendered on the dedicated /admin/user-manual
 * page (see GuidesView + admin.components.views in payload.config.ts).
 * Pure static content (no client JS); native <details> drives the directory.
 */

const ADMIN = 'https://koplus-sam-payload.vercel.app/admin'
const LIVE = 'https://koplus-sam-next.vercel.app'

const wrap: React.CSSProperties = { margin: '0 0 40px', maxWidth: 820 }
const card: React.CSSProperties = {
  background: 'var(--theme-elevation-50)',
  border: '1px solid var(--theme-elevation-100)',
  borderRadius: 8,
  padding: '4px 20px',
  marginBottom: 10,
}
const summary: React.CSSProperties = {
  cursor: 'pointer',
  fontWeight: 600,
  fontSize: 15,
  padding: '14px 0',
  listStyle: 'none',
}
const body: React.CSSProperties = {
  paddingBottom: 16,
  fontSize: 14,
  lineHeight: 1.75,
  color: 'var(--theme-elevation-800)',
}
const note: React.CSSProperties = {
  background: 'var(--theme-elevation-100)',
  borderLeft: '3px solid var(--theme-success-500, #2e8b57)',
  borderRadius: 4,
  padding: '10px 14px',
  margin: '12px 0',
  fontSize: 13,
}
const warn: React.CSSProperties = {
  ...note,
  borderLeftColor: 'var(--theme-warning-500, #d98b1f)',
}
const th: React.CSSProperties = {
  textAlign: 'left',
  padding: '6px 10px',
  borderBottom: '1px solid var(--theme-elevation-150)',
  fontWeight: 600,
}
const td: React.CSSProperties = {
  padding: '6px 10px',
  borderBottom: '1px solid var(--theme-elevation-100)',
  verticalAlign: 'top',
}

function Guide({
  title,
  children,
  open,
}: {
  title: string
  children: React.ReactNode
  open?: boolean
}) {
  return (
    <details style={card} open={open}>
      <summary style={summary}>{title}</summary>
      <div style={body}>{children}</div>
    </details>
  )
}

export const Guides: React.FC = () => {
  return (
    <div style={wrap}>
      <h1 style={{ marginBottom: 4 }}>📖 User Manual</h1>
      <p style={{ color: 'var(--theme-elevation-600)', marginTop: 0, marginBottom: 20, fontSize: 14 }}>
        Everything you need to manage the configurator — products, lines, colours, and content.
        Click any topic to expand. Live site:{' '}
        <a href={LIVE} target="_blank" rel="noreferrer">{LIVE.replace('https://', '')}</a>
      </p>

      <Guide title="🧭 How it all fits together" open>
        <p>The configurator is built from a few connected pieces:</p>
        <table style={{ borderCollapse: 'collapse', width: '100%', margin: '8px 0', fontSize: 13.5 }}>
          <thead>
            <tr>
              <th style={th}>Section</th>
              <th style={th}>What it is</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style={td}><strong>Series</strong></td><td style={td}>A product line (e.g. SAM). Sets the big page heading + tagline and gives the line its own web page.</td></tr>
            <tr><td style={td}><strong>Products</strong></td><td style={td}>The individual products/sizes inside a line (e.g. Single, Medium, Large). Each is one configurator.</td></tr>
            <tr><td style={td}><strong>Palettes</strong></td><td style={td}>Named groups of colours (e.g. "Exterior", "Interior PET").</td></tr>
            <tr><td style={td}><strong>Colors</strong></td><td style={td}>The individual swatches, each belonging to a palette.</td></tr>
            <tr><td style={td}><strong>Accessories</strong></td><td style={td}>Optional add-ons (e.g. Flex Desk) that can be attached to products.</td></tr>
            <tr><td style={td}><strong>Quote Requests</strong></td><td style={td}>Customer submissions from the "Request a Quote" form.</td></tr>
          </tbody>
        </table>
        <p>A product page is reached at <code>{LIVE}/&lt;series key&gt;</code> — for example <a href={`${LIVE}/sam`} target="_blank" rel="noreferrer">{LIVE.replace('https://', '')}/sam</a>.</p>
      </Guide>

      <Guide title="➕ Add a new product (full walkthrough)">
        <div style={warn}>
          <strong>⚠️ Before you start — the image set.</strong> The live preview is built by stacking
          layered images (a separate transparent image for each colour, panel, door direction, and
          accessory). A new product needs its image set prepared in this layered format and uploaded
          first — please coordinate with the dev/design team. You'll receive an <em>Asset Base URL</em>
          to paste in at the SKU &amp; Assets step.
        </div>
        <p><strong>Step 1 — Open the form.</strong> Go to <a href={`${ADMIN}/collections/products`} target="_blank" rel="noreferrer">Products</a> → click <strong>Create New</strong> (top right).</p>
        <p><strong>Step 2 — Basic tab:</strong></p>
        <ul>
          <li><strong>Title</strong> — the full product name shown on the page (e.g. <code>SAM Single Acoustic Booth</code>).</li>
          <li><strong>Label</strong> — the short text on the selector button (e.g. <code>Single</code>).</li>
          <li><strong>Series</strong> — choose the product line this belongs to (e.g. SAM).</li>
          <li><strong>Slug</strong> — auto-fills from the title; leave it unless you need a custom one.</li>
          <li><strong>Subtitle</strong> — the short description under the title.</li>
          <li><strong>Sort Order</strong> — the position in the selector (1 = first).</li>
          <li><strong>Status</strong> — keep <em>Draft</em> while building; switch to <em>Published</em> to go live.</li>
        </ul>
        <p><strong>Step 3 — SKU &amp; Assets tab:</strong></p>
        <ul>
          <li><strong>SKU Prefix</strong> — short product code (e.g. <code>SS</code>).</li>
          <li><strong>Asset Base URL</strong> — paste the image-set link from the warning above. <em>This is the most important field — it's where all the product images load from.</em></li>
          <li><strong>All Glass Code</strong> — the panel code meaning "no walls / all glass" (dev team provides this).</li>
        </ul>
        <p><strong>Step 4 — Palettes &amp; Options tab:</strong></p>
        <ul>
          <li><strong>Exterior Palette / Interior Palette</strong> — choose which colour sets apply.</li>
          <li><strong>Accessories</strong> — select the add-ons available on this product.</li>
          <li><strong>Panels</strong> — click <em>Add</em> for each back-panel option and fill its <strong>Code</strong>, <strong>Label</strong>, and <strong>Icon</strong>.</li>
        </ul>
        <p><strong>Step 5 — Restrictions tab (optional):</strong> add a Panel Restriction only if a specific panel can't be combined with a specific interior colour.</p>
        <p><strong>Step 6 — Save &amp; publish.</strong> Set <strong>Status → Published</strong> and click <strong>Save</strong>.</p>
        <p><strong>Step 7 — View it live</strong> at <code>{LIVE}/&lt;series key&gt;</code>. It appears automatically — no developer step needed.</p>
      </Guide>

      <Guide title="🖼️ Image set & layering (for designers)">
        <p>
          The live preview is built by stacking transparent image layers. Every product needs its image
          set exported and uploaded in this exact folder structure. The folder's web address becomes the
          product's <strong>Asset Base URL</strong> (the field in SKU &amp; Assets).
        </p>
        <p><strong>Folder structure</strong> (inside the product's asset folder):</p>
        <pre
          style={{
            background: 'var(--theme-elevation-100)',
            borderRadius: 6,
            padding: '12px 14px',
            overflowX: 'auto',
            fontSize: 12.5,
            lineHeight: 1.6,
            margin: '8px 0',
          }}
        >{`<asset base>/
├── L1-door/
│   ├── LT.webp          ← left-handed door
│   └── RT.webp          ← right-handed door
├── L2-exterior/
│   ├── WH.webp          ← one file per EXTERIOR colour code
│   └── …
├── L4-interior/
│   ├── BWH.webp         ← one file per INTERIOR colour code
│   └── …
├── L5-panel/
│   ├── GS_NA/           ← one folder per PANEL code
│   │   └── 000.webp     ← all-glass panel uses "000"
│   ├── WL_NA/
│   │   ├── BWH.webp     ← wall panels: one file per interior colour
│   │   └── …
│   └── …
└── L3-accessory/
    ├── FB/              ← one folder per accessory TYPE code
    │   ├── GBN.webp     ← one file per accessory colour code
    │   └── …
    └── …`}</pre>

        <p><strong>Naming rules</strong> — folders/filenames must exactly match the Codes set in the CMS (case-sensitive):</p>
        <table style={{ borderCollapse: 'collapse', width: '100%', margin: '4px 0', fontSize: 13 }}>
          <thead>
            <tr><th style={th}>Folder / file</th><th style={th}>Named by</th></tr>
          </thead>
          <tbody>
            <tr><td style={td}>L1-door files</td><td style={td}><code>LT</code> (left) &amp; <code>RT</code> (right) — fixed</td></tr>
            <tr><td style={td}>L2-exterior files</td><td style={td}>the exterior colour's <strong>Code</strong> (from Colors)</td></tr>
            <tr><td style={td}>L4-interior files</td><td style={td}>the interior colour's <strong>Code</strong></td></tr>
            <tr><td style={td}>L5-panel folders</td><td style={td}>the <strong>Panel Code</strong> set on the product (e.g. <code>GS_NA</code>)</td></tr>
            <tr><td style={td}>L5-panel files</td><td style={td}>interior colour Code (wall panels), or <code>000</code> (all-glass)</td></tr>
            <tr><td style={td}>L3-accessory folders</td><td style={td}>the accessory's <strong>type code</strong> (the 2-letter code in its SKU template, e.g. <code>FB</code>, <code>FD</code>, <code>SF</code>)</td></tr>
            <tr><td style={td}>L3-accessory files</td><td style={td}>the accessory colour's <strong>Code</strong></td></tr>
          </tbody>
        </table>

        <div style={note}>
          <strong>All-glass panel:</strong> the panel chosen as the product's "All Glass Code" has no walls,
          so it uses a single <code>000.webp</code> instead of one image per interior colour.
        </div>

        <p><strong>Image requirements</strong></p>
        <ul>
          <li><strong>Format:</strong> WebP with transparency (alpha channel).</li>
          <li><strong>Same canvas:</strong> every layer must be the exact same dimensions and aligned to the same position, so they stack and register perfectly.</li>
          <li><strong>Consistent</strong> camera angle and lighting across all layers.</li>
        </ul>
        <p><strong>Stacking order</strong> (back → front): Panel → Interior → Accessory → Exterior → Door.</p>
      </Guide>

      <Guide title="🆕 Add a new product line (Series)">
        <p>Do this when launching a whole new line (not just another size of an existing one).</p>
        <ol>
          <li>Go to <a href={`${ADMIN}/collections/series`} target="_blank" rel="noreferrer">Series</a> → <strong>Create New</strong>.</li>
          <li><strong>Name</strong> — the big heading on the page (e.g. <code>SAM</code>).</li>
          <li><strong>Key</strong> — a short, lowercase id with no spaces; it becomes the page URL. e.g. <code>sam</code> → <a href={`${LIVE}/sam`} target="_blank" rel="noreferrer">{LIVE.replace('https://', '')}/sam</a>.</li>
          <li><strong>Tagline</strong> — the sub-heading shown under the name.</li>
          <li><strong>Sort Order</strong> — the order lines would appear in.</li>
          <li><strong>Save</strong>, then add products under this series (see "Add a new product").</li>
        </ol>
      </Guide>

      <Guide title="🎨 Add or edit a colour">
        <ol>
          <li>Open <a href={`${ADMIN}/collections/colors`} target="_blank" rel="noreferrer">Colors</a> → <strong>Create New</strong> (or click an existing colour to edit it).</li>
          <li><strong>Name</strong> — what the customer sees (e.g. <code>Mocha Brown</code>).</li>
          <li><strong>Code</strong> — the short internal code (e.g. <code>GBN</code>).</li>
          <li>Set the actual <strong>colour value</strong>.</li>
          <li><strong>Palette</strong> — assign it to the right group (Exterior, Interior PET, Accessory, etc.).</li>
          <li><strong>Sort Order</strong> — controls the order swatches appear on the page.</li>
          <li><strong>Save.</strong></li>
        </ol>
        <div style={note}>A colour can be reused across many products — you don't need to recreate it per product. Just make sure it's in the palette that the product uses.</div>
      </Guide>

      <Guide title="🛋️ Manage accessories">
        <ol>
          <li>Go to <a href={`${ADMIN}/collections/accessories`} target="_blank" rel="noreferrer">Accessories</a> to create or edit an add-on (its name, colour palette, default colour, etc.).</li>
          <li>To make it available on a product: open the product → <strong>Palettes &amp; Options → Accessories</strong> → select it.</li>
          <li><strong>Save</strong> the product. The accessory then appears as an option on that product's page.</li>
        </ol>
      </Guide>

      <Guide title="🧩 Need a custom field or new option?">
        <p>Use this when a product needs something beyond the current options. First, work out which case you're in:</p>

        <p><strong>Case A — more of an existing option (you can do this yourselves).</strong> Another colour, panel, or accessory that fits the <em>same</em> layer position as the current ones.</p>
        <ol>
          <li>Add it in the CMS — <a href={`${ADMIN}/collections/colors`} target="_blank" rel="noreferrer">Colors</a>, or the product's Panels / Accessories.</li>
          <li>Provide its layered images in the same structure (see "Image set &amp; layering").</li>
          <li>It appears on the page automatically — <strong>test it live</strong> to check it suits the design.</li>
        </ol>

        <p><strong>Case B — a custom field / new option type (send it to the dev team).</strong> A new kind of option, a new section, or something that needs to stack/layer <em>differently</em> than the existing layers.</p>
        <ol>
          <li><strong>Describe the field</strong> — what it is, its label, and where on the page it should appear.</li>
          <li><strong>List its options/values</strong> — the choices a customer can pick.</li>
          <li><strong>Explain the layering</strong> — where its image should stack relative to the existing layers (Panel → Interior → Accessory → Exterior → Door), with a reference design or image.</li>
          <li><strong>Send it to the dev team.</strong> We add the field and its layer handling to the configurator, then expose it in the CMS so you can manage its values yourselves afterwards.</li>
          <li><strong>Provide the image set</strong> for the new option (layered, per "Image set &amp; layering").</li>
          <li>We deploy it — then you can test and refine.</li>
        </ol>

        <div style={note}>
          <strong>Quick rule:</strong> if the new option <strong>fits an existing layer position</strong>, you can add and test it first. If it needs a <strong>new layer position or a new type of control</strong>, it's a custom field — send us the spec and we'll wire it up.
        </div>
      </Guide>

      <Guide title="✏️ Edit headings, titles & descriptions">
        <table style={{ borderCollapse: 'collapse', width: '100%', margin: '4px 0', fontSize: 13.5 }}>
          <thead>
            <tr><th style={th}>To change…</th><th style={th}>Go to…</th></tr>
          </thead>
          <tbody>
            <tr><td style={td}>The big page heading + tagline</td><td style={td}><a href={`${ADMIN}/collections/series`} target="_blank" rel="noreferrer">Series</a> → Name / Tagline</td></tr>
            <tr><td style={td}>A product's title + description</td><td style={td}><a href={`${ADMIN}/collections/products`} target="_blank" rel="noreferrer">Products</a> → Title / Subtitle</td></tr>
            <tr><td style={td}>A colour name</td><td style={td}><a href={`${ADMIN}/collections/colors`} target="_blank" rel="noreferrer">Colors</a> → Name</td></tr>
            <tr><td style={td}>A panel / accessory name</td><td style={td}>Products → Palettes &amp; Options (panels) / Accessories</td></tr>
          </tbody>
        </table>
        <div style={note}>
          The section titles inside the configurator (Setup, Colour Option, Accessory) and the fixed
          row labels (Door Orientation, Back Panel, etc.) are part of the page layout and aren't edited
          here — ask the dev team if one needs changing.
        </div>
      </Guide>

      <Guide title="📩 View & manage quote requests">
        <p>
          Customer submissions appear under{' '}
          <a href={`${ADMIN}/collections/quoteRequests`} target="_blank" rel="noreferrer">Quote Requests</a>.
          Each entry includes the customer's contact details, the product, the quantity, and the exact
          configuration they selected (door, panel, colours, accessories). Open any row to see the full
          details.
        </p>
      </Guide>

    </div>
  )
}

export default Guides
