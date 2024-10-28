import React, { useState } from "react";
import Select from "react-select";
import "./MovieRecommendationForm.css";
import { countries } from "./countries";

const MovieRecommendationForm = () => {
  const [genre, setGenre] = useState("Action");
  const [country, setCountry] = useState( { label: "United States", value: "usa" });
  const [year, setYear] = useState("2020");
  const [actor, setActor] = useState("Tom Hardy");
  const [error, setError] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const getCsrfToken = () => {
    const name = "csrftoken=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookies = decodedCookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      let c = cookies[i].trim();
      if (c.startsWith(name)) {
        return c.substring(name.length);
      }
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const currentYear = new Date().getFullYear();

    if (year < 1900 || year < 0) {
      setError("Please enter a valid year (greater than 1900).");
      return;
    }

    if (year > currentYear) {
      setYear(currentYear);
    }

    setError("");
    setLoading(true);
    setResponseMessage("");

    const formData = {
      genre,
      country: country?.value,
      year: parseInt(year),
      actor,
    };

    try {
      const response = await fetch("/api/recommend/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCsrfToken(),
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = ""; // Buffer to accumulate chunks

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true }); // Multi bytes decoding
          buffer += chunk;

          let boundary;
          while ((boundary = buffer.indexOf("\n")) !== -1) {
            const jsonString = buffer.slice(0, boundary); // Extract the JSON string
            buffer = buffer.slice(boundary + 1); // Remove parsed part from buffer

            try {
              const jsonChunk = JSON.parse(jsonString);
              if (jsonChunk.response) {
                setResponseMessage((prev) => prev + jsonChunk.response);
              }
            } catch (err) {
              console.error("Failed to parse JSON chunk:", err);
            }
          }
        }
      } else {
        setResponseMessage("Error sending data");
      }
    } catch (error) {
      console.error("Error:", error);
      setResponseMessage("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`container ${responseMessage ? "response-received" : ""}`}>
      <div className="form-container">
        {/* <h2 className="text-center mb-4">Movie Recommendation</h2> */}
        <form
          onSubmit={handleSubmit}
          className="bg-light p-4 rounded shadow form-animation"
        >
          <div className="mb-3">
            <label className="form-label">Favorite Genre</label>
            <input
              type="text"
              className="form-control"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              placeholder="e.g., Action, Drama"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Preferred Country</label>
            <Select
              className="react-select"
              classNamePrefix="select"
              options={countries}
              value={country}
              onChange={setCountry}
              placeholder="Select a country..."
              isClearable
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Release Year</label>
            <input
              type="number"
              className="form-control"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="e.g., 2020"
              min="1901"
              required
            />
            {error && <div className="text-danger">{error}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Favorite Actor</label>
            <input
              type="text"
              className="form-control"
              value={actor}
              onChange={(e) => setActor(e.target.value)}
              placeholder="e.g., Tom Cruise"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Fetching Recommendation..." : "Get Recommendation"}
          </button>
        </form>
      </div>

      {responseMessage && (
        <div className="response-container">
          <h2 className="text-center">Recommendation</h2>
          <div className="response-message">{responseMessage}</div>
        </div>
      )}
    </div>
  );
};

export default MovieRecommendationForm;
