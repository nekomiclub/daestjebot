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
    allow_public_invoke_everyone: boolean
  }
}