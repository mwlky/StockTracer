import './Searchbar.css';

const Searchbar = () => {
  return (
    <form className="searchbar" onSubmit={e => e.preventDefault()}>
      <input
        type="search"
        placeholder="Search..."
        aria-label="Search"
      />
      <button type="submit">Search</button>
    </form>
  );
};

export default Searchbar;
