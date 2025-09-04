export enum USER_RIGHTS {
  CAN_PING = 'can_ping',
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