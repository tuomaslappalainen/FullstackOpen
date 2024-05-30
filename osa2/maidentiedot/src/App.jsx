import axios from "axios";
import { useEffect, useState } from "react";
import './app.css';
import CountriesList from "./components/CountriesList";
import Country from './components/Country';
import Message from "./components/Message";
import Search from "./components/Search";

function App() {
  const [countries, setCountries] = useState(null);
  const [search, setSearch] = useState();
  const [filteredCountries, setFilteredCountries] = useState([]);

  useEffect(() => {
    if (search) {
      const searchString = search.toLowerCase();
      setFilteredCountries(
        countries.filter((country) =>
          country.name.common.toLowerCase().includes(searchString)
        )
      );
    } else {
      setFilteredCountries([]);
    }
  }, [search]);

  useEffect(() => {
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then((response) => setCountries(response.data));
  }, []);

  const handleChange = (event) => {
    const { value } = event.target;
    setSearch(value);
  };

  const handleClick = (country) => {
    setFilteredCountries([country]);
  }

  return (
    <div>
      <Search search={search} onChange={handleChange} />
      {filteredCountries && (
        <>
          {filteredCountries.length > 10 && (
            <Message message="Too many matches, try being more specific" />
          )}
          {filteredCountries.length > 1 && filteredCountries.length < 10 && (
            <CountriesList countries={filteredCountries} onClick={handleClick}/>
          )}
          {filteredCountries.length === 1 && (
            <Country country={filteredCountries[0]}/>
          )}
        </>
      )}
    </div>
  );
}

export default App;