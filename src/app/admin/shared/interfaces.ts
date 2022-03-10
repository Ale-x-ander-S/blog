export interface User {
  email: string | any
  password: string | any
  returnSecureToken?: boolean
}

export interface FbAuthResponse {
  idToken: string
  expiresIn: string
}

export class Post {
  id?: string
  title!: string
  text!: string
  author!: string
  date!: Date
}

export class FbCreateResponse {
  name!: string
}
