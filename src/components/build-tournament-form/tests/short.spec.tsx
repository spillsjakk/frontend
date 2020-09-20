import React from "react";
import sinon from "sinon";
import { render, cleanup } from "@testing-library/react";

const sandbox = sinon.createSandbox();
describe("ShortFrom Unit Tests", () => {
  afterEach(() => {
    sandbox.verifyAndRestore();
    cleanup();
  });

  it.todo("should render inputs");
});
