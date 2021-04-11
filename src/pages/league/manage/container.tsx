import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import React, { FunctionComponent } from "react";
import { WithPopup } from "../../../hocs/popup";
import { Season, SeasonForm } from "./season";
import { Category, CategoryForm } from "./category";
import { WithSeasonForm } from "./with-season-form";
import { WithCategoryForm } from "./with-category-form";

const Container: FunctionComponent<unknown> = () => {
  return (
    <>
      <WithPopup
        content={
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <WithSeasonForm>
              <SeasonForm />
            </WithSeasonForm>
          </MuiPickersUtilsProvider>
        }
      >
        <Season />
      </WithPopup>
      <WithPopup
        content={
          <WithCategoryForm>
            <CategoryForm />
          </WithCategoryForm>
        }
      >
        <Category />
      </WithPopup>
    </>
  );
};
export { Container };
