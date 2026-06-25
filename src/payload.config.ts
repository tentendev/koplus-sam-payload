import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'

import { Users } from './collections/Users'
import { Series } from './collections/Series'
import { Palettes } from './collections/Palettes'
import { Colors } from './collections/Colors'
import { Accessories } from './collections/Accessories'
import { Products } from './collections/Products'
import { QuoteRequests } from './collections/QuoteRequests'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Resolve the public-facing URL for this deployment.
// In Vercel, VERCEL_PROJECT_PRODUCTION_URL is the production hostname.
const serverURL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '') ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '') ||
  'http://localhost:3000'

// Email (Brevo SMTP). Only configured when SMTP credentials are present, so the
// app still boots fine without them (emails just won't send until env is set).
const emailAdapter = process.env.SMTP_USER
  ? nodemailerAdapter({
      defaultFromAddress: process.env.EMAIL_FROM || 'no-reply@koplusbrand.com',
      defaultFromName: process.env.EMAIL_FROM_NAME || 'Koplus SAM Configurator',
      transportOptions: {
        host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
        port: Number(process.env.SMTP_PORT) || 587,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      },
    })
  : undefined

export default buildConfig({
  serverURL,
  email: emailAdapter,
  admin: {
    user: Users.slug,
    components: {
      graphics: {
        Icon: '/components/Icon#Icon',
        Logo: '/components/Logo#Logo',
      },
      // "User Manual" sidebar tab → dedicated /admin/user-manual page.
      afterNavLinks: ['/components/GuidesNavLink#GuidesNavLink'],
      views: {
        userManual: {
          Component: '/components/GuidesView#GuidesView',
          path: '/user-manual',
        },
      },
    },
    meta: {
      titleSuffix: '- Koplus Sam',
      icons: [
        {
          rel: 'icon',
          type: 'image/png',
          url: 'https://cdn.prod.website-files.com/5edcaf96992873f032795a12/5ef20e6ee977cfdd038b196c_Koplus-favcon-32x32px.png',
        },
      ],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Series, Palettes, Colors, Accessories, Products, QuoteRequests],
  cors: '*', // dev-only; tighten to specific origins for prod
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  // Use Postgres in production (when DATABASE_URI starts with postgres://)
  // and SQLite for local dev (file:./payload.db).
  db: (process.env.DATABASE_URI || '').startsWith('postgres')
    ? postgresAdapter({
        pool: {
          connectionString: process.env.DATABASE_URI as string,
        },
      })
    : sqliteAdapter({
        client: {
          url: process.env.DATABASE_URI || 'file:./payload.db',
        },
      }),
  sharp,
  plugins: [],
})
