import React, { FunctionComponent, useCallback, useState } from "react";
import { FormProvider } from "../../context/build-tournament-form";

const WithTournamentForm: FunctionComponent = ({ children }) => {
  const [show, setShow] = useState(false);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [kind, setKind] = useState(0);
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
  const [onlinePairingIntervalN, setOnlinePairingIntervalN] = useState(0);
  const [onlinePairingIntervalT, setOnlinePairingIntervalT] = useState(0);
  const [initialTime, setInitialTime] = useState(0);
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
  const [showOnlyUsernames, setShowOnlyUsernames] = useState<boolean>(true);
  const [profilePicture, setProfilePicture] = useState<string>("");
  const [bannerPicture, setBannerPicture] = useState<string>("");
  const [organiser, setOrganiser] = useState<string>("");
  const [organiserType, setOrganiserType] = useState<string>("");
  const [season, setSeason] = useState<string>("");
  const [category, setCategory] = useState<string>("");

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
      }}
    >
      {children}
    </FormProvider>
  );
};
export { WithTournamentForm };
