export type UserRecord = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type AuthUser = Omit<UserRecord, 'password'>;
