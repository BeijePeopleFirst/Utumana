export interface LoginResponse {
  email: string,
  permission: string,
  token: string,
  refresh_token: string,
  id: number,
  profile_picture_url: string
}