export enum USER_RIGHTS {
  CAN_PING = 'can_ping',

  BIRTHDAY_NOTIFY_3DAYS = 'bd_nt3'
}



export type TUser = {
  /** User telegram id */
  id: number

  /** User public name */
  name: string | null

  /** @deprecated User chats in */
  participateChatsIds: number[]

  /** User chats */
  participate_at: number[]

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
}



export default TUser;