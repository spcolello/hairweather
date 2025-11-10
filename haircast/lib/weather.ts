import * as Location from "expo-location";
import { Weather } from "./types";


export async function getGPSLatLon() {
const { status } = await Location.requestForegroundPermissionsAsync();
if (status !== "granted") return null;
const { coords } = await Location.getCurrentPositionAsync({});
return { lat: coords.latitude, lon: coords.longitude };
}


export async function geocodeCity(city: string) {
const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`;
const r = await fetch(url);
const j = await r.json();
const hit = j?.results?.[0];
if (!hit) return null;
return { lat: hit.latitude as number, lon: hit.longitude as number, label: `${hit.name}, ${hit.admin1 ?? hit.country}` };
}


export async function fetchCurrent(lat: number, lon: number): Promise<Weather> {
const params = new URLSearchParams({
latitude: String(lat),
longitude: String(lon),
current: [
"temperature_2m",
"relative_humidity_2m",
"wind_speed_10m",
"precipitation",
"dew_point_2m",
"uv_index"
].join(","),
});
const r = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`);
const j = await r.json();
const cur = j.current;
const precipType = (cur.precipitation ?? 0) > 0 ? "rain" : "none";
const wx: Weather = {
tempC: cur.temperature_2m ?? 0,
humidity: cur.relative_humidity_2m ?? 0,
windKph: (cur.wind_speed_10m ?? 0) * 1.60934,
precipitation: precipType,
uvIndex: cur.uv_index ?? 0,
dewPointC: cur.dew_point_2m ?? 0,
description: `${Math.round(cur.relative_humidity_2m)}% humidity, ${Math.round(cur.temperature_2m)}°C, ${Math.round(((cur.wind_speed_10m ?? 0) * 1.60934))} kph wind, ${precipType}`,
};
return wx;
}