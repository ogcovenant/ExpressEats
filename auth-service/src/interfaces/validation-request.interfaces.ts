export interface IRegisterData {
  username: string;
  email: string;
  password: string;
}

export interface ILoginData {
  email: string;
  password: string;
}

export interface IRefreshTokenData {
  token: string;
}
