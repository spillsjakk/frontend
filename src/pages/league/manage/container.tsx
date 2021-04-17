import React, { FunctionComponent } from "react";
import { Season } from "./season";
import { Category } from "./category";
import { Header } from "./header";
import style from "./style.module.scss";
import { Grid } from "@material-ui/core";

const Container: FunctionComponent<unknown> = () => {
  return (
    <div className={style.wrapper}>
      <Header />

      <Grid container xs={12} md={8} spacing={5}>
        <Grid item xs={12} md={6}>
          <Season />
        </Grid>
        <Grid item xs={12} md={6}>
          <Category />
        </Grid>
      </Grid>
    </div>
  );
};
export { Container };
