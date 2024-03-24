import React, { useEffect, useState } from "react";
import moment from "moment-timezone";
import Carousel from "./Carousel";

const WeatherCard = ({ weatherData, pastSevenDays }) => {
  const { location, forecast } = weatherData;
  const { name, country } = location;
  const { avgtemp_c, maxtemp_c, mintemp_c } = forecast.forecastday[0].day;
  const [displayDate, setDisplayDate] = useState("");

  const getCurrentDatetimeString = () => {
    const timeZone = location.tz_id;
    const format = "ddd,DD/MM/YYYY, HH:mm";
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
          <p className="time-day">{displayDate}</p>
        </div>

        <div className="icon-container">
          <button
            onClick={() =>
              setTemperatureUnit(temperatureUnit === "C" ? "F" : "C")
            }
            className="degree-button"
          >
            °{temperatureUnit}
          </button>

          <div className="today-weather">
            <p className="degree">{convertTemperature(avgtemp_c)}</p>

            <div className="min-max">
              <span className="max-temp">
                High: {convertTemperature(maxtemp_c)}
              </span>
              <span className="min-temp">
                Low: {convertTemperature(mintemp_c)}
              </span>
            </div>
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
        <div>Hourly forecast</div>
        <Carousel>
          {(forecast.forecastday[0].hour || []).map((data, index) => (
            <div key={index} className="fullday-forecast">
              <p>{data.time.slice(10)}</p>
              <img src={"https://" + data.condition.icon.slice(2)} alt="img" />
              <p>{convertTemperature(data.temp_c)}</p>
            </div>
          ))}
        </Carousel>
      </div>

      <div className="sevendays-forecast-container">
        <p>7-day forecast</p>
        <div className="slider-content">
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
                  {convertTemperature(
                    data.forecast.forecastday[0].day.avgtemp_c
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
