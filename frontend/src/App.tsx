import "./App.css";
import Divider from "./divider/Divider";
import Searchbar from "./searchbar/Searchbar";

function App() {
  return (
    <>
      <div className="main-content">
        <h1>Stock Exchange Dashboard</h1>
        <Searchbar />
        <Divider />
      </div>
    </>
  );
}

export default App;
