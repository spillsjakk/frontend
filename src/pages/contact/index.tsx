import React, { FunctionComponent, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
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
            <Link to="/user-guide">user guide</Link> and{" "}
            <Link to="/faqs">FAQs</Link>, or find out more{" "}
            <Link to="/about">about us</Link> to see if that helps. For password
            resets, if your email is linked to the account, click{" "}
            <Link to="/account/recover">here</Link>.
          </p>
          <h5>General Enquiries: </h5>
          <p>
            We can be reached by email in Norwegian or English at:{" "}
            <Link to="mailto:hei@spillsjakk.no">hei@spillsjakk.no</Link>
          </p>
          <p>
            Someone’s also usually around on discord - you can join our discord
            here:{" "}
            <Link target="blank" to="https://discord.gg/rJduXXCpc4">
              https://discord.gg/rJduXXCpc4
            </Link>
          </p>
        </article>
      </div>
    </>
  );
};
export { Contact };
