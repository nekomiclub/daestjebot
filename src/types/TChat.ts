export type TChat = {
  id: number
  title: string

  /** Whether is bot managing current group */
  is_active: boolean

  /** Chat participant ids */
  participants: number[]

  variables: {
    /** Whether is to notify participants on their birthday in current group */
    birthdays_notify: boolean
  }
}