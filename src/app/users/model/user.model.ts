export interface Role{
    title: string;
  };
  
export interface UserModel {
    id?: string;
    email: string;
    firstName: string;
    lastName: string;
    address: string;
    department?: string;
    phoneNumber: string;
    active?: boolean;
    roles?: Role[];
};