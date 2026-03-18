import React, { useEffect, useState } from "react";
import axios from "axios";
import SearchBar from "../components/SearchBar";
import CountryCard from "../components/CountryCard";

export default function Home() {
  const [countries, setCountries] = useState([]);
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchCountries = async () => {
    setLoading(true);
    try {
      const params = {};
      if (query) params.q = query;
      if (region) params.region = region;
      const resp = await axios.get(
        "https://country-info-explorer-6wvf.onrender.com/api/countries",
        { params },
      );
      setCountries(resp.data);
    } catch (err) {
      console.error(err);
      setCountries([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  return (
    <div>
      <SearchBar
        query={query}
        setQuery={setQuery}
        region={region}
        setRegion={setRegion}
        onSearch={fetchCountries}
      />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid">
          {countries.map((country) => (
            <CountryCard key={country.cca3} country={country} />
          ))}
        </div>
      )}
    </div>
  );
}
