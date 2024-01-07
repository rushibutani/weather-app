import React, { useState, useEffect } from "react";
import "./styles.scss";
import WeatherCard from "./components/WeatherCard";
import SelectLocation from "./components/SelectLocation";
import ErrorMessage from "./components/ErrorMessage";
import { config } from "./common/config";
import { Loader } from "./components/Loader/Loader";

const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [pastSevenDays, setPastSevenDays] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedLocation = localStorage.getItem("currentLocation");

    if (storedLocation) {
      setCurrentLocation(storedLocation);
      fetchWeatherData(storedLocation);
      generateLast7Days(storedLocation);
    } else {
      fetchCurrentLocation();
    }
  }, []);

  const fetchCurrentLocation = async () => {
    try {
      const locationResponse = await fetch(config.CURRENT_LOCATION_FETCH_API);
      const locationData = await locationResponse.json();

      if (locationData.city && locationData.country) {
        const newLocation = `${locationData.city}, ${locationData.country}`;
        setCurrentLocation(newLocation);
        localStorage.setItem("currentLocation", newLocation);
        fetchWeatherData(newLocation);
        generateLast7Days(newLocation);
      } else {
        setError("Please enter a valid location");
      }
    } catch (error) {
      console.error("Error fetching current location:", error);
      setError("Error fetching location. Please try again.");
    }
  };

  const fetchWeatherData = async (location) => {
    const apiKey = config.WEATHER_API_KEY;
    const currentDate = new Date().toISOString().split("T")[0];
    setIsLoading(true);

    try {
      const response = await fetch(
        `${config.WEATHER_API_END_POINT}?key=${apiKey}&q=${location}&dt=${currentDate}`
      );

      if (!response.ok) {
        setError("Error fetching weather data. Please try again.");
        return;
      }

      const data = await response.json();
      setWeatherData(data);
      setError(null);
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching weather data:", error);
      setError("Error fetching weather data. Please try again.");
    }
  };

  const generateLast7Days = async (location) => {
    setIsLoading(true);
    const apiKey = config.WEATHER_API_KEY;
    let currentDate = new Date().toISOString().split("T")[0];

    try {
      const requests = [];

      for (let i = 0; i < 7; i++) {
        const request = fetch(
          `${config.WEATHER_API_END_POINT}?key=${apiKey}&q=${location}&dt=${currentDate}`
        );

        requests.push(request);

        currentDate = new Date(
          new Date(currentDate).setDate(new Date(currentDate).getDate() - 1)
        )
          .toISOString()
          .split("T")[0];
      }

      const responses = await Promise.all(requests);

      const responseData = await Promise.all(
        responses.map(async (response) => {
          if (!response.ok) {
            setError("Error fetching weather data. Please try again.");
            return null;
          }

          return await response.json();
        })
      );

      if (responseData.includes(null)) {
        return;
      }

      setPastSevenDays(responseData);
      setError(null);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching weather data:", error);
      setError("Error fetching weather data. Please try again.");
    }
  };

  const handleLocationSubmit = (location) => {
    fetchWeatherData(location);
    generateLast7Days(location);
  };

  const handleRetry = () => {
    setError(null);
    fetchCurrentLocation();
  };

  return (
    <div>
      {isLoading && !error ? (
        <div className="blur">
          <Loader />
        </div>
      ) : (
        <div className="app">
          {error ? (
            <>
              <SelectLocation
                onLocationSubmit={handleLocationSubmit}
                defaultLocation={currentLocation}
              />
              <ErrorMessage onRetry={handleRetry} />
            </>
          ) : weatherData ? (
            <>
              <SelectLocation
                onLocationSubmit={handleLocationSubmit}
                defaultLocation={currentLocation}
              />
              <WeatherCard
                weatherData={weatherData}
                pastSevenDays={pastSevenDays}
              />
            </>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default App;
