export type TGroup = {
  id: number
  title: string

  /** Whether is bot managing current group */
  is_active: boolean

  /** Chat participant ids */
  participants: number[]

  variables: {
    /** Whether is to notify participants on their birthday in current group */
    birthdays_notify: boolean

    /** Whether to allow invoke ping everyone command by each member */
    allow_public_everyone: boolean

    /** ISO timestamp when /all has been invoked */
    everyone_invoked_at: string | null
  }
}