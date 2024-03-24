import React, { useState } from "react";
import { FaSearchLocation } from "react-icons/fa";

const SelectLocation = ({ onLocationSubmit }) => {
  const [locationInput, setLocationInput] = useState("");

  const handleInputChange = (value) => {
    setLocationInput(value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (locationInput) {
      onLocationSubmit(locationInput);
    }
  };

  return (
    <div className="location-container">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={locationInput}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="Search Location"
        />

        <div className="search-icon" onClick={handleSubmit}>
          <FaSearchLocation />
        </div>
      </form>
    </div>
  );
};

export default SelectLocation;
