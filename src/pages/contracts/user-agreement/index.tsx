import React, { FunctionComponent, useEffect } from "react";
import { useLang } from "../../../components/LangContext";
import { getDictionary } from "./translations";
import "./style.scss";

const UserAgreement: FunctionComponent<{}> = () => {
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
      {getParagraph("p1_4")}
      {getParagraph("p1_5")}
      {getHeader("title2")}
      {getParagraph("p2_1")}
      <ul>
        {getListItem("p2_2")}
        {getListItem("p2_3")}
        {getListItem("p2_4")}
        {getListItem("p2_5")}
        {getListItem("p2_6")}
      </ul>
      {getParagraph("p2_7")}
      {getHeader("title3")}
      {getParagraph("p3_1")}
      {getHeader("title4")}
      {getParagraph("p4_1")}
      {getHeader("title5")}
      {getParagraph("p5_1")}
      {getHeader("title6")}
      {getParagraph("p6_1")}
      {getHeader("title7")}
      {getParagraph("p7_1")}
      {getHeader("title8")}
      {getParagraph("p8_1")}
      {getHeader("title9")}
      {getParagraph("p9_1")}
      {getHeader("title10")}
      {getParagraph("p10_1")}
      {getHeader("title11")}
      {getParagraph("p11_1")}
      {getHeader("title12")}
      {getParagraph("p12_1")}
      {getParagraph("p12_2")}
      {getHeader("title13")}
      {getParagraph("p13_1")}
      {getParagraph("p13_2")}
      <ul>
        {getListItem("p13_3")}
        {getListItem("p13_4")}
        {getListItem("p13_5")}
        {getListItem("p13_6")}
        {getListItem("p13_7")}
        {getListItem("p13_8")}
        {getListItem("p13_9")}
        {getListItem("p13_10")}
        {getListItem("p13_11")}
        {getListItem("p13_12")}
        {getListItem("p13_13")}
        {getListItem("p13_14")}
        {getListItem("p13_15")}
        {getListItem("p13_16")}
        {getListItem("p13_17")}
      </ul>
      {getParagraph("p13_18")}
    </main>
  );
};

export { UserAgreement };
