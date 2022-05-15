# Custom Dropdown with search

This project is used to create a dropdown with search/filtering functionality build in. This `does not use react-select` rather it uses HTML, CSS, React to mimic the react-select implementation and add more features if required.

## Component architecture
Used Axios to fetch the data for dropdown from API. Went with Axios as it 
    automatically converts response to JSON, 
    do not need to check explicitly if response is `OK`


As this is a small POC I placed the axios code, response mapping code in a react component `USERS`. In real world projects below architecture is suggested
    axios implementation would be abstarcted and placed in a separate JS file so all GET,PUT,POST calls can go through one single file
    Also use redux or reducer hook to dispatch actions to intiate calls and get response via selectors in the component so component is decoupled from the axios
    Also we would make use of JS helper function like mappers etc to convert the data in to the desired format before reaching the component to make sure component is as lightweight as possible
    So in practical world this `USERS` component would be very light once we move out the axios, mapping logic

`USERS` component is what gives the data to the dropdown component and get callback from the dropdown component with the choosen value from the dropdown. Which is again passed back to the dropdown component as selected value.

`DROPDOWNSEARCH`, `DROPDOWNLIST`, `EMPLOYEECARD` are the three component which make up the complete dropdown component. Idea behind this segregation was

    First a component from which user triggers dropdown and sees selected value
        this can be a standard dropdown where only click is provided
        or in this case a search dropdown with both click and text input ability `DROPDOWNSEARCH`
        or in some cases it can be a multi-select with chips

    Second component to show the list of items for the dropdown, here the variation come in a way of
        similar to this POC somethimes we might need a rich text dropdown with icon, names, email arranged in specific style `DROPDOWNLIST`
        or in many cases a basic dropdown with just text. I also created a basic dropdown version which you can see if you dont pass or pass false to `isRichTextDropDownList` property of this component

    Third component(s) is what handles those rich text variations that might be required by the 2nd component, as there can be many different rich text dropdowns we might be asked of the 2nd component just acts as a factory component rendering those different variations
        this component(s) create a single instance of a dropdown list item based on the content, type and style of rich text requested in the second component
        one such style can be the employee card based design requested in this POC hence i created the `EMPLOYEECARD` component and iterated it 2nd component

How this architecture follows SOLID principles

    Each component has only one responsibility that is they control only part of the dropdown which is important and not the whole dropdown
    They are properly decoupled from each other and change in one component can be easily adopted or accommodated in other without breaking changes
    We can create mutiple input type dropdowns and combine the dropdown list with them easily
    similar way we can use this dropdown list else where even without the input/standard dropdown just to show case the data
    Employee card can be also used stand alone anywhere to show data of an employee
    This way is follows open closed principle too
    Because of such a struture we can test this easily in isolation, reuse and put together many combinations of different dropdowns and different lists quickly


## Response data mapping
    While understanding the data from response these are assumptions i made and decisions i took
        Response had two main table like structures `Employee`, `Accounts`
        Also the response was separated in to `Data`, `Included`
        Employees information was available in both Data and Included but I could not identify the difference, so I assumed there is no difference
        Meanwhile Accounts information was only available in Included section and not in Data
        There were also duplicates of Employee data
        I assumed both Data, Included sections can have employees and accounts information 
        Looking at the relation I used employee account id to fetch their account information from account table and from there get theri email address

    After that I was not sure if all these employees are considered managers or only some? 
        Analyzing the information in the response and mapping relations between employees and accounts table did not give me any pattern
        So i got this list of all the managers whom these employees where reporting to via the employee--> relationships --> manager --> id
        If the users did not have any managers i also considered them managers
        This way i created a list of users whom i considered as managers
        Then only extracted and created a list of object which is necessary for my dropdown
        Then sorted this information alphabetically
        Typically all this manipulation mapping and extraction would be happening in a mapping file as soon as data is received from response and then final information i stored in redux before it comes to component

        Note: but doing this mapping resulted in only 3 id's which are considered as managers  139, 194, 201. And off of those three we get employee infor for only two managers 139, 201. So if i do this we will be only dealing with two results, so for the purposes of demoing or using this POC I commented out the code to show only managers `line 101 Users.jsx` so with this all the users are considered for the dropdown. please uncomment this line to see only the manager list based on my mapping assumption. 









### `npm start`


