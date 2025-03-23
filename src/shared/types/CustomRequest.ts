import { Request } from "express";

type CustomRequest = Request & {
  cookies: {
    accessToken: string
  }
  token: {
    info: {
      username: string,
      roles: [],
      id: string,
      active: number
    }
  }
}

export default CustomRequest;