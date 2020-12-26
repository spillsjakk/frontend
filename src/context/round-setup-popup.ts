import React, { Context, useContext } from "react";

export interface RoundSetupPopupContext {
  open: (number: number) => void;
}

const RoundSetupPopupContext: Context<RoundSetupPopupContext> = React.createContext(
  {
    open: (number: number) => {},
  }
);

export const RoundSetupPopupProvider = RoundSetupPopupContext.Provider;
export default RoundSetupPopupContext;
export const useRoundSetupPopup = () => useContext(RoundSetupPopupContext);
