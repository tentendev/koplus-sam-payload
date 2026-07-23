import { createClerkClient } from '@clerk/backend'
import type { AuthStrategy } from 'payload'

const getAuthorizedParties = (): string[] => {
  const candidates = [
    process.env.NEXT_PUBLIC_SERVER_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : undefined,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
    process.env.NODE_ENV !== 'production' ? 'http://localhost:3000' : undefined,
    process.env.NODE_ENV !== 'production' ? 'http://127.0.0.1:3000' : undefined,
  ]

  return [
    ...new Set(
      candidates.flatMap((candidate) => {
        if (!candidate) return []

        try {
          return [new URL(candidate).origin]
        } catch {
          return []
        }
      }),
    ),
  ]
}

const getRequestURL = (): string => getAuthorizedParties()[0] || 'http://localhost:3000'

const getAllowedAdminEmails = (): Set<string> =>
  new Set(
    (process.env.CLERK_ADMIN_EMAILS || '')
      .split(',')
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  )

export const clerkAuthStrategy: AuthStrategy = {
  name: 'clerk',
  authenticate: async ({ headers, payload }) => {
    const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
    const secretKey = process.env.CLERK_SECRET_KEY

    if (!publishableKey || !secretKey) {
      return { user: null }
    }

    try {
      const clerk = createClerkClient({ publishableKey, secretKey })
      const requestState = await clerk.authenticateRequest(
        new Request(`${getRequestURL()}/api/users/me`, { headers }),
        {
          acceptsToken: 'session_token',
          authorizedParties: getAuthorizedParties(),
        },
      )

      if (!requestState.isAuthenticated) {
        return { user: null }
      }

      const { userId } = requestState.toAuth()
      const byClerkID = await payload.find({
        collection: 'users',
        limit: 1,
        overrideAccess: true,
        where: {
          clerkUserId: {
            equals: userId,
          },
        },
      })

      let payloadUser = byClerkID.docs[0]

      if (payloadUser) {
        return {
          user: {
            ...payloadUser,
            _strategy: 'clerk',
            collection: 'users',
          },
        }
      }

      const clerkUser = await clerk.users.getUser(userId)
      const primaryEmail = clerkUser.emailAddresses.find(
        ({ id }) => id === clerkUser.primaryEmailAddressId,
      )?.emailAddress

      if (!primaryEmail) {
        payload.logger.warn(`Clerk user ${userId} does not have a primary email address.`)
        return { user: null }
      }

      const normalizedEmail = primaryEmail.toLowerCase()

      if (!payloadUser) {
        const byEmail = await payload.find({
          collection: 'users',
          limit: 1,
          overrideAccess: true,
          where: {
            email: {
              equals: normalizedEmail,
            },
          },
        })

        payloadUser = byEmail.docs[0]
      }

      if (payloadUser && payloadUser.clerkUserId !== userId) {
        payloadUser = await payload.update({
          collection: 'users',
          id: payloadUser.id,
          data: {
            clerkUserId: userId,
          },
          overrideAccess: true,
        })
      }

      if (!payloadUser) {
        const { totalDocs } = await payload.count({
          collection: 'users',
          overrideAccess: true,
        })
        const isAllowlisted = getAllowedAdminEmails().has(normalizedEmail)
        const canBootstrapLocalAdmin = process.env.NODE_ENV !== 'production' && totalDocs === 0

        if (!isAllowlisted && !canBootstrapLocalAdmin) {
          payload.logger.warn(`Clerk user ${userId} is not authorized for the Payload admin.`)
          return { user: null }
        }

        const name = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ')

        payloadUser = await payload.create({
          collection: 'users',
          data: {
            clerkUserId: userId,
            email: normalizedEmail,
            name: name || undefined,
          },
          overrideAccess: true,
        })
      }

      return {
        user: {
          ...payloadUser,
          _strategy: 'clerk',
          collection: 'users',
        },
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown Clerk authentication error'
      payload.logger.error(`Clerk authentication failed: ${message}`)
      return { user: null }
    }
  },
}
