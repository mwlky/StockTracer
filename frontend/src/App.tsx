import "./App.css";
import Divider from "./divider/Divider";
import Searchbar from "./searchbar/Searchbar";
import StockcardsGrid from "./stockcardsGrid/StockcardsGrid";

function App(){
  return (
    <>
      <div className="main-content">
        <h1>Stock Exchange Dashboard</h1>
        <Searchbar />
        <Divider />
        <StockcardsGrid />
      </div>
    </>
  );
}

export default App;
