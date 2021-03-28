import React, { FunctionComponent, useEffect, useState } from "react";
import Translated from "../translated";
import { fetchCall } from "../../functions";
import { Account } from "../../pages/Tournament/Types";
import style from "./style.module.scss";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import paginationFactory from "react-bootstrap-table2-paginator";
import BootstrapTable from "react-bootstrap-table-next";
import { Link } from "react-router-dom";
import { useOrganization } from "../../context/organization";
import { useClub } from "../../context/club";

interface Props {
  forClub?: boolean;
}

function getUserLink(text: string, id: string) {
  return (
    <Link to={"/profile/" + id}>
      <span
        className="d-inline-block text-truncate"
        style={{ maxWidth: "80px" }}
      >
        {text}
      </span>
    </Link>
  );
}

const columns = [
  {
    dataField: "first_name",
    text: Translated.byKey("firstName"),
    sort: true,
    formatter: function (_: any, row: Account, __: any, ___: any) {
      return getUserLink(row.first_name, row.id);
    },
  },
  {
    dataField: "last_name",
    text: Translated.byKey("lastName"),
    sort: true,
    formatter: function (_: any, row: Account, __: any, ___: any) {
      return getUserLink(row.last_name, row.id);
    },
  },
  {
    dataField: "username",
    text: Translated.byKey("username"),
    sort: true,
    formatter: function (_: any, row: Account, __: any, ___: any) {
      return getUserLink(row.username, row.id);
    },
  },
  {
    dataField: "fide_number",
    text: Translated.byKey("fideNumber"),
    sort: true,
  },
  {
    dataField: "fide_rating",
    text: Translated.byKey("fideRating"),
    sort: true,
  },
  { dataField: "title", text: Translated.byKey("title"), sort: true },
  {
    dataField: "fide_federation",
    text: Translated.byKey("federation"),
    sort: true,
  },
  {
    dataField: "birth_date",
    text: Translated.byKey("birthDate"),
    sort: true,
  },
  { dataField: "sex", text: Translated.byKey("sex"), sort: true },
];

const AccountsWithPowersModal: FunctionComponent<Props> = ({ forClub }) => {
  const [allAccounts, setAllAccounts] = useState<Array<Account> | undefined>();
  const [arbiterAccounts, setArbiterAccounts] = useState<
    Array<Account> | undefined
  >();
  const [editorAccounts, setEditorAccounts] = useState<
    Array<Account> | undefined
  >();

  const orgaanization = useOrganization();
  const club = useClub();

  useEffect(() => {
    fetchCall(
      `/s/${forClub ? "club" : "organization"}/accounts-with-powers/${
        forClub ? club.id : orgaanization.id
      }`,
      "GET",
      undefined,
      (result) => {
        if (result) {
          setAllAccounts(result.all);
          setArbiterAccounts(result.arbiter);
          setEditorAccounts(result.editor);
        }
      }
    );
  }, []);
  return (
    <>
      {Array.isArray(allAccounts) && allAccounts.length > 0 && (
        <>
          <div className={style.header}>
            {Translated.byKey("manageOrg_allPowersPackage")}
          </div>
          <ToolkitProvider
            keyField="username"
            data={allAccounts}
            columns={columns}
            bootstrap4={true}
            search={true}
          >
            {(props) => (
              <>
                <Search.SearchBar {...props.searchProps} />
                <BootstrapTable
                  {...props.baseProps}
                  pagination={paginationFactory({})}
                />
              </>
            )}
          </ToolkitProvider>
        </>
      )}
      {Array.isArray(arbiterAccounts) && arbiterAccounts.length > 0 && (
        <>
          <div className={style.header}>
            {Translated.byKey("manageOrg_arbiterPowersPackage")}
          </div>
          <ToolkitProvider
            keyField="username"
            data={arbiterAccounts}
            columns={columns}
            bootstrap4={true}
            search={true}
          >
            {(props) => (
              <>
                <Search.SearchBar {...props.searchProps} />
                <BootstrapTable
                  {...props.baseProps}
                  pagination={paginationFactory({})}
                />
              </>
            )}
          </ToolkitProvider>
        </>
      )}
      {Array.isArray(editorAccounts) && editorAccounts.length > 0 && (
        <>
          <div className={style.header}>
            {Translated.byKey("manageOrg_editorPowersPackage")}
          </div>
          <ToolkitProvider
            keyField="username"
            data={editorAccounts}
            columns={columns}
            bootstrap4={true}
            search={true}
          >
            {(props) => (
              <>
                <Search.SearchBar {...props.searchProps} />
                <BootstrapTable
                  {...props.baseProps}
                  pagination={paginationFactory({})}
                />
              </>
            )}
          </ToolkitProvider>
        </>
      )}
    </>
  );
};

export { AccountsWithPowersModal };
