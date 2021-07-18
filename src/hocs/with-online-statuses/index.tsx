import React, {
  Context,
  FunctionComponent,
  useState,
  useEffect,
  useContext,
} from "react";
import { fetchCall } from "../../functions";

type OnlineStatus = {
  onlineStatus: Array<{ account: string; online: boolean }>;
};

const OnlineStatusContext: Context<OnlineStatus> = React.createContext({
  onlineStatus: [],
});

export const useOnlineStatus = () => useContext(OnlineStatusContext);

export const WithOnlineStatus: FunctionComponent<{ accounts: Array<string> }> =
  (props) => {
    const [onlineStatus, setOnlineStatus] = useState([]);
    const [requested, setRequested] = useState(false);

    // useEffect ile istek at, response'u onlineStatus'e setle
    useEffect(() => {
      if (
        !requested &&
        Array.isArray(props.accounts) &&
        props.accounts.length > 0
      ) {
        setRequested(true);
        fetchCall(
          "/s/account/online-statuses",
          "POST",
          { accounts: props.accounts },
          (response) => {
            if (Array.isArray(response)) {
              setOnlineStatus(response);
            }
          }
        );
      }
    }, [props.accounts]);

    return (
      <OnlineStatusContext.Provider value={{ onlineStatus }}>
        {props.children}
      </OnlineStatusContext.Provider>
    );
  };
