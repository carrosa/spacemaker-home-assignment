import { GeoJson } from "../types";
import { polygon as turfPolygon } from "@turf/helpers";

export const getCoordinatesFromGeoJson = (
  selectedPolygons: any,
  geoJson: GeoJson[]
): any => {
  // Have to select 2 polygons
  if (selectedPolygons.length < 2) {
    alert("You have to select 2 polygons");
    return null;
  }
  // Map to turf polygon
  return geoJson
    .filter(gj => selectedPolygons.includes(gj.id))
    .map(gj => gj.geojson.geometry.coordinates)
    .map(coordinates => turfPolygon(coordinates));
};

export const createGeoJsonObject = (newGeoJson: any): any => {
  return {
    id: Math.random(),
    geojson: {
      type: newGeoJson.type,
      geometry: {
        type: newGeoJson.geometry.type,
        coordinates: newGeoJson.geometry.coordinates || newGeoJson
      }
    }
  };
};

export const createPolygon = (selectedDataPoints: number[][]): GeoJson => {
  if (selectedDataPoints.length < 3) {
    alert("you need to select atleast 3 data points");
    return {} as GeoJson;
  }
  return {
    id: -1, // -1 to know this doesnt have ID in DB
    geojson: {
      type: "Feature",
      geometry: {
        type: "Polygon",
        // Have to have the polygon end with same line as it started with
        coordinates: [[...selectedDataPoints, selectedDataPoints[0]]]
      }
    }
  };
};

export const getDataPointPosition = (
  event: any,
  selectedDataPoints: number[][],
  canSetDataPoints: boolean
): number[][] => {
  if (!canSetDataPoints) return [] as number[][]; //return if cannot set data points
  const lat: number = event.latlng.lat;
  const lng: number = event.latlng.lng;
  const latlng: number[] = [lat, lng];
  //setSelectedDataPoints([...selectedDataPoints, latlng]);
  return [...selectedDataPoints, latlng];
};
