import React, { FunctionComponent, useCallback, useState } from "react";
import { FormProvider } from "../../context/build-league-form";

const WithLeagueForm: FunctionComponent = ({ children }) => {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visible, setVisible] = useState(false);
  const [organization, setOrganization] = useState("");
  const [club, setClub] = useState("");
  const [profilePicture, setProfilePicture] = useState<string>("");
  const [bannerPicture, setBannerPicture] = useState<string>("");

  const changeId = useCallback((value: string) => {
    setId(value);
  }, []);

  const changeName = useCallback((value: string) => {
    setName(value);
  }, []);

  const changeDescription = useCallback((value: string) => {
    setDescription(value);
  }, []);

  const changeVisible = useCallback((value: boolean) => {
    setVisible(value);
  }, []);

  const changeOrganization = useCallback((value: string) => {
    setOrganization(value);
  }, []);

  const changeClub = useCallback((value: string) => {
    setClub(value);
  }, []);

  const changeProfilePicture = useCallback((value: string) => {
    setProfilePicture(value);
  }, []);

  const changeBannerPicture = useCallback((value: string) => {
    setBannerPicture(value);
  }, []);

  return (
    <FormProvider
      value={{
        id,
        changeId,
        name,
        changeName,
        description,
        changeDescription,
        profilePicture,
        changeProfilePicture,
        bannerPicture,
        changeBannerPicture,
        visible,
        changeVisible,
        organization,
        changeOrganization,
        club,
        changeClub,
      }}
    >
      {children}
    </FormProvider>
  );
};
export { WithLeagueForm };
