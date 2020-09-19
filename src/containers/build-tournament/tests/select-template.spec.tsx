import React from "react";
import sinon from "sinon";
import { render, cleanup } from "@testing-library/react";
import { SelectTemplate } from "../select-template";
import * as Dropdown from "../../../components/dropdown/index";

const sandbox = sinon.createSandbox();

describe("Select Template Unit Tests", () => {
  afterEach(() => {
    sandbox.verifyAndRestore();
    cleanup();
  });

  it("should render components", () => {
    // Arrange
    const dropdownStub = sandbox
      .stub(Dropdown, "Dropdown")
      .returns(<div></div>);

    // Act
    render(<SelectTemplate />);

    // Assert
    expect(dropdownStub.called).toBe(true);
  });
});
