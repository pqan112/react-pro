type Role = 'User' | 'Admin'

interface BaseUser {
  email: string
  name?: string
  date_of_birth?: string // ISO 8610
  avatar?: string
  address?: string
  phone?: string
}

export interface User extends BaseUser {
  _id: string
  roles: Role[]
  createdAt: string
  updatedAt: string
}

export interface BodyUpdateProfile extends BaseUser {
  password?: string
  newPassword?: string
}
