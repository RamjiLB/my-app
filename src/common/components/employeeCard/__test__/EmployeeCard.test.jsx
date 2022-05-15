import React from "react";
import { render, screen } from "@testing-library/react/pure";
import EmployeeCard from "../EmployeeCard";

const defaultProps = {
  customIconText: "RB",
  label: "Ramji Balaraman",
  description: "ramji.balaraman@gmail.com",
};

test("WHEN component is loaded with minimal set of props", () => {
  const minimalProps = {
    ...defaultProps,
    customIconText: null,
    description: null,
  };

  render(React.cloneElement(<EmployeeCard {...minimalProps} />));

  expect(screen.getByText(/ramji balaraman/i)).toBeInTheDocument();

  expect(screen.queryByTestId("custom-card-icon")).not.toBeInTheDocument();
});

test("WHEN component is passed with default props(label/description/customIconText)", () => {
  render(React.cloneElement(<EmployeeCard {...defaultProps} />));

  expect(screen.getByText(/ramji\.balaraman@gmail\.com/i)).toBeInTheDocument();

  expect(screen.getByTestId("custom-card-icon")).toBeInTheDocument();
});
