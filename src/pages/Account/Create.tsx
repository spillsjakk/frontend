import React, {
  FormEvent,
  useState,
  useEffect,
  FunctionComponent,
} from "react";
import { Helmet } from "react-helmet";
import Translated from "../../components/translated";
import { useUser } from "../../components/UserContext";
import UserLink from "../../components/UserLink";
import { fetchJson, title as titleFn } from "../../functions";
import "./Create.css";
import { NativeSelect, TextField, Grid, Button } from "@material-ui/core";
import { HelpBox, helpboxNames } from "../../components/help-box";
import style from "./style.module.scss";

import {
  useOrgsClubs,
  WithUserOrgsClubs,
} from "../../hocs/user-orgs-and-clubs";
import { MuiFederationDropdown } from "../../components/FederationDropdown";
import { MuiTitleDropdown } from "../../components/TitleDropdown";
import { MuiSexDropdown } from "../../components/SexDropdown";
import {
  DataGrid,
  GridColDef,
} from "@mui/x-data-grid";

function Required() {
  return <span style={{ color: "red" }}>(required)</span>
}
function SelectClubs(props: {
  value: string;
  onChange: (value: string) => void;
}) {
  const { clubs } = useOrgsClubs();
  return (
    <div className={style.select}>
      <div className={style.inputs}>
        <NativeSelect
          onChange={(e) => {
            const value = e.target.value;
            props.onChange(value);
          }}
          value={props.value}
          required
        >
          <option value="" disabled>
            {Translated.byKey("selectClub")}
          </option>
          <option value="n/a">N/A</option>
          {Array.isArray(clubs) &&
            clubs.map((club) => (
              <option key={club.id} value={club.id}>
                {club.name}
              </option>
            ))}
        </NativeSelect>
      </div>
    </div>
  );
}


const Create: FunctionComponent<{}> = () => {
  const [username, setUserName] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [fide_number, setFideNumber] = useState("");
  const [title, setTitle] = useState("");
  const [fide_rating, setFideRating] = useState("");
  const [fide_federation, setFideFederation] = useState("NOR");
  const [birth_date, setBirthDate] = useState("");
  const [sex, setSex] = useState("M");
  const [email, setEmail] = useState("");
  const [level, setLevel] = useState("0");
  const [accounts, setAccounts] = useState([]);
  const [passwords, setPasswords] = useState([]);
  const [passwordCsv, setPasswordCsv] = useState(
    "data:text/plain;charset=utf-8,"
  );
  const [selectedClub, setSelectedClub] = useState("");
  const { user } = useUser();

  const commonFields = {
    headerClassName: style["table-header"],
    cellClassName: style["table-cell"],
  };

  const accountsColumns: GridColDef[] = [
    {
      field: "username",
      headerName: Translated.byKey("username"),
      hideSortIcons: true,
      align: "center",
      headerAlign: "center",
      minWidth: 140,
      flex: 1,
      ...commonFields,
    },
    {
      field: "first_name",
      headerName: Translated.byKey("firstName"),
      hideSortIcons: true,
      align: "center",
      headerAlign: "center",
      width: 140,
      ...commonFields,
    },
    {
      field: "last_name",
      headerName: Translated.byKey("lastName"),
      hideSortIcons: true,
      align: "center",
      headerAlign: "center",
      width: 140,
      ...commonFields,
    },
    {
      field: "fide_number",
      headerName: Translated.byKey("fideNumber"),
      hideSortIcons: true,
      align: "center",
      headerAlign: "center",
      width: 140,
      ...commonFields,
    },
    {
      field: "title",
      headerName: Translated.byKey("title"),
      hideSortIcons: true,
      align: "center",
      headerAlign: "center",
      width: 140,
      ...commonFields,
    },
    {
      field: "fide_rating",
      headerName: Translated.byKey("fideRating"),
      hideSortIcons: true,
      align: "center",
      headerAlign: "center",
      width: 140,
      ...commonFields,
    },
    {
      field: "fide_federation",
      headerName: Translated.byKey("fideFederation"),
      hideSortIcons: true,
      align: "center",
      headerAlign: "center",
      width: 140,
      ...commonFields,
    },
    {
      field: "birth_date",
      headerName: Translated.byKey("birthDate"),
      hideSortIcons: true,
      align: "center",
      headerAlign: "center",
      width: 140,
      ...commonFields,
    },
    {
      field: "sex",
      headerName: Translated.byKey("sex"),
      hideSortIcons: true,
      align: "center",
      headerAlign: "center",
      width: 140,
      ...commonFields,
    },
    {
      field: "email",
      headerName: Translated.byKey("email"),
      hideSortIcons: true,
      align: "center",
      headerAlign: "center",
      width: 140,
      ...commonFields,
    },
    {
      field: "level",
      headerName: Translated.byKey("level"),
      hideSortIcons: true,
      align: "center",
      headerAlign: "center",
      width: 140,
      ...commonFields,
    },
  ];

  function fideNumberBlur() {
    if (isNaN(parseInt(fide_number as string, 10))) {
      return;
    }

    fetchJson(
      `/s/account/fide-autocomplete/${fide_number}`,
      "GET",
      undefined,
      (json) => {
        if (json.first_name) {
          setFirstName(json.first_name);
        }
        if (json.last_name) {
          setLastName(json.last_name);
        }
        if (json.title) {
          setTitle(json.title);
        }
        if (json.rating) {
          setFideRating(json.rating);
        }
        if (json.fide_federation) {
          setFideFederation(json.fide_federation);
        }
        if (json.birth_year) {
          setBirthDate(json.birth_year.toString() + "-01-01");
        }
        if (json.sex) {
          setSex(json.sex);
        }
      }
    );
  }
  function addNewAcc(e: FormEvent) {
    e.preventDefault();

    const data: any = {
      username: username,
      first_name: first_name,
      last_name: last_name,
      fide_number: parseInt(fide_number, 10) || undefined,
      title: title || undefined,
      fide_rating: parseInt(fide_rating, 10) || undefined,
      fide_federation: fide_federation || undefined,
      birth_date: birth_date || undefined,
      sex: sex || undefined,
      email: email || undefined,
      level: parseInt(level, 10) || 0,
      ghost: false,
    };

    if (selectedClub && selectedClub !== "n/a") {
      data.club = selectedClub;
    }
    fetchJson(`/s/account/create`, "POST", data, (result) => {
      result.level = data.level;
      setUserName("");
      setFirstName("");
      setLastName("");
      setTitle("");
      setFideRating("");
      setFideFederation("NOR");
      setBirthDate("");
      setSex("M");
      setEmail("");
      setAccounts(accounts.concat([result]));
      setPasswords(passwords.concat([[result.username, result.password]]));
      setPasswordCsv(
        passwordCsv + encodeURIComponent(`${result.id},${result.password}\n`)
      );
      setSelectedClub("");
    });
  }
  useEffect(() => {
    document.getElementsByTagName("body")[0].id = "Account-Create";
  }, []);

  const accountData = accounts.map((account, i) => {
    return {
      username: account.username,
      firstName: account.first_name,
      lastName: account.last_name,
      fideNumber: account.fide_number,
      title: account.title,
      fideRating: account.fide_rating,
      fideFederation: account.fide_federation,
      birthDate:account.birth_date,
      sex:account.sex,
      email:account.email,
      level:account.level,
    }
  })

  return (
    <>
      <Helmet>
        <title>{titleFn("createAccounts")}</title>
      </Helmet>

      <div className="header">
        <Translated str="createAccounts" />
      </div>
      <form onSubmit={addNewAcc}>
        <Grid container spacing={3} item justifyContent="center">
          <Grid item xs={12} lg={4} md={12}>
            <TextField
              label={Translated.byKey("username")}
              id="username"
              name="username"
              inputProps={{ pattern: "^[a-zA-Z0-9-_]+$" }}
              fullWidth
              variant="outlined"
              type="text"
              required
              value={username}
              onChange={(e) => setUserName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} lg={4} md={12}>
            <TextField
              label={Translated.byKey("firstName")}
              type="text"
              id="firstNameInput"
              name="first_name"
              value={first_name}
              onChange={(e) => setFirstName(e.target.value)}
              fullWidth
              variant="outlined"
              required
            />
          </Grid>
          <Grid item xs={12} lg={4} md={12}>
            <TextField
              label={Translated.byKey("lastName")}
              type="text"
              id="lastNameInput"
              name="last_name"
              value={last_name}
              onChange={(e) => setLastName(e.target.value)}
              fullWidth
              variant="outlined"
              required
            />
          </Grid>
          <Grid item xs={12} lg={4} md={12}>
            <TextField
              label={Translated.byKey("email")}
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} lg={4} md={12}>
            <TextField
              label={Translated.byKey("fideNumber")}
              type="number"
              id="fideNumberInput"
              name="fide_number"
              value={fide_number}
              onChange={(e) => setFideNumber(e.target.value)}
              onBlur={fideNumberBlur}
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} lg={4} md={12}>
            <HelpBox
              placement="bottom"
              name={helpboxNames.createAccountsInputs}
              text={Translated.byKey("createAccountsInputsHelpbox")}
              show={true}
            >
              <td>
                <TextField
                  label={Translated.byKey("fideRating")}
                  type="number"
                  id="fideRatingInput"
                  name="fide_rating"
                  value={fide_rating}
                  onChange={(e) => setFideRating(e.target.value)}
                  fullWidth
                />
              </td>
            </HelpBox>
          </Grid>
          <Grid item xs={12} lg={3} md={12}>
            <MuiFederationDropdown
              id="fideFederationInput"
              name="fide_federation"
              value={fide_federation}
              onChange={(e) => setFideFederation(e.target.value)} />
          </Grid>
          <Grid item xs={12} lg={9} md={12}>
            <MuiTitleDropdown
              id="titleInput"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)} />
          </Grid>
          <Grid item xs={12} lg={3} md={12}>
            <NativeSelect
              id="level"
              name="level"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            >
              <option value="0">Player</option>
              {(user.info?.level || 0) > 1 && (
                <>
                  <option value="1">Club Manager</option>
                  {(user.info?.level || 0) > 2 && (
                    <option value="2">Org Manager</option>
                  )}
                </>
              )}
            </NativeSelect>
          </Grid>
          <Grid item xs={12} lg={9} md={12}>
            <MuiSexDropdown
              id="sexInput"
              name="sex"
              value={sex}
              onChange={(e) => setSex(e.target.value)} />
          </Grid>
          <Grid item xs={12} lg={3} md={12}>
            <WithUserOrgsClubs>
              <SelectClubs
                value={selectedClub}
                onChange={(value: string) => setSelectedClub(value)}
              />
            </WithUserOrgsClubs>
          </Grid>
          <Grid item xs={12} lg={9} md={12}>
            <input
              type="date"
              id="birthDateInput"
              name="birth_date"
              value={birth_date}
              onChange={(e) => setBirthDate(e.target.value)}
            />
          </Grid>
        </Grid>
        <br/>
        <HelpBox
          placement="bottom"
          name={helpboxNames.createAccountsAction}
          text={Translated.byKey("createAccountsActionHelpbox")}
          show={true}
        >
          <Button
            id="addButton"
            variant="contained"
            color="primary"
            type="submit"
          >
            Create Account
          </Button>
        </HelpBox>
      </form>
      <form onSubmit={addNewAcc}>
        {/* <table className="table">
          <thead>
          </thead>
          <tbody>
            {accounts.map((account, i) => (
              <tr key={i}>
                <td>
                  <UserLink
                    id={account.id}
                    name={account.username}
                    ghost={false}
                  />
                </td>
                <td>
                  <UserLink
                    id={account.id}
                    name={account.first_name}
                    ghost={false}
                  />
                </td>
                <td>
                  <UserLink
                    id={account.id}
                    name={account.last_name}
                    ghost={false}
                  />
                </td>
                <td>{account.fide_number}</td>
                <td>{account.title}</td>
                <td>{account.fide_rating}</td>
                <td>{account.fide_federation}</td>
                <td>{account.birth_date}</td>
                <td>{account.sex}</td>
                <td>{account.email}</td>
                <td>{account.level}</td>
              </tr>
            ))}
          
          </tbody>
        </table> */}
        <br/>
        <DataGrid
          autoHeight
          rows={accountData}
          columns={accountsColumns}
        />
      </form>

      <h3 className="mt-5">
        <Translated str="passwords" />
      </h3>
      <p>
        <Translated str="thisIsTheOnlyTimeYouSeeThesePasswords" />
      </p>
      <p>
        <a href={passwordCsv} download="accounts.csv" id="csvDownloadLink">
          <Translated str="downloadAsCsv" />
        </a>
      </p>
      <div>
        {passwords.map((up, i) => (
          <p key={i}>
            {up[0]}: <code>{up[1]}</code>
          </p>
        ))}
      </div>
    </>
  );
};

export default Create;
