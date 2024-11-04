export interface JwtSign {
  access_token: string;
  refresh_token: string;
}
export interface Payload {
  userId: string;
  timestamp: string;
}
