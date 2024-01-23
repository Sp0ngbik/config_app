export type AuthArgsType = {
  email: string
  password: string
  rememberMe?: boolean
}

export type SignUpArgsType = {
  email: string
  name?: string
  password: string
  sendConfirmationEmail: boolean
  subject?: string
}

export type SignUpResponseType = {
  avatar: string
  created: string
  email: string
  id: string
  isEmailVerified: boolean
  name: string
  updated: string
}

export type ServerError = {
  error: {
    data: {
      errorMessages: string[]
    }
  }
  isLoading: boolean
}