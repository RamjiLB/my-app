import React from "react";
import clsx from "clsx";
import PropTypes from "prop-types";

import EmployeeCard from "../../employeeCard/EmployeeCard";
import "./dropDownList.css";

const DropDownList = ({
  isRichTextDropDownList,
  options,
  value,
  onOptionSelect,
}) => {
  return (
    <ul className={clsx("options-list", isRichTextDropDownList && "richtext")}>
      {options?.length ? (
        options.map((result) => (
          <li
            key={result.id}
            className="option-item"
            data-testid={value?.id === result.id && result.id}
          >
            <button
              className={clsx(
                "option",
                value?.id === result.id && "selected",
                isRichTextDropDownList && "richtext"
              )}
              aria-pressed={value?.id === result.id}
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === "Enter" && value?.id !== result.id) {
                  onOptionSelect(result);
                }
              }}
              onMouseDown={() => {
                if (value?.id !== result.id) {
                  onOptionSelect(result);
                }
              }}
            >
              {isRichTextDropDownList ? (
                <EmployeeCard
                  customIconText={result.icon}
                  description={result.subTitle}
                  label={result.label}
                />
              ) : (
                <div className="option-text">
                  <span className="option-label">{result.label}</span>
                </div>
              )}
            </button>
          </li>
        ))
      ) : (
        <li className="no-results">
          {"No results. Try with a different value"}
        </li>
      )}
    </ul>
  );
};

DropDownList.propTypes = {
  isRichTextDropDownList: PropTypes.bool,
  onOptionSelect: PropTypes.func,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string,
      subTitle: PropTypes.string,
      icon: PropTypes.string,
    })
  ),
  value: PropTypes.shape({
    id: PropTypes.string,
    label: PropTypes.string,
    subTitle: PropTypes.string,
    icon: PropTypes.string,
  }),
};

export default DropDownList;
