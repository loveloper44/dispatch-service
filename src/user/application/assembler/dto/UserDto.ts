import { UserType, UserProvider } from '@user/constant';

export interface User {
  id: string;
  email: string;
  password: Password | null;
  type: UserType;
  provider: UserProvider;
  version: number;
  createdAt: Date;
}

export interface Password {
  hashedPassword: string;
  createdAt: Date;
}
