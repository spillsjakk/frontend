import React, { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import Translated from "../../../../components/translated";
import { useUserRegistration } from "../../../../context/registration";
import { fetchCall } from "../../../../functions";
import style from "./style.module.scss";

const FideInfo: FunctionComponent<{ onNext: () => void }> = ({ onNext }) => {
  const { changeUser, changeFideId, user } = useUserRegistration();
  function fideAutocomplete() {
    fetchCall(
      `/s/account/fide-autocomplete/${user.fideId}`,
      "GET",
      undefined,
      (json: any) => {
        if (json) {
          changeUser({
            firstName: json.first_name,
            lastName: json.last_name,
            country: json.federation,
            birthDate: json.birth_year
              ? json.birth_year.toString() + "-01-01"
              : "",
            gender: json.sex,
            rating: json.rating,
            title: json.title,
          });
        }
      },
      (e: any) => {
        console.error("error while fetching fide info", e);
      }
    );
  }
  return (
    <div className={style["fide-info"]}>
      <div className="bold">{Translated.byKey("fideInfoText")}</div>
      <div className={style["fide-input"]}>
        <input
          type="number"
          onChange={(e) => changeFideId(Number(e.target.value))}
        />
      </div>
      <div className={style.link}>
        <Link
          to="https://en.wikipedia.org/wiki/Chess_rating_system"
          rel="noreferrer"
          target="_blank"
        >
          {Translated.byKey("whatIsFide")}
        </Link>
      </div>
      <div className={style.link}>
        <Link
          to="https://ratings.fide.com/advseek.phtml"
          rel="noreferrer"
          target="_blank"
        >
          {Translated.byKey("findoutFide")}
        </Link>
      </div>
      <div className={style.link}>
        <Link to="">{Translated.byKey("whyFide")}</Link>
      </div>
      <button
        className="action-button"
        onClick={() => {
          fideAutocomplete();
          onNext();
        }}
      >
        {Translated.byKey("next").toUpperCase()}
      </button>
    </div>
  );
};

export { FideInfo };
