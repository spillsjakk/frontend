import React, { FunctionComponent, useState } from "react";
import {
  UserRegistrationProvider,
  User,
  defaultUserRegistrationContext,
} from "../../context/registration";
import { fetchCall } from "../../functions";

const WithUserRegistration: FunctionComponent<{}> = ({ children }) => {
  const [user, setUser] = useState<User>(defaultUserRegistrationContext.user);

  function register(invitationId: string) {
    fetchCall(
      "/s/registration",
      "POST",
      {
        ...user,
        invitationId,
      },
      (response) => {
        console.log("response", response);
      }
    );
  }

  return (
    <UserRegistrationProvider
      value={{
        user,
        register,
        changeUsername: (username: string) => {
          setUser({ ...user, username });
        },
        changeFirstname: (firstName: string) => {
          setUser({ ...user, firstName });
        },
        changeLastname: (lastName: string) => {
          setUser({ ...user, lastName });
        },
        changeCountry: (country: string) => {
          setUser({ ...user, country });
        },
        changeRegion: (region: string) => {
          setUser({ ...user, region });
        },
        changeGender: (gender: any) => {
          setUser({ ...user, gender });
        },
        changeEmail: (email: string) => {
          setUser({ ...user, email });
        },
        changeFideId: (fideId: string) => {
          setUser({ ...user, fideId });
        },
        changeBirthdate: (birthDate: string) => {
          setUser({ ...user, birthDate });
        },
        changePassword: (password: string) => {
          setUser({ ...user, password });
        },
      }}
    >
      {children}
    </UserRegistrationProvider>
  );
};

export { WithUserRegistration };
