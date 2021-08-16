export interface RespObject{
    access_token: string;
    token_type: string;
    scope: string;
    expires_in: number;
    refresh_token: string;
}

export interface RefreshRespObject{
    access_token: string;
    expires_in: number;
    scope: string;
    token_type: string;
}