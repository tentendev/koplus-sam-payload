import type { CollectionConfig } from 'payload'

import { clerkAuthStrategy } from '../auth/clerk'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: {
    disableLocalStrategy: true,
    strategies: [clerkAuthStrategy],
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      index: true,
      required: true,
      unique: true,
    },
    {
      name: 'clerkUserId',
      type: 'text',
      index: true,
      unique: true,
      admin: {
        description: 'Clerk user ID. Linked automatically after a successful Clerk sign-in.',
        readOnly: true,
      },
    },
    {
      name: 'name',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
  ],
}
