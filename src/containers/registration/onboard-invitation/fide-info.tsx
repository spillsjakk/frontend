import React, { FunctionComponent } from "react";
import Translated from "../../../components/translated";
import style from "./style.module.scss";

const FideInfo: FunctionComponent<{ onNext: () => void }> = ({ onNext }) => {
  return (
    <div className={style["fide-info"]}>
      <div className="bold">{Translated.byKey("fideInfoText")}</div>
      <div className={style["fide-input"]}>
        <input />
      </div>
      <div className={style.link}>
        <a
          href="https://en.wikipedia.org/wiki/Chess_rating_system"
          rel="noreferrer"
          target="_blank"
        >
          {Translated.byKey("whatIsFide")}
        </a>
      </div>
      <div className={style.link}>
        <a
          href="https://ratings.fide.com/advseek.phtml"
          rel="noreferrer"
          target="_blank"
        >
          {Translated.byKey("findoutFide")}
        </a>
      </div>
      <div className={style.link}>
        <a href="">{Translated.byKey("whyFide")}</a>
      </div>
      <button className="action-button" onClick={onNext}>
        {Translated.byKey("next").toUpperCase()}
      </button>
    </div>
  );
};

export { FideInfo };
