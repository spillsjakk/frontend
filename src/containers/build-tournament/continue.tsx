import React, { FunctionComponent } from "react";
import { useForm } from "../../context/build-tournament-form";
import Translated from "../../components/translated";

const Continue: FunctionComponent<{}> = () => {
  const form = useForm();

  return (
    <>
      {!form.show && form.name === "" && (
        <div className="form-group mt-4">
          <button
            onClick={() => form.changeShow(true)}
            type="button"
            className="btn btn-success p-3"
          >
            <strong>
              <Translated str="continueWithoutTemplate" />
            </strong>
          </button>
        </div>
      )}
    </>
  );
};
export { Continue };
