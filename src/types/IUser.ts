export enum USER_RIGHTS {
  CAN_PING = 'can_ping',
}



export interface IUser {
  id: number
  name: string
  username: string | undefined
  participateChatsIds: number[]
  rights: USER_RIGHTS[]
}



export default IUser;