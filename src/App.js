import "./App.css";
import Users from "./users/Users";

function App() {
  const employeesDataURL =
    "https://gist.githubusercontent.com/daviferreira/41238222ac31fe36348544ee1d4a9a5e/raw/5dc996407f6c9a6630bfcec56eee22d4bc54b518/employees.json";

  return (
    <div className="App">
      <Users datafetchUrl={employeesDataURL} />
    </div>
  );
}

export default App;
