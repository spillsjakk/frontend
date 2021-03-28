import React, { FunctionComponent } from "react";
import style from "./style.module.scss";

interface Props {
  content: any;
  actionName?: string;
  secondActionName?: string;
  onSecondAction?: () => void;
  onAction?: () => void;
}

const SummaryCard: FunctionComponent<Props> = ({
  content,
  actionName,
  secondActionName,
  onAction,
  onSecondAction,
}) => {
  return (
    <div className={style["card-container"]}>
      <div className={style.content}>{content}</div>
      <div className={style.actions}>
        {actionName && onAction && (
          <div className={style.action}>
            <button onClick={onAction}>{actionName}</button>
          </div>
        )}
        {secondActionName && onSecondAction && (
          <div className={style.action}>
            <button onClick={onSecondAction}>{secondActionName}</button>
          </div>
        )}
      </div>
    </div>
  );
};

export { SummaryCard };
