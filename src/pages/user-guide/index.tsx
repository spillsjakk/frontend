import React, { FunctionComponent, useContext } from "react";
import LangContext from "../../components/LangContext";
import { getDictionary } from "./translations";

const UserGuide: FunctionComponent<{}> = () => {
  const { lang } = useContext(LangContext);
  const { getString } = getDictionary(lang);
  return (
    <main style={{ marginTop: "30px" }}>
      <h2>{getString("title")}</h2>
      <br />
      <p>{getString("p1")}</p>
      <p>{getString("p2")}</p>
      <br />
      <h3>{getString("index")}</h3>
      <ol>
        <li>
          <a href="#1">{getString("c1")}</a>
        </li>
        <li>
          <a href="#2">{getString("c2")}</a>
        </li>
        <li>
          <a href="#3">{getString("c3")}</a>
        </li>
        <li>
          <a href="#4">{getString("c4")}</a>
        </li>
        <li>
          <a href="#5">{getString("c5")}</a>
        </li>
        <li>
          <a href="#6">{getString("c6")}</a>
        </li>
        <ul>
          <li>
          <a href="#6a">{getString("c6a")}</a>
        </li>
        </ul>
        <li>
          <a href="#7">{getString("c7")}</a>
        </li>
        <li>
          <a href="#8">{getString("c8")}</a>
        </li>
        <li>
          <a href="#9">{getString("c9")}</a>
        </li>
        <li>
          <a href="#10">{getString("c10")}</a>
        </li>
        <li>
          <a href="#11">{getString("c11")}</a>
        </li>
        <li>
          <a href="#12">{getString("c12")}</a>
        </li>
      </ol>
      <br />
      <br />
      <h3 id="1">{getString("c1")}</h3>
      <br />
      <p>{getString("c1p1")}</p>
      <p>{getString("c1p2")}</p>
      <p>{getString("c1p3")}</p>
      <p>{getString("c1p4")}</p>
      <p>{getString("c1p5")}</p>
      <p>{getString("c1p6")}</p>
      <p>{getString("c1p7")}</p>
      <br />
      <br />
      <h3 id="2">{getString("c2")}</h3>
      <br />
      <p>{getString("c2p1")}</p>
      <p>{getString("c2p2")}</p>
      <p>{getString("c2p3")}</p>
      <p>{getString("c2p4")}</p>
      <p>{getString("c2p5")}</p>
      <p>{getString("c2p6")}</p>
      <br />
      <br />
      <h3 id="3">{getString("c3")}</h3>
      <br />
      <p>{getString("c3p1")}</p>
      <p>{getString("c3p2")}</p>
      <p>{getString("c3p3")}</p>
      <p>{getString("c3p4")}</p>
      <p>{getString("c3p5")}</p>
      <p>{getString("c3p6")}</p>
      <p>{getString("c3p7")}</p>
      <p>{getString("c3p8")}</p>
      <br />
      <br />
      <h3 id="4">{getString("c4")}</h3>
      <br />
      <p>{getString("c4p1")}</p>
      <p>{getString("c4p2")}</p>
      <p>{getString("c4p3")}</p>
      <br />
      <br />
      <h3 id="5">{getString("c5")}</h3>
      <br />
      <p>{getString("c5p1")}</p>
      <p>{getString("c5p2")}</p>
      <p>{getString("c5p3")}</p>
      <br />
      <br />
      <h3 id="6">{getString("c6")}</h3>
      <br />
      <p>{getString("c6p1")}</p>
      <p>{getString("c6p2")}</p>
      <p>{getString("c6p3")}</p>
      <p>{getString("c6p4")}</p>
      <p>{getString("c6p5")}</p>
      <p>{getString("c6p6")}</p>
      <br />
      <h4 id="6a">{getString("c6a")}</h4>
      <br />
      <strong>{getString("c6ah1")}</strong>
      <p>{getString("c6ap1")}</p>
      <p>{getString("c6ap2")}</p>
      <p>{getString("c6ap3")}</p>
      <p>{getString("c6ap4")}</p>
      <p>{getString("c6ap5")}</p>
      <p>{getString("c6ap6")}</p>
      <p>{getString("c6ap7")}</p>
      <p>{getString("c6ap8")}</p>
      <p>{getString("c6ap9")}</p>
      <p>{getString("c6ap10")}</p>
      <p>{getString("c6ap11")}</p>
      <p>{getString("c6ap12")}</p>
      <p>{getString("c6ap13")}</p>
      <p>{getString("c6ap14")}</p>
      <br />
      <strong>{getString("c6ah2")}</strong>
      <p>{getString("c6ap15")}</p>
      <p>{getString("c6ap16")}</p>
      <p>{getString("c6ap17")}</p>
      <p>{getString("c6ap18")}</p>
      <p>{getString("c6ap19")}</p>
      <br />
      <br />
      <h3 id="7">{getString("c7")}</h3>
      <br />
      <p>{getString("c7p1")}</p>
      <p>{getString("c7p2")}</p>
      <p>{getString("c7p3")}</p>
      <p>{getString("c7p4")}</p>
      <p>{getString("c7p5")}</p>
      <p>{getString("c7p6")}</p>
      <p>{getString("c7p7")}</p>
      <p>{getString("c7p8")}</p>
      <p>{getString("c7p9")}</p>
      <p>{getString("c7p10")}</p>
      <br />
      <br />
      <h3 id="8">{getString("c8")}</h3>
      <br />
      <p>{getString("c8p1")}</p>
      <p>{getString("c8p2")}</p>
      <p>{getString("c8p3")}</p>
      <br />
      <br />
      <h3 id="9">{getString("c9")}</h3>
      <br />
      <p>{getString("c9p1")}</p>
      <p>{getString("c9p2")}</p>
      <p>{getString("c9p3")}</p>
      <br />
      <br />
      <h3 id="10">{getString("c10")}</h3>
      <br />
      <p>{getString("c10p1")}</p>
      <p>{getString("c10p2")}</p>
      <br />
      <br />
      <h3 id="11">{getString("c11")}</h3>
      <br />
      <p>{getString("c11p1")}</p>
      <p>{getString("c11p2")}</p>
      <p>{getString("c11p3")}</p>
      <p>{getString("c11p4")}</p>
      <br />
      <br />
      <h3 id="12">{getString("c12")}</h3>
      <br />
      <p>{getString("c12p1")}</p>
      <p>{getString("c12p2")}</p>
    </main>
  );
};
export { UserGuide };
