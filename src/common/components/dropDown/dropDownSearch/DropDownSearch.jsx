import React, { useState, useMemo } from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

import DropDownList from "../dropDownList/DropDownList";
import "./dropDownSearch.css";

const DropDownSearch = ({
  placeHolderText,
  isDisabled,
  inputValuePattern,
  isRichTextDropDown,
  options,
  value,
  onValueSelect,
}) => {
  const validInputPattern = new RegExp(inputValuePattern, "g");
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleDropdown = () => {
    setIsOpen((isOpen) => !isOpen);
  };

  const dropDownContent = useMemo(() => {
    const formatString = (text) => text?.replace(/\s/g, "").toLowerCase();

    const searchTerm = formatString(searchQuery || value?.label);

    return !!searchTerm
      ? options.filter(
          (option) => formatString(option?.label).indexOf(searchTerm) !== -1
        )
      : options;
  }, [searchQuery, value?.label, options]);

  return (
    <div
      className={clsx(
        "dropDown-filter",
        isOpen && "open",
        isDisabled && "disabled"
      )}
    >
      <div className="box">
        <div className="input-text">
          <input
            type="text"
            placeholder={value || placeHolderText}
            value={searchQuery || value?.label || ""}
            disabled={isDisabled}
            onClick={() => setIsOpen(true)}
            onBlur={() => {
              setIsOpen(false);
            }}
            onChange={(event) => {
              const formattedValue = event.target.value.replace(
                validInputPattern,
                ""
              );
              value && onValueSelect(null);
              setSearchQuery(formattedValue);
            }}
          />
        </div>
        <div className="arrow-icon" onClick={() => toggleDropdown()}>
          {isOpen ? <FaChevronUp /> : <FaChevronDown />}
        </div>
      </div>
      <div className={clsx("options-container", isOpen && "open")}>
        {isOpen && (
          <DropDownList
            isVisible={isOpen}
            isRichTextDropDownList={isRichTextDropDown}
            onOptionSelect={(selectedValue) => {
              setIsOpen(false);
              setSearchQuery("");
              onValueSelect(selectedValue);
            }}
            options={dropDownContent}
            value={value}
          />
        )}
      </div>
    </div>
  );
};

DropDownSearch.propTypes = {
  placeHolderText: PropTypes.string,
  isDisabled: PropTypes.bool,
  inputValuePattern: PropTypes.string,
  onValueSelect: PropTypes.func.isRequired,
  isRichTextDropDown: PropTypes.bool,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      subTitle: PropTypes.string,
      icon: PropTypes.string,
    })
  ),
  value: PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    subTitle: PropTypes.string,
    icon: PropTypes.string,
  }),
};

export default DropDownSearch;
