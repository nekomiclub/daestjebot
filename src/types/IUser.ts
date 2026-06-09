export enum USER_RIGHTS {
  CAN_PING = 'can_ping',

  BIRTHDAY_NOTIFY_3DAYS = 'bd_nt3'
}



export interface IUser {
  /** User telegram id */
  id: number

  /** User public name */
  name: string

  /** User chats in */
  participateChatsIds: number[]

  /** Rights */
  rights: USER_RIGHTS[]

  /** User username */
  username?: string | null

  /** User birthday UTC timestamp */
  birthday?: number



  /** ISO timestamp of birthday changed date */
  birthday_changed_at: string | null
}



export default IUser;