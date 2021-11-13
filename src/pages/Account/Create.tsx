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
import FederationDropdown from "../../components/FederationDropdown";
import TitleDropdown from "../../components/TitleDropdown";
import { NativeSelect } from "@material-ui/core";
import SexDropdown from "../../components/SexDropdown";
import { HelpBox, helpboxNames } from "../../components/help-box";
import style from "./style.module.scss"
import { useOrgsClubs, WithUserOrgsClubs } from "../../hocs/user-orgs-and-clubs";

function Required() {
  return <span style={{ color: "red" }}>(required)</span>;
}

function SelectClubs(props: {value: string; onChange: (value: string) => void}) {
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

    const data = {
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
      club:selectedClub
    };
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

  return (
    <>
      <Helmet>
        <title>{titleFn("createAccounts")}</title>
      </Helmet>

      <div className="header">
        <Translated str="createAccounts" />
      </div>

      <form onSubmit={addNewAcc}>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">
                <Translated str="username" />
                <Required />
              </th>
              <th scope="col">
                <Translated str="firstName" />
                <Required />
              </th>
              <th scope="col">
                <Translated str="lastName" />
                <Required />
              </th>
              <th scope="col">
                <Translated str="fideNumber" />
              </th>
              <th scope="col">
                <Translated str="title" />
              </th>
              <th scope="col">
                <Translated str="fideRating" />
              </th>
              <th scope="col">
                <Translated str="fideFederation" />
              </th>
              <th scope="col">
                <Translated str="birthDate" />
                <Required />
              </th>
              <th scope="col">
                <Translated str="sex" />
              </th>
              <th scope="col">
                <Translated str="email" />
              </th>
              <th scope="col">
                <Translated str="permissions" />
              </th>
              <th scope="col">
                <Translated str="selectClub" />
                <Required />
              </th>
              <th scope="col"></th>
            </tr>
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
            <tr>
              <td>
                <input
                  type="text"
                  id="username"
                  name="username"
                  pattern="^[a-zA-Z0-9-_]+$"
                  value={username}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                />
              </td>
              <td>
                <input
                  type="text"
                  id="firstNameInput"
                  name="first_name"
                  value={first_name}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </td>
              <td>
                <input
                  type="text"
                  id="lastNameInput"
                  name="last_name"
                  value={last_name}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </td>
              <td>
                <input
                  type="number"
                  id="fideNumberInput"
                  name="fide_number"
                  value={fide_number}
                  onChange={(e) => setFideNumber(e.target.value)}
                  onBlur={fideNumberBlur}
                />
              </td>
              <td>
                <TitleDropdown
                  id="titleInput"
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </td>
              <HelpBox
                placement="bottom"
                name={helpboxNames.createAccountsInputs}
                text={Translated.byKey("createAccountsInputsHelpbox")}
                show={true}
              >
                <td>
                  <input
                    type="number"
                    id="fideRatingInput"
                    name="fide_rating"
                    value={fide_rating}
                    onChange={(e) => setFideRating(e.target.value)}
                  />
                </td>
              </HelpBox>

              <td>
                <FederationDropdown
                  id="fideFederationInput"
                  name="fide_federation"
                  value={fide_federation}
                  onChange={(e) => setFideFederation(e.target.value)}
                />
              </td>
              <td>
                <input
                  type="date"
                  id="birthDateInput"
                  name="birth_date"
                  value={birth_date}
                  onChange={(e) => setBirthDate(e.target.value)}
                  required
                />
              </td>
              <td>
                <SexDropdown
                  id="sexInput"
                  name="sex"
                  value={sex}
                  onChange={(e) => setSex(e.target.value)}
                />
              </td>
              <td>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </td>
              <td>
                <select
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
                </select>
              </td>
              <td>
                <WithUserOrgsClubs>
                  <SelectClubs value={selectedClub} onChange={(value: string) => setSelectedClub(value)} />
                </WithUserOrgsClubs>
              </td>
              <td>
                <HelpBox
                  placement="bottom"
                  name={helpboxNames.createAccountsAction}
                  text={Translated.byKey("createAccountsActionHelpbox")}
                  show={true}
                >
                  <button
                    type="submit"
                    className="btn btn-primary"
                    id="addButton"
                  >
                    +
                  </button>
                </HelpBox>
              </td>
            </tr>
          </tbody>
        </table>
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
