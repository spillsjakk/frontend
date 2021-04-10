import React, { FunctionComponent, useEffect } from "react";
import { Helmet } from "react-helmet";
import { title } from "../../../functions";
import { WithLeagueForm } from "../../../hocs/league-form";
import { WithUserOrgsClubs } from "../../../hocs/user-orgs-and-clubs";
import { BuildLeagueContainer } from "../../../containers/build-league";
import "./style.scss";

type Props = {};

const BuildLeague: FunctionComponent<Props> = () => {
  useEffect(() => {
    document.getElementsByTagName("body")[0].id = "league-build";
  }, []);
  return (
    <main>
      <Helmet>
        <title>{title("buildLeague")}</title>
      </Helmet>
      <WithLeagueForm>
        <WithUserOrgsClubs>
          <BuildLeagueContainer />
        </WithUserOrgsClubs>
      </WithLeagueForm>
    </main>
  );
};
export { BuildLeague };
