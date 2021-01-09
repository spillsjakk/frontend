import React, { FunctionComponent, useState } from "react";
import style from "./style.module.scss";

interface Props {
  onAction: (text: string) => void;
  placeholder: string;
}

const InputAdd: FunctionComponent<Props> = ({ onAction, placeholder }) => {
  const [inputText, setInputText] = useState("");
  function onSearch(e: any) {
    e.preventDefault();
    onAction(inputText);
  }
  return (
    <div className={style["input-add-form"]}>
      <form onSubmit={onSearch}>
        <div className={style.wrapper}>
          <input
            placeholder={placeholder}
            value={inputText}
            type="text"
            onChange={(e) => setInputText(e.target.value)}
          />
          <button type="submit" className="btn">
            <i className="bi-plus"></i>
          </button>
        </div>
      </form>
    </div>
  );
};

export { InputAdd };
