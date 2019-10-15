type Geometry = {
  type: string;
  coordinates: any; // Has to be any to work with both turfPolygon and Leaflet's Polygon
};

type BaseGeoJson = {
  type: string;
  geometry: Geometry;
};

export type GeoJson = {
  geojson: BaseGeoJson;
  id: number;
};
