import React, { FunctionComponent } from "react";
import xssFilters from "xss-filters";
import { Col, Row } from "react-bootstrap";
import Translated from "../../../components/translated";

import style from "./style.module.scss";
import { useLeague } from "../../../hocs/with-league/index";

const Description: FunctionComponent<{}> = () => {
  const { league } = useLeague();

  return (
    <div className={style["description-container"]}>
      <Row style={{ width: "100%", margin: "0px" }}>
        <Col xs={12} md={8}>
          <div className={style.about}>
            <div className={style.heading}>
              {Translated.byKey("about").toUpperCase()}:
            </div>
            <div
              dangerouslySetInnerHTML={{
                __html: xssFilters.inHTMLData(league?.description || ""),
              }}
            ></div>
          </div>
        </Col>
      </Row>
    </div>
  );
};
export { Description };
