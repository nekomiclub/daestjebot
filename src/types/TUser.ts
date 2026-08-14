export type TUser = {
  /** User telegram id */
  id: number

  /** User public name */
  name: string | null

  /** User username */
  username: string | null

  birthday: {
    /** ISO timestamp of birthday date */
    at: string | null

    /** ISO timestamp of birthday changed date */
    changed_at: string | null

    /** Year when user was previously notified */
    notified_year: number | null

    /** Year when user was previously warned */
    warned_year: number | null
  }

  variables: {
    /** Whether to recieve mutual contacts birthday notifications */
    recieve_birthday_notifications: boolean
  }
}



export default TUser;