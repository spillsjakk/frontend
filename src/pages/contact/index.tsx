import React, { FunctionComponent, useEffect } from "react";
import { Helmet } from "react-helmet";
import Translated from "../../components/translated";
import { title } from "../../functions";
import "./style.scss";

const Contact: FunctionComponent<{}> = () => {
  useEffect(() => {
    document.getElementsByTagName("body")[0].id = "contact-page";
  }, []);
  return (
    <>
      <Helmet>
        <title>{title("contact")}</title>
      </Helmet>
      <div className="wrapper">
        <div className="header">{Translated.byKey("getInTouch")}</div>
        <article className="box">
          <p>
            We’d always like to hear from you, whatever your query or feedback.
          </p>
          <p>
            Before reaching out, you might want to check our{" "}
            <a href="/user-guide">user guide</a> and <a href="/faqs">FAQs</a>,
            or find out more <a href="/about">about us</a> to see if that helps.
            For password resets, if your email is linked to the account, click{" "}
            <a href="/account/recover">here</a>.
          </p>
          <h5>General Enquiries: </h5>
          <p>
            We can be reached by email in Norwegian or English at:{" "}
            <a href="mailto:hei@spillsjakk.no">hei@spillsjakk.no</a>
          </p>
          <p>
            Someone’s also usually around on discord - you can join our discord
            here:{" "}
            <a target="blank" href="https://discord.gg/rJduXXCpc4">
              https://discord.gg/rJduXXCpc4
            </a>
          </p>
        </article>
      </div>
    </>
  );
};
export { Contact };
