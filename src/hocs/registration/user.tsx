import React, { FunctionComponent, useState } from "react";
import ReactDOM from "react-dom";
import { useHistory } from "react-router-dom";
import Translated from "../../components/translated";
import { useUser } from "../../components/UserContext";
import {
  UserRegistrationProvider,
  User,
  defaultUserRegistrationContext,
} from "../../context/registration";
import { ErrorComponent, fetchCall } from "../../functions";

const WithUserRegistration: FunctionComponent<{}> = ({ children }) => {
  const [user, setUser] = useState<User>(defaultUserRegistrationContext.user);

  const history = useHistory();
  const userContext = useUser();

  function register(invitationId: string) {
    fetchCall(
      "/s/registrations/accounts",
      "POST",
      {
        username: user.username,
        first_name: user.firstName,
        last_name: user.lastName,
        country: user.country,
        gender: user.gender,
        email: user.email ? user.email : undefined,
        fide_id: user.fideId || undefined,
        birth_date: user.birthDate,
        password: user.password,
        invitation_id: invitationId,
        title: user.title,
        rating: user.rating,
      },
      () => {
        fetchCall(
          "/s/account/login",
          "POST",
          {
            id: user.username,
            password: user.password,
          },
          (user) => {
            userContext.setUser(user);
            history.push("/");
          }
        );
      },
      (error) => {
        if (error === "409") {
          ReactDOM.render(
            <>
              <ErrorComponent err={Translated.byKey("usernameExists")} />
            </>,
            document.getElementById("error")
          );
        }
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
        changeGender: (gender: any) => {
          setUser({ ...user, gender });
        },
        changeEmail: (email: string) => {
          setUser({ ...user, email });
        },
        changeFideId: (fideId: number) => {
          setUser({ ...user, fideId });
        },
        changeBirthdate: (birthDate: string) => {
          setUser({ ...user, birthDate });
        },
        changePassword: (password: string) => {
          setUser({ ...user, password });
        },
        changeUser: (userFields: any) => {
          setUser({ ...user, ...userFields });
        },
      }}
    >
      {children}
    </UserRegistrationProvider>
  );
};

export { WithUserRegistration };
