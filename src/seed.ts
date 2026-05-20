/**
 * Seed script — imports the current SAM catalogue into Payload.
 *
 * Run:
 *   cd sam-payload && npx tsx src/seed.ts
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from './payload.config'

// ─── Palettes (mirrors PALETTES in sam-configurator.js) ─────────────────
const PALETTES = {
  exterior: {
    name: 'Exterior (default)',
    type: 'exterior' as const,
    colors: [
      { code: 'WH', name: 'White',         bg: '#dbdbdb', border: '#dbdbdb' },
      { code: 'GG', name: 'Graphite Grey', bg: '#5a5b58', border: '#5a5b58' },
      { code: 'DK', name: 'Black',         bg: '#1e2618', border: '#1e2618' },
      { code: 'PK', name: 'Dusty Rose',    bg: '#e79f93', border: '#e79f93' },
      { code: 'RD', name: 'Bright Red',    bg: '#bd4416', border: '#bd4416' },
      { code: 'BR', name: 'Brick Red',     bg: '#93311c', border: '#93311c' },
      { code: 'CP', name: 'Cappuccino',    bg: '#d7d2b3', border: '#d7d2b3' },
      { code: 'YE', name: 'Yellow',        bg: '#ebbd00', border: '#ebbd00' },
      { code: 'GR', name: 'Forest Green',  bg: '#134d22', border: '#134d22' },
      { code: 'LB', name: 'Sky Blue',      bg: '#80bfc9', border: '#80bfc9' },
      { code: 'NB', name: 'Navy Blue',     bg: '#14335d', border: '#14335d' },
      { code: 'PP', name: 'Purple',        bg: '#5f3350', border: '#5f3350' },
    ],
  },
  exteriorMedium: {
    name: 'Exterior (Medium)',
    type: 'exterior' as const,
    colors: [
      { code: 'WH', name: 'White',         bg: '#dbdbdb', border: '#dbdbdb' },
      { code: 'GG', name: 'Graphite Grey', bg: '#5a5b58', border: '#5a5b58' },
      { code: 'BK', name: 'Black',         bg: '#1e2618', border: '#1e2618' },
      { code: 'DR', name: 'Dusty Rose',    bg: '#e79f93', border: '#e79f93' },
      { code: 'BR', name: 'Brick Red',     bg: '#93311c', border: '#93311c' },
      { code: 'PM', name: 'Plum',          bg: '#5f3350', border: '#5f3350' },
      { code: 'CP', name: 'Cappuccino',    bg: '#d7d2b3', border: '#d7d2b3' },
      { code: 'YE', name: 'Yellow',        bg: '#ebbd00', border: '#ebbd00' },
      { code: 'FG', name: 'Forest Green',  bg: '#134d22', border: '#134d22' },
      { code: 'SB', name: 'Sky Blue',      bg: '#80bfc9', border: '#80bfc9' },
      { code: 'NB', name: 'Navy Blue',     bg: '#14335d', border: '#14335d' },
      { code: 'PP', name: 'Purple',        bg: '#5f3350', border: '#5f3350' },
    ],
  },
  interior: {
    name: 'Interior PET',
    type: 'interior' as const,
    colors: [
      { code: 'BWH', name: 'Blended White', bg: '#f0ece4', border: '#d1d5db' },
      { code: 'LTG', name: 'Light Grey',    bg: '#9ca3af', border: '#9ca3af' },
      { code: 'DKG', name: 'Dark Grey',     bg: '#4b5563', border: '#4b5563' },
      { code: 'BUR', name: 'Burgundy',      bg: '#6b1d2a', border: '#6b1d2a' },
      { code: 'TAU', name: 'Taupe',         bg: '#c4b8a5', border: '#c4b8a5' },
      { code: 'GRN', name: 'Green',         bg: '#166534', border: '#166534' },
      { code: 'BLU', name: 'Blue',          bg: '#3b82f6', border: '#3b82f6' },
    ],
  },
  accDesk: {
    name: 'Accessory: Desk surface',
    type: 'accessory' as const,
    colors: [
      { code: 'WH', name: 'White', bg: '#ffffff', border: '#d1d5db' },
      { code: 'BK', name: 'Black', bg: '#1a1a1a', border: '#1a1a1a' },
    ],
  },
  accUpholstery: {
    name: 'Accessory: Upholstery',
    type: 'accessory' as const,
    colors: [
      { code: 'GBN', name: 'Burgundy',   bg: '#6b1d2a', border: '#6b1d2a' },
      { code: 'GDB', name: 'Dark Blue',  bg: '#1e3a5f', border: '#1e3a5f' },
      { code: 'GDG', name: 'Dark Grey',  bg: '#4b5563', border: '#4b5563' },
      { code: 'GGR', name: 'Green',      bg: '#166534', border: '#166534' },
      { code: 'GLB', name: 'Light Blue', bg: '#a5d8e6', border: '#a5d8e6' },
      { code: 'GPP', name: 'Purple',     bg: '#4c1d6e', border: '#4c1d6e' },
      { code: 'GRD', name: 'Red',        bg: '#b91c1c', border: '#b91c1c' },
      { code: 'GYE', name: 'Yellow',     bg: '#eab308', border: '#eab308' },
    ],
  },
}

// ─── Accessories (mirrors index.html) ───────────────────────────────────
const ACCESSORIES = [
  {
    code: 'flex-bench',
    label: 'Flex Bench',
    layerKey: 'accBench',
    skuTemplate: 'L3_AC_FB_{colour}',
    paletteKey: 'accUpholstery',
    defaultColorCode: 'GBN',
    excludedColorCodes: ['GLB'],
  },
  {
    code: 'flex-desk',
    label: 'Flex Desk',
    layerKey: 'accDesk',
    skuTemplate: 'L3_AC_FD_{colour}',
    paletteKey: 'accDesk',
    defaultColorCode: 'WH',
    excludedColorCodes: [],
  },
  {
    code: 'flip-desk',
    label: 'Flip Desk',
    layerKey: 'accDesk',
    skuTemplate: 'L3_AC_FB_{colour}',
    paletteKey: 'accDesk',
    defaultColorCode: 'WH',
    excludedColorCodes: [],
  },
  {
    code: 'milli-sofa',
    label: 'Milli Sofa',
    layerKey: 'accSofa',
    skuTemplate: 'L3_AC_SF_{colour}',
    paletteKey: 'accUpholstery',
    defaultColorCode: 'GBN',
    excludedColorCodes: [],
  },
]

// ─── Products (mirrors index.html) ──────────────────────────────────────
const PRODUCTS = [
  {
    slug: 'single',
    label: 'Single',
    title: 'Sam Single Booth',
    subtitle: 'A compact one-person booth for focused calls and deep work in an open-plan workspace.',
    skuPrefix: 'SS',
    assetBaseUrl: 'https://kolo-website.s3.eu-west-1.amazonaws.com/KoplusSam/sam_single',
    allGlassCode: 'GS_NA',
    sortOrder: 1,
    exteriorPaletteKey: 'exterior',
    interiorPaletteKey: 'interior',
    accessoryCodes: ['flex-bench', 'flex-desk'],
    layers: [
      { key: 'panel',    folder: 'panel',       zIndex: 1 },
      { key: 'interior', folder: 'interior',    zIndex: 2 },
      { key: 'accBench', folder: 'accessories', zIndex: 3 },
      { key: 'accDesk',  folder: 'accessories', zIndex: 3 },
      { key: 'exterior', folder: 'exterior',    zIndex: 4 },
      { key: 'door',     folder: 'frame',       zIndex: 5 },
    ],
    panels: [
      { code: 'GS_NA', label: 'Glass', icon: 'glass' as const },
      { code: 'WL_NA', label: 'Wall',  icon: 'wall' as const },
    ],
    panelRestrictions: [] as { panelCode: string; excludedInteriorCodes: { code: string }[] }[],
  },
  {
    slug: 'medium',
    label: 'Medium',
    title: 'Sam Medium Booth',
    subtitle: 'A self-contained individual studio space designed for private work and longer sessions in an open-plan workspace.',
    skuPrefix: 'SM',
    assetBaseUrl: 'https://kolo-website.s3.eu-west-1.amazonaws.com/KoplusSam/sam_medium',
    allGlassCode: 'GS_GS',
    sortOrder: 2,
    exteriorPaletteKey: 'exteriorMedium',
    interiorPaletteKey: 'interior',
    accessoryCodes: ['flip-desk', 'milli-sofa'],
    layers: [
      { key: 'panel',    folder: 'panel',       zIndex: 1 },
      { key: 'interior', folder: 'interior',    zIndex: 2 },
      { key: 'accDesk',  folder: 'accessories', zIndex: 3 },
      { key: 'accSofa',  folder: 'accessories', zIndex: 3 },
      { key: 'door',     folder: 'frame',       zIndex: 4 },
      { key: 'exterior', folder: 'exterior',    zIndex: 5 },
    ],
    panels: [
      { code: 'GS_GS', label: '2 Glasses',        icon: '2glass' as const },
      { code: 'GS_WL', label: 'L Glass + R Wall', icon: 'glass-wall' as const },
      { code: 'WL_GS', label: 'L Wall + R Glass', icon: 'wall-glass' as const },
      { code: 'WL_WL', label: '2 Walls',          icon: '2wall' as const },
    ],
    panelRestrictions: [
      { panelCode: 'WL_WL', excludedInteriorCodes: [{ code: 'BUR' }] },
    ],
  },
  {
    slug: 'large',
    label: 'Large',
    title: 'Sam Large Booth',
    subtitle: 'A spacious booth for small team meetings and collaborative sessions away from the open floor.',
    skuPrefix: 'SL',
    assetBaseUrl: 'https://kolo-website.s3.eu-west-1.amazonaws.com/KoplusSam/sam_large',
    allGlassCode: 'GS_GS',
    sortOrder: 3,
    exteriorPaletteKey: 'exterior',
    interiorPaletteKey: 'interior',
    accessoryCodes: [] as string[],
    layers: [
      { key: 'panel',    folder: 'panel',    zIndex: 1 },
      { key: 'interior', folder: 'interior', zIndex: 2 },
      { key: 'exterior', folder: 'exterior', zIndex: 3 },
      { key: 'door',     folder: 'frame',    zIndex: 4 },
    ],
    panels: [
      { code: 'GS_GS', label: '2 Glasses',        icon: '2glass' as const },
      { code: 'GS_WL', label: 'L Glass + R Wall', icon: 'glass-wall' as const },
      { code: 'WL_GS', label: 'L Wall + R Glass', icon: 'wall-glass' as const },
      { code: 'WL_WL', label: '2 Walls',          icon: '2wall' as const },
    ],
    panelRestrictions: [] as { panelCode: string; excludedInteriorCodes: { code: string }[] }[],
  },
]

async function seed() {
  const payload = await getPayload({ config })

  console.log('\n🌱 Seeding SAM data into Payload...\n')

  // Step 1: Create palettes + their colors
  const paletteIds: Record<string, number> = {}

  for (const [key, palette] of Object.entries(PALETTES)) {
    const existing = await payload.find({
      collection: 'palettes',
      where: { key: { equals: key } },
      limit: 1,
    })

    let paletteId: number
    if (existing.docs.length > 0) {
      paletteId = Number(existing.docs[0].id)
      console.log(`  ↻ Palette "${key}" already exists, reusing.`)
    } else {
      const created = await payload.create({
        collection: 'palettes',
        data: { name: palette.name, key, type: palette.type },
      })
      paletteId = Number(created.id)
      console.log(`  ✓ Created palette "${key}"`)
    }
    paletteIds[key] = paletteId

    for (let i = 0; i < palette.colors.length; i++) {
      const c = palette.colors[i]
      const colorExisting = await payload.find({
        collection: 'colors',
        where: {
          and: [
            { palette: { equals: paletteId } },
            { code: { equals: c.code } },
          ],
        },
        limit: 1,
      })
      if (colorExisting.docs.length === 0) {
        await payload.create({
          collection: 'colors',
          data: {
            palette: paletteId,
            code: c.code,
            name: c.name,
            bgColor: c.bg,
            borderColor: c.border,
            sortOrder: i,
          },
        })
      }
    }
    console.log(`    → ${palette.colors.length} colors`)
  }

  // Step 2: Create accessories
  const accessoryIds: Record<string, number> = {}
  for (const a of ACCESSORIES) {
    const existing = await payload.find({
      collection: 'accessories',
      where: { code: { equals: a.code } },
      limit: 1,
    })
    let id: number
    if (existing.docs.length > 0) {
      id = Number(existing.docs[0].id)
      console.log(`  ↻ Accessory "${a.code}" already exists, reusing.`)
    } else {
      const created = await payload.create({
        collection: 'accessories',
        data: {
          code: a.code,
          label: a.label,
          layerKey: a.layerKey,
          skuTemplate: a.skuTemplate,
          palette: paletteIds[a.paletteKey],
          defaultColorCode: a.defaultColorCode,
          excludedColorCodes: a.excludedColorCodes.map((code) => ({ code })),
        },
      })
      id = Number(created.id)
      console.log(`  ✓ Created accessory "${a.code}"`)
    }
    accessoryIds[a.code] = id
  }

  // Step 3: Create products
  for (const p of PRODUCTS) {
    const existing = await payload.find({
      collection: 'products',
      where: { slug: { equals: p.slug } },
      limit: 1,
    })
    if (existing.docs.length > 0) {
      console.log(`  ↻ Product "${p.slug}" already exists, skipping.`)
      continue
    }
    await payload.create({
      collection: 'products',
      data: {
        slug: p.slug,
        label: p.label,
        title: p.title,
        subtitle: p.subtitle,
        skuPrefix: p.skuPrefix,
        assetBaseUrl: p.assetBaseUrl,
        allGlassCode: p.allGlassCode,
        sortOrder: p.sortOrder,
        status: 'published',
        exteriorPalette: paletteIds[p.exteriorPaletteKey],
        interiorPalette: paletteIds[p.interiorPaletteKey],
        accessories: p.accessoryCodes.map((code) => accessoryIds[code]),
        layers: p.layers,
        panels: p.panels,
        panelRestrictions: p.panelRestrictions,
      },
    })
    console.log(`  ✓ Created product "${p.slug}"`)
  }

  console.log('\n✅ Seed complete!\n')
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})
