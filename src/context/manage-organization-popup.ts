import React, { Context, useContext } from "react";

export interface ManageOrganizationPopupContext {
  isOpen: boolean;
  openDetailEdit: () => void;
  openClubList: () => void;
  openPlayerList: () => void;
  openStats: () => void;
  close: () => void;
}

const initalValues = {
  isOpen: false,
  openDetailEdit: () => {},
  openClubList: () => {},
  openPlayerList: () => {},
  openStats: () => {},
  close: () => {},
};

const ManageOrganizationPopupContext: Context<ManageOrganizationPopupContext> = React.createContext(
  initalValues
);

export const ManageOrganizationPopupProvider =
  ManageOrganizationPopupContext.Provider;
export default ManageOrganizationPopupContext;
export const useManageOrganizationPopup = () =>
  useContext(ManageOrganizationPopupContext);
