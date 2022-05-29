import React, { FunctionComponent, useEffect } from "react";
import { Helmet } from "react-helmet";
import { ListTournaments as Container } from "./container";
import { title } from "../../../functions";
import { WithAllTournaments } from "../../../hocs/with-all-tournaments";

const ListTournaments: FunctionComponent<{}> = () => {
  useEffect(() => {
    document.getElementsByTagName("body")[0].id = "Tournament-Build";
  }, []);
  return (
    <main>
      <Helmet>
        <title>{title("allTournaments")}</title>
      </Helmet>
      <WithAllTournaments>
        <Container />
      </WithAllTournaments>
    </main>
  );
};
export { ListTournaments };
