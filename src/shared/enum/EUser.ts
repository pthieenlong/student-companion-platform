export enum Active {
  UNACTIVE = 0,
  ACTIVE = 1
}

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export enum GroupRole {
  OWNER = 'OWNER',
  MEMBER = 'MEMBER',
  MODERATOR = 'MODERATOR'
}

export enum SchoolRole {
  OWNER = 'OWNER',
  MEMBER = 'MEMBER',
  MODERATOR = 'MODERATOR',
  TEACHER = 'TEACHER',
  SUPPORTER = 'SUPPORTER'
}

export type GroupType = {
  id: string,
  role: GroupRole
}

export type SchoolType = {
  id: string,
  role: SchoolRole
}

export type AuthenticateToken = {
  refreshToken: string,
  accessToken: string
}