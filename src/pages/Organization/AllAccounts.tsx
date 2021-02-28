import React, { Component } from "react";
import { Helmet } from "react-helmet";
import Translated from "../../components/translated";
import { title, fetchJson } from "../../functions";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import { RouteComponentProps, Link } from "react-router-dom";
import { Account } from "../Tournament/Types";
import { EditAccountModal } from "../../components/edit-account-modal";
import { Button } from "react-bootstrap";
const { SearchBar } = Search;

type AllAccountsProps = {
  oid: string;
};

type AllAccountsState = {
  accountData: Account[];
  accountColumns: any[];
  showEditModal: boolean;
  accountToEdit?: Account;
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
        {
          text: "",
          formatter: function (_: any, row: Account, __: any, ___: any) {
            return (
              <>
                <Button onClick={() => (row as any).edit(row)}>
                  {Translated.byKey("edit")}
                </Button>
                {(row as any).forClubs && (
                  <Button
                    style={{ marginTop: "10px" }}
                    variant="danger"
                    onClick={() => (row as any).remove(row.id)}
                  >
                    {Translated.byKey("remove")}
                  </Button>
                )}
              </>
            );
          },
        },
      ],
      showEditModal: false,
    };
  }

  fetchUserData() {
    fetchJson(
      this.props.forClubs
        ? `/s/club/all-accounts/${this.props.match.params.oid}`
        : `/s/organization/all-accounts/${this.props.match.params.oid}`,
      "GET",
      undefined,
      (accountData) => {
        if (Array.isArray(accountData)) {
          this.setState({ accountData });
        }
      }
    );
  }

  componentDidMount() {
    if (!this.props.popup) {
      document.getElementsByTagName("body")[0].id = "Organization-AllAccounts";
    }

    this.fetchUserData();
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
          keyField="username"
          data={this.state.accountData.map((data) => ({
            ...data,
            edit: (account: Account) => {
              this.setState({ showEditModal: true, accountToEdit: account });
            },
            remove: (id: string) => {
              if (window.confirm(Translated.byKey("confirmRemoveUser"))) {
                fetchJson(
                  `/s/club/remove-member/${this.props.match.params.oid}/${id}`,
                  "POST",
                  { id: id },
                  () => {
                    this.fetchUserData();
                  }
                );
              }
            },
            forClubs: this.props.forClubs,
          }))}
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
        <EditAccountModal
          show={this.state.showEditModal}
          account={this.state.accountToEdit}
          hide={() => this.setState({ showEditModal: false })}
          success={() => this.fetchUserData()}
        />
      </>
    );
  }
}

export default AllAccounts;
