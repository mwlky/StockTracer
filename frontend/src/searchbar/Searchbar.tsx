import { useState } from "react";
import "./Searchbar.css";

const allStocks = [
  "AAPL",
  "GOOGL",
  "AMZN",
  "MSFT",
  "TSLA",
  "NFLX",
  "FB",
  "NVDA",
  "DIS",
  "V",
];

const Searchbar = ({ addStock }: { addStock: (stock: string) => void }) => {
  const [query, setQuery] = useState("");
  const [filteredStocks, setFilteredStocks] = useState<string[]>([]);

  const suggestionContainerStyle =
    filteredStocks.length > 0
      ? "suggestion-container-active"
      : "suggestion-container-disabled";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value === "") {
      setFilteredStocks([]);
      return;
    }
    const filtered = allStocks.filter((stock) =>
      stock.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredStocks(filtered);
  };

  const handleSelect = (stock: string) => {
    setQuery("");
    setFilteredStocks([]);
    
    addStock(stock);
  };

  return (
    <div className="searchbar-container">
      <form className="searchbar" onSubmit={(e) => e.preventDefault()}>
        <input
          type="search"
          placeholder="Search..."
          aria-label="Search"
          value={query}
          onChange={handleChange}
        />
        <button type="submit">Search</button>
      </form>

      <div className={suggestionContainerStyle}>
        <ul className="suggestions-list">
          {filteredStocks.map((stock, index) => (
            <li key={index} onClick={() => handleSelect(stock)}>
              {stock}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Searchbar;
