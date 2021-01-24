import React, { Component } from "react";
import { Helmet } from "react-helmet";
import Translated from "../../components/translated";
import { title, fetchJson } from "../../functions";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import { RouteComponentProps, Link } from "react-router-dom";
import { Account } from "../Tournament/Types";
const { SearchBar } = Search;

type AllAccountsProps = {
  oid: string;
};

type AllAccountsState = {
  accountData: Account[];
  accountColumns: any[];
};

interface Props extends RouteComponentProps<AllAccountsProps> {
  popup?: boolean;
  forClubs?: boolean;
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

class AllAccounts extends Component<Props, AllAccountsState> {
  constructor(props: RouteComponentProps<AllAccountsProps>) {
    super(props);

    this.state = {
      accountData: [],
      accountColumns: [
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
      ],
    };
  }

  componentDidMount() {
    if (!this.props.popup) {
      document.getElementsByTagName("body")[0].id = "Organization-AllAccounts";
    }

    fetchJson(
      this.props.forClubs
        ? `/s/club/members/${this.props.match.params.oid}`
        : `/s/organization/all-accounts/${this.props.match.params.oid}`,
      "GET",
      undefined,
      (accountData) => {
        if (Array.isArray(accountData)) {
          if (this.props.forClubs) {
            accountData = accountData.map((account) => ({
              ...account,
              id: account.account_id,
            }));
          }
          this.setState({ accountData });
        }
      }
    );
  }

  render() {
    return (
      <>
        {!this.props.popup && (
          <Helmet>
            <title>{title("accountList")}</title>
          </Helmet>
        )}

        <ToolkitProvider
          keyField="id"
          data={this.state.accountData}
          columns={this.state.accountColumns}
          bootstrap4={true}
          search={true}
        >
          {(props) => (
            <>
              <SearchBar {...props.searchProps} />
              <BootstrapTable
                {...props.baseProps}
                pagination={paginationFactory({})}
              />
            </>
          )}
        </ToolkitProvider>
      </>
    );
  }
}

export default AllAccounts;
