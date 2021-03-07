import React, { Context, useContext } from "react";

export interface FormContext {
  show: boolean;
  changeShow: (value: boolean) => void;
  id: string;
  changeId: (value: string) => void;
  name: string;
  changeName: (value: string) => void;
  description: string;
  changeDescription: (value: string) => void;
  kind: number;
  changeKind: (value: number) => void;
  defaultGameLocation: number;
  changeDefaultGameLocation: (value: number) => void;
  startDate: string;
  changeStartDate: (value: string) => void;
  endDate: string;
  changeEndDate: (value: string) => void;
  publiclyViewable: boolean;
  changePubliclyViewable: (value: boolean) => void;
  firstPairingDate: string;
  changeFirstPairingDate: (value: string) => void;
  firstPairingTime: string;
  changeFirstPairingTime: (value: string) => void;
  onlinePairingIntervalN: number;
  changeOnlinePairingIntervalN: (value: number) => void;
  onlinePairingIntervalT: number;
  changeOnlinePairingIntervalT: (value: number) => void;
  initialTime: number;
  changeInitialTime: (value: number) => void;
  increment: number;
  changeIncrement: (value: number) => void;
  selfJoinable: boolean;
  changeSelfJoinable: (value: boolean) => void;
  showOnlyTop: boolean;
  changeShowOnlyTop: (value: boolean) => void;
  showOnlyTopNr: number;
  changeShowOnlyTopNr: (value: number) => void;
  winPoints: number;
  changeWinPoints: (value: number) => void;
  drawPoints: number;
  changeDrawPoints: (value: number) => void;
  lossPoints: number;
  changeLossPoints: (value: number) => void;
  tb1: string;
  changeTb1: (value: string) => void;
  tb2: string;
  changeTb2: (value: string) => void;
  tb3: string;
  changeTb3: (value: string) => void;
  tb4: string;
  changeTb4: (value: string) => void;
  fideRated: boolean;
  changeFideRated: (value: boolean) => void;
  rounds?: number;
  changeRounds?: (value: number) => void;
  perTeam?: number;
  changePerTeam?: (value: number) => void;
  showOnlyUsernames: boolean;
  changeShowOnlyUsernames: (value: boolean) => void;
  profilePicture: string;
  changeProfilePicture: (value: string) => void;
  bannerPicture: string;
  changeBannerPicture: (value: string) => void;
  organiser: string;
  changeOrganiser: (value: string) => void;
  organiserType: string;
  changeOrganiserType: (value: string) => void;
}

const initalValues = {
  show: true,
  changeShow: (value: boolean) => {},
  id: "",
  changeId: (value: string) => {},
  name: "",
  changeName: (value: string) => {},
  description: "",
  changeDescription: (value: string) => {},
  kind: 0,
  changeKind: (value: number) => {},
  defaultGameLocation: 0,
  changeDefaultGameLocation: (value: number) => {},
  startDate: "",
  changeStartDate: (value: string) => {},
  endDate: "",
  changeEndDate: (value: string) => {},
  publiclyViewable: false,
  changePubliclyViewable: (value: boolean) => {},
  firstPairingDate: "",
  changeFirstPairingDate: (value: string) => {},
  firstPairingTime: "",
  changeFirstPairingTime: (value: string) => {},
  onlinePairingIntervalN: 0,
  changeOnlinePairingIntervalN: (value: number) => {},
  onlinePairingIntervalT: 0,
  changeOnlinePairingIntervalT: (value: number) => {},
  initialTime: 0,
  changeInitialTime: (value: number) => {},
  increment: 0,
  changeIncrement: (value: number) => {},
  selfJoinable: false,
  changeSelfJoinable: (value: boolean) => {},
  showOnlyTop: false,
  changeShowOnlyTop: (value: boolean) => {},
  showOnlyTopNr: 0,
  changeShowOnlyTopNr: (value: number) => {},
  winPoints: 0,
  changeWinPoints: (value: number) => {},
  drawPoints: 0,
  changeDrawPoints: (value: number) => {},
  lossPoints: 0,
  changeLossPoints: (value: number) => {},
  tb1: "",
  changeTb1: (value: string) => {},
  tb2: "",
  changeTb2: (value: string) => {},
  tb3: "",
  changeTb3: (value: string) => {},
  tb4: "",
  changeTb4: (value: string) => {},
  fideRated: false,
  changeFideRated: (value: boolean) => {},
  showOnlyUsernames: true,
  changeShowOnlyUsernames: (value: boolean) => {},
  profilePicture: "",
  changeProfilePicture: (value: string) => {},
  bannerPicture: "",
  changeBannerPicture: (value: string) => {},
  organiser: "",
  changeOrganiser: (value: string) => {},
  organiserType: "",
  changeOrganiserType: (value: string) => {},
};

const FormContext: Context<FormContext> = React.createContext(initalValues);

export const FormProvider = FormContext.Provider;
export default FormContext;
export const useForm = () => useContext(FormContext);
