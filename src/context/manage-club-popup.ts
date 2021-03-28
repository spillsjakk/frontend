import React, { Context, useContext } from "react";

export interface ManageClubPopupContext {
  isOpen: boolean;
  openDetailEdit: () => void;
  openClubList: () => void;
  openPlayerList: () => void;
  openStats: () => void;
  openAccountsWithPowers: () => void;
  close: () => void;
}

const initalValues = {
  isOpen: false,
  openDetailEdit: () => {},
  openClubList: () => {},
  openPlayerList: () => {},
  openStats: () => {},
  openAccountsWithPowers: () => {},
  close: () => {},
};

const ManageClubPopupContext: Context<ManageClubPopupContext> = React.createContext(
  initalValues
);

export const ManageClubPopupProvider = ManageClubPopupContext.Provider;
export default ManageClubPopupContext;
export const useManageClubPopup = () => useContext(ManageClubPopupContext);
