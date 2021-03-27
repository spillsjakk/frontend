import React, { FunctionComponent, useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import Translated from "../../components/translated";
import { fetchJson } from "../../functions";
import { Account } from "../../pages/Tournament/Types";
import TitleDropdown from "../TitleDropdown";
import style from "./style.module.scss";

interface Props {
  show: boolean;
  hide: () => void;
  success: () => void;
  account?: Account;
}

const EditAccountModal: FunctionComponent<Props> = ({
  show,
  hide,
  success,
  account,
}) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [fideNumber, setFideNumber] = useState<number | undefined>();
  const [fideRating, setFideRating] = useState<number | undefined>();
  const [title, setTitle] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [email, setEmail] = useState("");

  function resetInputs() {
    setFirstName("");
    setLastName("");
    setUsername("");
    setFideNumber(undefined);
    setFideRating(undefined);
    setTitle("");
    setBirthDate("");
    setEmail("");
  }

  function close() {
    resetInputs();
    hide();
  }

  useEffect(() => {
    if (account) {
      setUsername(account.username);
      setFirstName(account.first_name);
      setLastName(account.last_name);
      setFideNumber(account.fide_number);
      setFideRating(account.fide_rating);
      setTitle(account.title);
      setBirthDate(account.birth_date);
      setEmail(account.email);
    }
  }, [account]);

  function edit() {
    fetchJson(
      `/s/account/edit/${account.id}`,
      "POST",
      {
        username,
        first_name: firstName,
        last_name: lastName,
        fide_number: fideNumber,
        title,
        fide_rating: fideRating,
        birth_date: birthDate,
        email,
      },
      () => {
        close();
        success();
      }
    );
  }

  return (
    <>
      <Modal
        backdropClassName={style.backdrop}
        className={style.dialog}
        show={show}
        onHide={close}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <Translated str="editAccount" />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              edit();
            }}
          >
            <div className={style.row}>
              <label>{Translated.byKey("username")}: </label>
              <input
                type="text"
                pattern="^[a-zA-Z0-9-_]+$"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className={style.row}>
              <label>{Translated.byKey("firstName")}: </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className={style.row}>
              <label>{Translated.byKey("lastName")}: </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <div className={style.row}>
              <label>{Translated.byKey("fideNumber")}: </label>
              <input
                type="number"
                value={fideNumber}
                onChange={(e) => setFideNumber(Number(e.target.value))}
              />
            </div>
            <div className={style.row}>
              <label>{Translated.byKey("fideRating")}: </label>
              <input
                type="number"
                value={fideRating}
                onChange={(e) => setFideRating(Number(e.target.value))}
              />
            </div>
            <div className={style.row}>
              <label>{Translated.byKey("birthDate")}: </label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                required
              />
            </div>
            <div className={style.row}>
              <label>{Translated.byKey("email")}: </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className={style.row}>
              <label>{Translated.byKey("title")}: </label>
              <TitleDropdown
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className={style.row}>
              <Button className={style.edit} type="submit" variant="primary">
                {Translated.byKey("edit")}
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export { EditAccountModal };
