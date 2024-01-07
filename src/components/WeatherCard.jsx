import React, { useEffect, useState } from "react";
import moment from "moment-timezone";
import Carousel from "./Carousel";

const WeatherCard = ({ weatherData, pastSevenDays }) => {
  const { location, forecast } = weatherData;
  const { name, country } = location;
  const { avgtemp_c } = forecast.forecastday[0].day;
  const [displayDate, setDisplayDate] = useState("");

  const getCurrentDatetimeString = () => {
    const timeZone = location.tz_id;
    const format = "ddd, DD/MM/YYYY, HH:mm";
    const currentTime = moment().tz(timeZone).format(format);
    return currentTime;
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDisplayDate(getCurrentDatetimeString());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const [temperatureUnit, setTemperatureUnit] = useState("C");

  const formatLocalTime = (dateString) => {
    const options = {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };

  const convertTemperature = (temp) => {
    const roundedTemp =
      temperatureUnit === "C"
        ? Math.round(temp)
        : Math.round((temp * 9) / 5 + 32);
    const unit = temperatureUnit === "C" ? "°C" : "°F";

    return (
      <div className="temperature-container">
        <span className="temperature-value">{roundedTemp}</span>
        <span className="temperature-unit">{unit}</span>
      </div>
    );
  };

  return (
    <div className="weathercard-container">
      <div className="location-weather-container">
        <div className="location-details">
          <p className="city-name">{name}</p>
          <p className="country-name">{location.region + ", " + country}</p>

          <div className="time-day">
            <p>{displayDate}</p>
          </div>
        </div>

        <p className="degree">{convertTemperature(avgtemp_c)}</p>

        <div className="icon-container">
          <div className="degree-buttons">
            <button
              onClick={() => setTemperatureUnit("C")}
              className={temperatureUnit === "C" ? "active" : ""}
            >
              °C
            </button>
            <button
              onClick={() => setTemperatureUnit("F")}
              className={temperatureUnit === "F" ? "active" : ""}
            >
              °F
            </button>
          </div>

          <img
            src={
              "https://" + forecast.forecastday[0].day.condition.icon.slice(2)
            }
            alt="img"
          />
        </div>
      </div>

      <div className="fullday-forecast-container">
        <div>Today Hourly Forecast</div>
        <Carousel
          items={(forecast.forecastday[0].hour || []).map((data, index) => (
            <div key={index} className="fullday-forecast">
              <p>{data.time.slice(10)}</p>
              <img src={"https://" + data.condition.icon.slice(2)} alt="img" />
              <p>{convertTemperature(data.temp_c)}</p>
            </div>
          ))}
        />
      </div>

      <div className="sevendays-forecast-container">
        <div>7 Day Forecast</div>
        {(pastSevenDays || []).map((data, index) => (
          <div key={index} className="sevenday-forecast">
            <p> {formatLocalTime(data.forecast.forecastday[0].date)}</p>

            <div className="icon-time">
              <img
                src={
                  "https://" +
                  data.forecast.forecastday[0].day.condition.icon.slice(2)
                }
                alt="img"
              />
              <p>
                {convertTemperature(data.forecast.forecastday[0].day.avgtemp_c)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherCard;
