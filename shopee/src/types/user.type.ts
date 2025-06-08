type Role = 'User' | 'Admin'

interface BaseUser {
  name?: string
  date_of_birth?: string // ISO 8610
  avatar?: string
  address?: string
  phone?: string
}

export interface User extends BaseUser {
  _id: string
  email: string
  roles: Role[]
  createdAt: string
  updatedAt: string
}

export interface BodyUpdateProfile extends BaseUser {
  email?: string
  password?: string
  newPassword?: string
}
