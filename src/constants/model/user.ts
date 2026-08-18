export interface TUser {
    id?: number;
    role?: number;
    username?: string;
    email?: string;
    name?: string;
    permissions?: string[];
    reset_pwd_required?: boolean;
   
   
}