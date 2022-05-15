import React from "react";
import PropTypes from "prop-types";

import "./employeeCard.css";

const EmployeeCard = ({ customIconText, imgIconSrc, label, description }) => {
  return (
    <div className="card">
      {customIconText && (
        <span className="card-icon" data-testid="custom-card-icon" data-customicon={customIconText}></span>
      )}
      {imgIconSrc && <img data-testid="card-icon" src={imgIconSrc} alt={`Employee ${label}`} />}
      <div className="card-text">
        <span className="card-label">{label}</span>
        <span className="card-subTitle">{description}</span>
      </div>
    </div>
  );
};

EmployeeCard.propTypes = {
  customIconText: PropTypes.string,
  imgIconSrc: PropTypes.string,
  label: PropTypes.string.isRequired,
  description: PropTypes.string,
};

export default EmployeeCard;
