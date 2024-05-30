import React from "react";

const CountriesList = ({ countries, onClick }) => {
  return countries.map((country) => (
    <div className="country" key={country.name.common}>
      <p>{country.name.common}</p>
      <button onClick={() => onClick(country)}>Show</button>
    </div>
  ));
};

export default CountriesList;