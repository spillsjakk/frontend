import React, {
  Context,
  FunctionComponent,
  useCallback,
  useContext,
  useState,
} from "react";
import { KIND } from "../../constants";

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
  season: string;
  changeSeason: (value: string) => void;
  category: string;
  changeCategory: (value: string) => void;
  chatEnabled: boolean;
  changeChatEnabled: (value: boolean) => void;
  removeInactive: boolean;
  changeRemoveInactive: (value: boolean) => void;
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
  kind: Object.values(KIND)[0],
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
  onlinePairingIntervalT: 1,
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
  showOnlyUsernames: false,
  changeShowOnlyUsernames: (value: boolean) => {},
  profilePicture: "",
  changeProfilePicture: (value: string) => {},
  bannerPicture: "",
  changeBannerPicture: (value: string) => {},
  organiser: "",
  changeOrganiser: (value: string) => {},
  organiserType: "",
  changeOrganiserType: (value: string) => {},
  season: "",
  changeSeason: (value: string) => {},
  category: "",
  changeCategory: (value: string) => {},
  chatEnabled: true,
  changeChatEnabled: (value: boolean) => {},
  removeInactive: true,
  changeRemoveInactive: (value: boolean) => {},
};

const FormContext: Context<FormContext> = React.createContext(initalValues);

export const FormProvider = FormContext.Provider;
export default FormContext;
export const useForm = () => useContext(FormContext);

const WithTournamentForm: FunctionComponent = ({ children }) => {
  const [show, setShow] = useState(false);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [kind, setKind] = useState(Object.values(KIND)[0]);
  const [defaultGameLocation, setDefaultGameLocation] = useState(1);
  const [startDate, setStartDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 10));
  const [publiclyViewable, setPubliclyViewable] = useState(false);
  const [firstPairingTime, setFirstPairingTime] = useState(
    new Date().toISOString().slice(11, 16)
  );
  const [firstPairingDate, setFirstPairingDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [onlinePairingIntervalN, setOnlinePairingIntervalN] = useState(1);
  const [onlinePairingIntervalT, setOnlinePairingIntervalT] = useState(0);
  const [initialTime, setInitialTime] = useState(1);
  const [increment, setIncrement] = useState(0);
  const [selfJoinable, setSelfJoinable] = useState(false);
  const [showOnlyTop, setShowOnlyTop] = useState(false);
  const [showOnlyTopNr, setShowOnlyTopNr] = useState(5);
  const [winPoints, setWinPoints] = useState(1);
  const [drawPoints, setDrawPoints] = useState(0.5);
  const [lossPoints, setLossPoints] = useState(0);
  const [tb1, setTb1] = useState("");
  const [tb2, setTb2] = useState("");
  const [tb3, setTb3] = useState("");
  const [tb4, setTb4] = useState("");
  const [fideRated, setFideRated] = useState(false);
  const [rounds, setRounds] = useState<number>();
  const [perTeam, setPerTeam] = useState<number>();
  const [showOnlyUsernames, setShowOnlyUsernames] = useState<boolean>(false);
  const [profilePicture, setProfilePicture] = useState<string>("");
  const [bannerPicture, setBannerPicture] = useState<string>("");
  const [organiser, setOrganiser] = useState<string>("");
  const [organiserType, setOrganiserType] = useState<string>("");
  const [season, setSeason] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [chatEnabled, setChatEnabled] = useState<boolean>(true);
  const [removeInactive, setRemoveInactive] = useState<boolean>(true);

  const changeShow = useCallback((value: boolean) => {
    setShow(value);
  }, []);

  const changeId = useCallback((value: string) => {
    setId(value);
  }, []);

  const changeName = useCallback((value: string) => {
    setName(value);
  }, []);

  const changeDescription = useCallback((value: string) => {
    setDescription(value);
  }, []);

  const changeKind = useCallback((value: number) => {
    setKind(value);
  }, []);

  const changeDefaultGameLocation = useCallback((value: number) => {
    setDefaultGameLocation(value);
  }, []);

  const changeStartDate = useCallback((value: string) => {
    setStartDate(value);
  }, []);

  const changeEndDate = useCallback((value: string) => {
    setEndDate(value);
  }, []);

  const changePubliclyViewable = useCallback((value: boolean) => {
    setPubliclyViewable(value);
  }, []);

  const changeFirstPairingTime = useCallback((value: string) => {
    setFirstPairingTime(value);
  }, []);

  const changeFirstPairingDate = useCallback((value: string) => {
    setFirstPairingDate(value);
  }, []);

  const changeOnlinePairingIntervalN = useCallback((value: number) => {
    setOnlinePairingIntervalN(value);
  }, []);

  const changeOnlinePairingIntervalT = useCallback((value: number) => {
    setOnlinePairingIntervalT(value);
  }, []);

  const changeInitialTime = useCallback((value: number) => {
    setInitialTime(value);
  }, []);

  const changeIncrement = useCallback((value: number) => {
    setIncrement(value);
  }, []);

  const changeSelfJoinable = useCallback((value: boolean) => {
    setSelfJoinable(value);
  }, []);

  const changeShowOnlyTop = useCallback((value: boolean) => {
    setShowOnlyTop(value);
  }, []);

  const changeShowOnlyTopNr = useCallback((value: number) => {
    setShowOnlyTopNr(value);
  }, []);

  const changeWinPoints = useCallback((value: number) => {
    setWinPoints(value);
  }, []);

  const changeDrawPoints = useCallback((value: number) => {
    setDrawPoints(value);
  }, []);

  const changeLossPoints = useCallback((value: number) => {
    setLossPoints(value);
  }, []);

  const changeFideRated = useCallback((value: boolean) => {
    setFideRated(value);
  }, []);

  const changeTb1 = useCallback((value: string) => {
    setTb1(value);
  }, []);

  const changeTb2 = useCallback((value: string) => {
    setTb2(value);
  }, []);

  const changeTb3 = useCallback((value: string) => {
    setTb3(value);
  }, []);

  const changeTb4 = useCallback((value: string) => {
    setTb4(value);
  }, []);

  const changeRounds = useCallback((value: number) => {
    setRounds(value);
  }, []);

  const changePerTeam = useCallback((value: number) => {
    setPerTeam(value);
  }, []);

  const changeShowOnlyUsernames = useCallback((value: boolean) => {
    setShowOnlyUsernames(value);
  }, []);

  const changeProfilePicture = useCallback((value: string) => {
    setProfilePicture(value);
  }, []);

  const changeBannerPicture = useCallback((value: string) => {
    setBannerPicture(value);
  }, []);

  const changeOrganiser = useCallback((value: string) => {
    setOrganiser(value);
  }, []);

  const changeOrganiserType = useCallback((value: string) => {
    setOrganiserType(value);
  }, []);

  const changeSeason = useCallback((value: string) => {
    setSeason(value);
  }, []);

  const changeCategory = useCallback((value: string) => {
    setCategory(value);
  }, []);

  const changeChatEnabled = useCallback((value: boolean) => {
    setChatEnabled(value);
  }, []);

  const changeRemoveInactive = useCallback((value: boolean) => {
    setRemoveInactive(value);
  }, []);

  return (
    <FormProvider
      value={{
        show,
        changeShow,
        id,
        changeId,
        name,
        changeName,
        description,
        changeDescription,
        kind,
        changeKind,
        defaultGameLocation,
        changeDefaultGameLocation,
        startDate,
        changeStartDate,
        endDate,
        changeEndDate,
        publiclyViewable,
        changePubliclyViewable,
        firstPairingDate,
        changeFirstPairingDate,
        firstPairingTime,
        changeFirstPairingTime,
        onlinePairingIntervalN,
        changeOnlinePairingIntervalN,
        onlinePairingIntervalT,
        changeOnlinePairingIntervalT,
        initialTime,
        changeInitialTime,
        increment,
        changeIncrement,
        selfJoinable,
        changeSelfJoinable,
        showOnlyTop,
        changeShowOnlyTop,
        showOnlyTopNr,
        changeShowOnlyTopNr,
        winPoints,
        changeWinPoints,
        drawPoints,
        changeDrawPoints,
        lossPoints,
        changeLossPoints,
        tb1,
        changeTb1,
        tb2,
        changeTb2,
        tb3,
        changeTb3,
        tb4,
        changeTb4,
        fideRated,
        changeFideRated,
        rounds,
        changeRounds,
        perTeam,
        changePerTeam,
        showOnlyUsernames,
        changeShowOnlyUsernames,
        profilePicture,
        changeProfilePicture,
        bannerPicture,
        changeBannerPicture,
        organiser,
        changeOrganiser,
        organiserType,
        changeOrganiserType,
        season,
        changeSeason,
        category,
        changeCategory,
        chatEnabled,
        changeChatEnabled,
        removeInactive,
        changeRemoveInactive,
      }}
    >
      {children}
    </FormProvider>
  );
};
export { WithTournamentForm };
