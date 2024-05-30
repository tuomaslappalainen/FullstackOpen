import React from "react";

function Search({search, onChange}) {
  return (
    <label>
      Find countries:{" "}
      <input type="text" value={search} onChange={onChange} />
    </label>
  );
}

export default Search;