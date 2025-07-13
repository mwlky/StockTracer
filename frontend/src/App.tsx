import "./App.css";
import Divider from "./divider/Divider";
import Searchbar from "./searchbar/Searchbar";
import StockCard from "./stockcard/StockCard";

function App() {
  return (
    <>
      <div className="main-content">
        <h1>Stock Exchange Dashboard</h1>
        <Searchbar />
        <Divider />
        <StockCard title="AAPL" price={150.25} change={1.5} />
      </div>
    </>
  );
}

export default App;
