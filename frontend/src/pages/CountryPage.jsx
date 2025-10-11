import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import CountryDetail from "../components/CountryDetail";

export default function CountryPage() {
  const { code } = useParams();
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        const resp = await axios.get(`/api/countries/${code}`);
        setCountry(resp.data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchCountry();
  }, [code]);

  return (
    <div>
      <Link to="/">← Back</Link>
      {loading ? <p>Loading...</p> : <CountryDetail country={country} />}
    </div>
  );
}
