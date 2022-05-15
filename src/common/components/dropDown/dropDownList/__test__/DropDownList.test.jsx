import React from "react";
import { render, screen, fireEvent } from "@testing-library/react/pure";
import DropDownList from "../DropDownList";

const mockOnSelectfn = jest.fn();

const defaultProps = {
  options: [
    { id: "1", label: "Label 1", subTitle: "Sub title 1", icon: "IT1" },
    { id: "2", label: "Label 2", subTitle: "Sub title 2", icon: "IT2" },
    { id: "3", label: "Label 3", subTitle: "Sub title 3", icon: "IT3" },
  ],
  value: { id: "2", label: "Label 2", subTitle: "Sub title 2", icon: "IT2" },
  onOptionSelect: mockOnSelectfn,
};

test("WHEN options are provided in the props with no selected value", () => {
  const minimalProps = {
    ...defaultProps,
    value: null,
  };

  render(React.cloneElement(<DropDownList {...minimalProps} />));

  expect(screen.getByText(/label 1/i)).toBeInTheDocument();

  expect(screen.getByText(/label 2/i)).toBeInTheDocument();

  expect(screen.getByText(/label 3/i)).toBeInTheDocument();

  fireEvent.mouseDown(screen.getByText(/label 1/i));

  expect(mockOnSelectfn).toHaveBeenCalledTimes(1);

  expect(mockOnSelectfn).toHaveBeenCalledWith(defaultProps.options[0]);
});

test("WHEN options are provided in the props with selected value", () => {
  render(React.cloneElement(<DropDownList {...defaultProps} />));

  expect(screen.getByTestId("2")).toBeInTheDocument();
});

test("WHEN options are not provided in the props", () => {
  const emptyOptionsProps = {
    options: [],
    value: null,
    onOptionSelect: null,
  };

  render(React.cloneElement(<DropDownList {...emptyOptionsProps} />));

  expect(
    screen.getByText(/No results. Try with a different value/i)
  ).toBeInTheDocument();
});
