import React, { Context, useContext } from "react";

export interface User {
  username: string;
  firstName: string;
  lastName: string;
  country: string;
  gender: "M" | "F";
  email: string;
  birthDate: string;
  fideId: number;
  password: string;
}

export interface UserRegistrationContext {
  user: User;
  register: (id: string) => void;
  changeUsername: (value: string) => void;
  changeFirstname: (value: string) => void;
  changeLastname: (value: string) => void;
  changeCountry: (value: string) => void;
  changeGender: (value: string) => void;
  changeEmail: (value: string) => void;
  changeFideId: (fideId: number) => void;
  changeBirthdate: (fideId: string) => void;
  changePassword: (fideId: string) => void;
  changeUser: (user: any) => void;
}

export const defaultUserRegistrationContext: UserRegistrationContext = {
  user: {
    username: "",
    firstName: "",
    lastName: "",
    country: "NOR",
    gender: "M",
    email: "",
    fideId: 0,
    birthDate: "",
    password: "",
  },
  register: (id: string) => {},
  changeUsername: () => {},
  changeFirstname: () => {},
  changeLastname: () => {},
  changeCountry: () => {},
  changeGender: () => {},
  changeEmail: () => {},
  changeFideId: () => {},
  changeBirthdate: () => {},
  changePassword: () => {},
  changeUser: (user: any) => {},
};

const UserRegistrationContext: Context<UserRegistrationContext> = React.createContext(
  defaultUserRegistrationContext
);

export const UserRegistrationProvider = UserRegistrationContext.Provider;
export default UserRegistrationContext;
export const useUserRegistration = () => useContext(UserRegistrationContext);
