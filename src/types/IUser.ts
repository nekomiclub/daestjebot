export enum USER_RIGHTS {
  CAN_PING = 'can_ping',

  BIRTHDAY_NOTIFY_3DAYS = 'bd_nt3'
}



export interface IUser {
  id: number
  name: string
  participateChatsIds: number[]
  rights: USER_RIGHTS[]

  username?: string

  /** utc-0 timestamp */
  birthday?: number
}



export default IUser;