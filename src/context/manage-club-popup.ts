import React, { Context, useContext } from "react";

export interface ManageClubPopupContext {
  isOpen: boolean;
  openDetailEdit: () => void;
  openClubList: () => void;
  openPlayerList: () => void;
  openPowerShare: () => void;
  openStats: () => void;
  close: () => void;
}

const initalValues = {
  isOpen: false,
  openDetailEdit: () => {},
  openClubList: () => {},
  openPlayerList: () => {},
  openPowerShare: () => {},
  openStats: () => {},
  close: () => {},
};

const ManageClubPopupContext: Context<ManageClubPopupContext> = React.createContext(
  initalValues
);

export const ManageClubPopupProvider = ManageClubPopupContext.Provider;
export default ManageClubPopupContext;
export const useManageClubPopup = () => useContext(ManageClubPopupContext);
