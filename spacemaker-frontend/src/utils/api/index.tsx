import axios from "axios";
import { GeoJson } from "../../types";

const API_BASE_URL = "http://localhost:8080";

const HEADERS = {
  Accept: "application/json",
  "Content-Type": "application/json"
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: HEADERS
});

export const postGeoJson = (geojson: GeoJson) => {
  return api
    .post("/geojson", {
      type: geojson.geojson.type,
      geometry: {
        type: geojson.geojson.geometry.type,
        coordinates: geojson.geojson.geometry.coordinates
      }
    })
    .then(res => {
      return {
        id: res.data.id,
        geojson: JSON.parse(res.data.geojson)
      };
    });
};

export const deleteGeoJson = (id: number) => {
  return api.post(`/geojson/${id}/`).then(res => Number(res.data.id));
};

export const getGeoJson = () => {
  return api.get("/geojson").then(res =>
    res.data.map((d: any) => {
      return {
        id: d.id,
        geojson: JSON.parse(d.geojson)
      };
    })
  );
};
