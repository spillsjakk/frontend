import React, { FunctionComponent, useEffect } from "react";
import { Helmet } from "react-helmet";
import { title } from "../../../functions";
import { WithUserOrgsClubs } from "../../../hocs/user-orgs-and-clubs";
import { Form } from "./form";
import "./style.scss";
import { WithLeagueForm } from "./with-form";

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
          <Form />
        </WithUserOrgsClubs>
      </WithLeagueForm>
    </main>
  );
};

export { BuildLeague };
