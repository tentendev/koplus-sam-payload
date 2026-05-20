import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Palettes } from './collections/Palettes'
import { Colors } from './collections/Colors'
import { Accessories } from './collections/Accessories'
import { Products } from './collections/Products'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Palettes, Colors, Accessories, Products],
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
