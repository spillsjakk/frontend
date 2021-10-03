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
import { Delete } from "@material-ui/icons";
import { IconButton } from "@material-ui/core";

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

const AccountsWithPowersModal: FunctionComponent<Props> = ({ forClub }) => {
  const [allAccounts, setAllAccounts] = useState<Array<Account> | undefined>();
  const [arbiterAccounts, setArbiterAccounts] = useState<
    Array<Account> | undefined
  >();
  const [editorAccounts, setEditorAccounts] = useState<
    Array<Account> | undefined
  >();

  const organization = useOrganization();
  const club = useClub();

  function fetchAccountsWithPowers() {
    fetchCall(
      `/s/${forClub ? "club" : "organization"}/accounts-with-powers/${
        forClub ? club.id : organization.id
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
  }

  useEffect(() => {
    fetchAccountsWithPowers();
  }, []);

  function deleteClubPower(clubId, packageName, userId) {
    fetchCall(
      `/s/account/power/club/${clubId} `,
      "DELETE",
      {
        power: `club:${packageName}:${clubId}`,
        id: userId,
      },
      () => {
        fetchAccountsWithPowers();
      }
    );
  }
  
  function deleteOrgPower(orgId, packageName, userId) {
    fetchCall(
      `/s/account/power/organization/${orgId} `,
      "DELETE",
      {
        power: `organization:${packageName}:${orgId}`,
        id: userId,
      },
      () => {
        fetchAccountsWithPowers();
      }
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
    {
      dataField: "",
      text: Translated.byKey(""),
      sort: false,
      formatter: function (_: any, row: any) {
        return (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <IconButton aria-label="delete">
              <Delete
                color="action"
                onClick={() => {
                  if (row.forClub) {
                    deleteClubPower(row.entityId, row.packageName, row.id);
                  } else {
                    deleteOrgPower(row.entityId, row.packageName, row.id);
                  }
                }}
              />
            </IconButton>
          </div>
        );
      },
    },
  ];

  return (
    <>
      {Array.isArray(allAccounts) && allAccounts.length > 0 && (
        <>
          <div className={style.header}>
            {Translated.byKey("manageOrg_allPowersPackage")}
          </div>
          <ToolkitProvider
            keyField="username"
            data={allAccounts.map((d) => ({
              ...d,
              entityId: forClub ? club.id : organization.id,
              packageName: "all",
              forClub,
            }))}
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
            data={arbiterAccounts.map((d) => ({
              ...d,
              entityId: forClub ? club.id : organization.id,
              packageName: "arbiter",
              forClub,
            }))}
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
            data={editorAccounts.map((d) => ({
              ...d,
              entityId: forClub ? club.id : organization.id,
              packageName: "editor",
              forClub,
            }))}
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
