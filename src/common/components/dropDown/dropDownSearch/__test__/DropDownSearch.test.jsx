import React from "react";
import { render, screen, fireEvent } from "@testing-library/react/pure";
import userEvent from "@testing-library/user-event";

import DropDownSearch from "../DropDownSearch";

const mockOnValueSelectfn = jest.fn();

const defaultProps = {
  isRichTextDropDown: true,
  placeHolderText: "Choose Manager",
  inputValuePattern: "[^A-Za-z ]",
  options: [
    { id: "1", label: "Label 1", subTitle: "Sub title 1", icon: "IT1" },
    { id: "2", label: "Label 2", subTitle: "Sub title 2", icon: "IT2" },
    { id: "3", label: "Label 3", subTitle: "Sub title 3", icon: "IT3" },
  ],
  value: { id: "2", label: "Label 2", subTitle: "Sub title 2", icon: "IT2" },
  onValueSelect: mockOnValueSelectfn,
};

test("WHEN no value is provided in the props", () => {
  const minimalProps = {
    ...defaultProps,
    value: null,
  };

  render(React.cloneElement(<DropDownSearch {...minimalProps} />));

  // by default dropdown is not visible
  expect(screen.queryByText(/label 1/i)).not.toBeInTheDocument();

  // user clicks the textbox and the dropdown becomes visible
  fireEvent.click(screen.getByPlaceholderText("Choose Manager"));

  expect(screen.getByText(/label 1/i)).toBeInTheDocument();

  // user types in textbox but no call to reste selection is dispatched as there is no existing selected value
  userEvent.type(screen.getByRole("textbox"), "lab");

  expect(mockOnValueSelectfn).toHaveBeenCalledTimes(0);

  // user selects a value from the dropdown which closes the dropdown and invokes call back fruntion with selected row item data
  fireEvent.mouseDown(screen.getByText(/label 2/i));

  expect(screen.getByRole("textbox", { value: "" })).toBeInTheDocument();

  expect(screen.queryByText(/label 1/i)).not.toBeInTheDocument();

  expect(mockOnValueSelectfn).toHaveBeenCalledTimes(1);

  expect(mockOnValueSelectfn).toHaveBeenCalledWith(defaultProps.options[1]);

  // user types non-alphabet and non space characters in textbox, only alphabets and space are allowed other characters are striped out
  userEvent.type(screen.getByRole("textbox"), "1ab? c*");

  expect(screen.getByRole("textbox", { value: "ab c" })).toBeInTheDocument();

  // when there are no results for the search query No results section is shown in the dropdown 
  expect(
    screen.getByText(/No results. Try with a different value/i)
  ).toBeInTheDocument();

  // when user clicks outside the dropdown the dropdown closes
  fireEvent.click(window);

  expect(screen.queryByText(/label 1/i)).not.toBeInTheDocument();

});

test("WHEN value is provided in the props", async () => {
// when there is selected value then the value is shown in the textbox and dropdown is closed 
  await render(React.cloneElement(<DropDownSearch {...defaultProps} />));

  expect(screen.queryByText(/label 2/i)).not.toBeInTheDocument();

  fireEvent.click(screen.queryAllByRole("textbox", { value: "label 2" })[1]);

  // when user clicks on the textbox dropdown is opened with only slected value as a result
  expect(screen.getByText(/label 2/i)).toBeInTheDocument();

  expect(screen.queryByText(/label 3/i)).not.toBeInTheDocument();

  expect(screen.queryByText(/label 1/i)).not.toBeInTheDocument();

  // user click on the selected value again but we wont trigger the call to update it as there is no change in selected value
  fireEvent.mouseDown(screen.getByText(/label 2/i));

  expect(mockOnValueSelectfn).toHaveBeenCalledTimes(0);

  // user types a different query in textbox then we invoked call to reset selected value
  userEvent.type(screen.queryAllByRole("textbox", { value: "label 2" })[1], "e");

  expect(mockOnValueSelectfn).toHaveBeenCalledTimes(1);

  expect(mockOnValueSelectfn).toHaveBeenCalledWith(null);
});
