import React, { FunctionComponent } from "react";
import style from "./style.module.scss";

interface Props {
  content: any;
  actionName?: string;
  onAction?: () => void;
}

const SummaryCard: FunctionComponent<Props> = ({
  content,
  actionName,
  onAction,
}) => {
  return (
    <div className={style["card-container"]}>
      <div className={style.content}>{content}</div>
      {actionName && onAction && (
        <div className={style.action}>
          <button onClick={onAction}>{actionName}</button>
        </div>
      )}
    </div>
  );
};

export { SummaryCard };
