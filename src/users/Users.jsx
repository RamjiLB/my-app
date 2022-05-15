import React, { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import axios from "axios";

import DropDownSearch from "../common/components/dropDown/dropDownSearch/DropDownSearch";
import "./users.css";

const Users = ({ datafetchUrl }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [employeeTableData, setEmployeeTableData] = useState(null);
  const [accountTableData, setAccountTableData] = useState(null);
  const [employeesInfo, setEmployeesInfo] = useState(null);

  const [selectedManager, setSelectedManager] = useState(null);
  const [error, setError] = useState(null);

  const getAllEmployeesData = useCallback(() => {
    axios
      .get(datafetchUrl)
      .then((response) => {
        const employeesData = [
          ...response?.data?.data?.filter(
            (entry) => entry?.type === "employees"
          ),
          ...response?.data?.included?.filter(
            (entry) =>
              entry?.type === "employees" &&
              response?.data?.data?.findIndex(
                (additonalEmployee) => additonalEmployee.id === entry.id
              ) === -1
          ),
        ];

        const accountsData = [
          ...response?.data?.data?.filter(
            (entry) => entry?.type === "accounts"
          ),
          ...response?.data?.included?.filter(
            (entry) => entry?.type === "accounts"
          ),
        ];

        setEmployeeTableData(employeesData);
        setAccountTableData(accountsData);
      })
      .catch((error) => {
        setError(error);
        console.error("Error fetching employees: ", error);
      })
      .finally(() => setIsLoading(false));
  }, [datafetchUrl]);

  useEffect(() => {
    getAllEmployeesData();
  }, [datafetchUrl, getAllEmployeesData]);

  useEffect(() => {
    if (employeeTableData && accountTableData) {
      let employeeAccountId, employeeAccountInfo;

      const managerIdList = employeeTableData.map(
        (employee) => employee.relationships?.Manager?.data?.id || employee.id
      );

      const uniqueManagerSet = [...new Set(managerIdList)];

      const employeesBriefInfo = employeeTableData.map((employee) => {
        employeeAccountId = employee.relationships?.account?.data?.id;
        employeeAccountInfo = accountTableData.filter(
          (account) => account.id === employeeAccountId
        )[0];

        return {
          employeeId: employee.id,
          accountId: employeeAccountId,
          managerEmployeeId: employee.relationships?.Manager?.data?.id,
          firstName: employee.attributes?.firstName,
          lastName: employee.attributes?.lastName,
          name: employee.attributes?.name,
          email: employeeAccountInfo?.attributes?.email,
          isManager:
            uniqueManagerSet.findIndex((id) => employee.id === id) !== -1,
        };
      });

      setEmployeesInfo(employeesBriefInfo);
    }
  }, [employeeTableData, accountTableData]);

  const handleManagerSelection = (selectedManager) => {
    console.log("Selected manager: ", selectedManager);
    setSelectedManager(selectedManager);
  };

  const sortEmployeeList = (employeeA, employeeB) =>
    employeeA?.label.localeCompare(employeeB?.label);

  const getEmployeesList = () => {
    return employeesInfo
      // .filter((employee) => employee.isManager)
      .map((employee) => {
        const { employeeId: id, name: label, email: subTitle } = employee;

        return {
          id,
          label,
          subTitle,
          icon: `${employee.firstName.charAt(0)}${employee.lastName.charAt(0)}`,
        };
      })
      ?.sort(sortEmployeeList);
  };

  return (
    <>
      <div className="user-data">
        {isLoading && <div>{"Loading employees data"}</div>}
        {error && <div>{"Error loading data"}</div>}

        {employeesInfo?.length && !error && !isLoading && (
          <DropDownSearch
            placeHolderText={"Choose Manager"}
            isDisabled={!employeesInfo?.length}
            inputValuePattern="[^A-Za-z ]"
            isRichTextDropDown
            options={getEmployeesList()}
            value={selectedManager}
            onValueSelect={handleManagerSelection}
          />
        )}
      </div>
    </>
  );
};

Users.propTypes = {
  datafetchUrl: PropTypes.string.isRequired,
};

export default Users;
