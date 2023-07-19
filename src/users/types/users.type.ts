export type CreateUserType = {
  email: string;
  firstName: string;
  lastName: string;
};

export type UpdateUserType = Partial<CreateUserType>;
