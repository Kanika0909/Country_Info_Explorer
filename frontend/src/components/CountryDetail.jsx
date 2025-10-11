import React from "react";

export default function CountryDetail({ country }) {
  if (!country) return <div>Loading...</div>;

  return (
    <div className="country-detail">
      <img src={country.flag} alt={`${country.name} flag`} />
      <h2>
        {country.name} ({country.cca3})
      </h2>
      <p>
        <strong>Population:</strong> {country.population?.toLocaleString()}
      </p>
      <p>
        <strong>Region:</strong> {country.region}
      </p>
      <p>
        <strong>Subregion:</strong> {country.subregion || "—"}
      </p>
      <p>
        <strong>Capital:</strong> {country.capital || "—"}
      </p>
      <p>
        <strong>Languages:</strong> {country.languages?.join(", ") || "—"}
      </p>
      <p>
        <strong>Currencies:</strong> {country.currencies?.join(", ") || "—"}
      </p>
      <p>
        <strong>Borders:</strong> {country.borders?.join(", ") || "—"}
      </p>
    </div>
  );
}
