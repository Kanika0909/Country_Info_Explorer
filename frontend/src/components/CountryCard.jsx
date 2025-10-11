import React from "react";
import { Link } from "react-router-dom";

export default function CountryCard({ country }) {
  return (
    <Link to={`/country/${country.cca3}`} className="link">
      <div className="card">
        <img className="flag" src={country.flag} alt={`${country.name} flag`} />
        <h3>{country.name}</h3>
        <p>
          <strong>Population:</strong> {country.population?.toLocaleString()}
        </p>
        <p>
          <strong>Region:</strong> {country.region}
        </p>
        <p>
          <strong>Capital:</strong> {country.capital || "—"}
        </p>
      </div>
    </Link>
  );
}
