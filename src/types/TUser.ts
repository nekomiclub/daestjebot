export enum USER_RIGHTS {
  CAN_PING = 'can_ping',

  BIRTHDAY_NOTIFY_3DAYS = 'bd_nt3'
}



export type TUser = {
  /** User telegram id */
  id: number

  /** User public name */
  name: string | null

  /** @deprecated Rights */
  rights: USER_RIGHTS[]

  /** User username */
  username: string | null

  /** @deprecated User birthday UTC timestamp */
  birthday?: number



  /** ISO timestamp of birthday date */
  birthday_at: string | null

  /** ISO timestamp of birthday changed date */
  birthday_changed_at: string | null

  /** Year when user was previously notified */
  birthday_notified_year: number | null

  /** Year when user was previously warned */
  birthday_warned_year: number | null

  /** Whether to recieve mutual contacts birthday notifications */
  recieve_birthday_notifications: boolean
}



export default TUser;