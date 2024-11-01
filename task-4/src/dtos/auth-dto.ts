export type RegisterDTO = {
  username: string;
  email: string;
  password: string;
  role: string;
};

export type LoginDTO = {
  email: string;
  password: string;
};
