import React, { FunctionComponent, useEffect } from "react";
import { useLang } from "../../../components/LangContext";
import { getDictionary } from "./translations";
import "./style.scss";

const PrivacyNotice: FunctionComponent<{}> = () => {
  const { lang } = useLang();
  const { getString } = getDictionary(lang);

  function getTitle(key: string) {
    return <h1>{getString(key)}</h1>;
  }

  function getHeader(key: string) {
    return <h3>{getString(key)}</h3>;
  }

  function getParagraph(key: string) {
    return <p>{getString(key)}</p>;
  }

  function getListItem(key: string) {
    return <li>{getString(key)}</li>;
  }

  useEffect(() => {
    document.getElementsByTagName("body")[0].id = "user-agreement";
  }, []);
  return (
    <main>
      {getTitle("title1")}
      {getParagraph("p1_1")}
      {getParagraph("p1_2")}
      {getParagraph("p1_3")}
      {getHeader("title2")}
      {getParagraph("p2_1")}
      {getParagraph("p2_2")}
      {getHeader("title3")}
      {getParagraph("p3_1")}
      {getParagraph("p3_2")}
      {getParagraph("p3_3")}
      {getHeader("titl3")}
      {getParagraph("p3_1")}
      {getParagraph("p3_2")}
      {getParagraph("p3_3")}
      {getHeader("title4")}
      {getParagraph("p4_1")}
      {getParagraph("p4_2")}
      {getParagraph("p4_3")}
      {getParagraph("p4_4")}
      {getParagraph("p4_4")}
      {getParagraph("p4_6")}
      {getParagraph("p4_7")}
      {getParagraph("p4_8")}
      {getParagraph("p4_9")}
      {getHeader("title5")}
      {getParagraph("p5_1")}
      {getParagraph("p5_2")}
      <ul>
        {getListItem("p5_l_1")}
        {getListItem("p5_l_2")}
        {getListItem("p5_l_3")}
        {getListItem("p5_l_4")}
        {getListItem("p5_l_5")}
        {getListItem("p5_l_6")}
        {getListItem("p5_l_7")}
      </ul>
      {getParagraph("p5_3")}
      {getHeader("title6")}
      {getParagraph("p6_1")}
      {getHeader("title7")}
      {getParagraph("p7_1")}
      <ul>
        {getListItem("p7_l_1")}
        {getListItem("p7_l_2")}
        {getListItem("p7_l_3")}
        {getListItem("p7_l_4")}
        {getListItem("p7_l_5")}
        {getListItem("p7_l_6")}
      </ul>
      {getParagraph("p7_2")}
      {getHeader("title8")}
      {getParagraph("p8_1")}
      {getParagraph("p8_2")}
      {getParagraph("p8_3")}
    </main>
  );
};

export { PrivacyNotice };
