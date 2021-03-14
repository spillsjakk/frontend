import React, { FunctionComponent, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import Translated from "../../components/translated";
import { fetchJson } from "../../functions";
import { Account } from "../../pages/Tournament/Types";
import style from "./style.module.scss";

interface Props {
  show: boolean;
  hide: () => void;
  success: () => void;
  account?: Account;
}

const ChangePasswordModal: FunctionComponent<Props> = ({
  show,
  hide,
  success,
  account,
}) => {
  const [password, setPassword] = useState("");

  function edit() {
    fetchJson(
      `/s/account/change-password/${account.id}`,
      "POST",
      {
        password,
      },
      () => {
        hide();
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
        onHide={hide}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <Translated str="changePassword" />
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
              <label>{Translated.byKey("newPassword")}: </label>
              <input
                type="text"
                value={password}
                minLength={7}
                onChange={(e) => setPassword(e.target.value)}
                required
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

export { ChangePasswordModal };
