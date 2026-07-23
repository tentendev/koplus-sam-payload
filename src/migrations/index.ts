import * as addClerkUserFields from './20260723_091500_add_clerk_user_fields'

export const migrations = [
  {
    name: addClerkUserFields.name,
    up: addClerkUserFields.up,
    down: addClerkUserFields.down,
  },
]
