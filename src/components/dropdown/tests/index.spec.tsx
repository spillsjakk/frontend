import React from "react";
import sinon from "sinon";
import faker from "faker";
import { render, cleanup } from "@testing-library/react";
import UserEvent from "@testing-library/user-event";
import { Dropdown } from "../index";
import { Option } from "../interface";

const sandbox = sinon.createSandbox();
const { random: { number }, lorem: { word, words } } = faker;

const optionFactory = () => ({ name: words(2), value: words(2) });

describe("Dropdown Component Unit Tests", () => {
  let options: Array<Option>;

  afterEach(() => {
    sandbox.verifyAndRestore();
    cleanup();
  });

  beforeEach(() => {
    options = Array(number({min: 3, max: 10})).fill(null).map(() => optionFactory());
  })
  it("should render select and options", () => {
    // Arrange

    // Act
    const { container } = render(<Dropdown options={options} onSelect={(value: string) => null} />)

    // Assert
    expect(container.querySelectorAll("select")).toHaveLength(1);
    expect(container.querySelectorAll("option")).toHaveLength(options.length);
  });

  it("should call onSelect", async () => {
    // Arrange
    const onSelectStub = sandbox.stub();

    // Act
    const { container } = render(<Dropdown options={options} onSelect={onSelectStub} />);
    UserEvent.selectOptions(container.querySelector("select"), [options[0].value]);

    // Assert
    expect(onSelectStub.getCalls()).toHaveLength(1);
    expect(onSelectStub.getCall(0).args[0]).toBe(options[0].value);

  });

});