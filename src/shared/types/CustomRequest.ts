import { Request } from "express";

type CustomRequest = Request & {
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