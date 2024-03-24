import { config } from "./config";

export const fetchCurrentLocation = async () => {
  const response = await fetch(config.CURRENT_LOCATION_FETCH_API);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export const fetchWeatherData = async ({ queryKey }) => {
  const [_key, { location }] = queryKey;
  const apiKey = config.WEATHER_API_KEY;
  const currentDate = new Date().toISOString().split("T")[0];
  const response = await fetch(
    `${config.WEATHER_API_END_POINT}?key=${apiKey}&q=${location}&dt=${currentDate}`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export const fetchPastSevenDaysWeather = async (location) => {
  const apiKey = config.WEATHER_API_KEY;
  let dates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split("T")[0]);
  }

  const requests = dates.map((date) =>
    fetch(
      `${config.WEATHER_API_END_POINT}?key=${apiKey}&q=${location}&dt=${date}`
    )
  );

  const responses = await Promise.all(requests);
  const data = await Promise.all(
    responses.map((response) => {
      if (!response.ok) {
        throw new Error("Error fetching weather data. Please try again.");
      }
      return response.json();
    })
  );

  return data;
};
