export type TChat = {
  id: number
  title: string

  /** Whether is bot managing current group */
  is_active: boolean

  /** Chat participant ids */
  participants: number[]
}