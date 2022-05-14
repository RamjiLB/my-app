import React, { useState, useMemo } from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

import "./dropDownFilter.css";

const DropDownFilter = ({
  placeHolderText,
  isDisabled,
  inputValuePattern,
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
    const formatString = (text) => text.replace(/\s/g, "").toLowerCase();

    const searchTerm = formatString(searchQuery);

    return options.filter(
      (option) => formatString(option?.label).indexOf(searchTerm) !== -1
    );
  }, [searchQuery, options]);

  return (
    <div className={clsx("dropDown-filter", isOpen && "open")}>
      <div className="box">
        <div className="input-text">
          <input
            type="text"
            placeholder={value || placeHolderText}
            value={searchQuery || value?.label || ""}
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
        <div
          className="arrow-icon"
          onBlur={() => setIsOpen(false)}
          onClick={() => toggleDropdown()}
        >
          {isOpen ? <FaChevronUp /> : <FaChevronDown />}
        </div>
      </div>
      <div className={clsx("options-container", isOpen && "open")}>
        <ul className="options-list">
          {dropDownContent?.length ? (
            dropDownContent.map((result) => (
              <li key={result.id} className="option-item">
                <button
                  className={clsx(
                    "option",
                    value?.id === result.id && "selected"
                  )}
                  tabIndex={-1}
                  onMouseDown={() => {
                    setSearchQuery("");
                    onValueSelect(result);
                    setIsOpen(false);
                  }}
                >
                  <span
                    className="option-icon"
                    data-customicon={result.icon}
                  ></span>
                  <div className="option-text">
                    <span className="option-label">{result.label}</span>
                    <span className="option-subTitle">{result.subTitle}</span>
                  </div>
                </button>
              </li>
            ))
          ) : (
            <li className="no-results">
              {"No results. Try with a different value"}
            </li>
          )}
        </ul>
      </div>
      {/* 
      <ReactSelect
        id={`dropDown-filter-select-${id}`}
        className="dropDown-filter-select"
        ref={inputRef}
        onBlur={handleBlur}
        onChange={handleChange}
        options={options}
        value={value}
        placeHolder={placeHolderText}
        isDisabled={isDisabled}
        // menuIsOpen={true}
      /> */}
    </div>
  );
};

DropDownFilter.propTypes = {
  placeHolderText: PropTypes.string,
  isDisabled: PropTypes.bool,
  inputValuePattern: PropTypes.string,
  onValueSelect: PropTypes.func.isRequired,
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

export default DropDownFilter;
