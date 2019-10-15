import React from "react";
import {
  createGeoJsonObject,
  getCoordinatesFromGeoJson
} from "../../utils/controls";
import { intersect as turfIntersection, union as turfUnion } from "@turf/turf";
import { GeoJson } from "../../types";

type Props = {
  selectedPolygons: number[];
  toggleCanSetDataPoints(): void;
  createPolygon(): void;
  geoJson: GeoJson[];
  postDeleteAndNew(geoJson: GeoJson): void;
};

const ControlButtonGroup = ({
  selectedPolygons,
  toggleCanSetDataPoints,
  createPolygon,
  geoJson,
  postDeleteAndNew
}: Props) => {
  const intersect = (): void => {
    const coordinates = getCoordinatesFromGeoJson(selectedPolygons, geoJson);
    if (!coordinates) return;

    const intersection = turfIntersection(coordinates[0], coordinates[1]);
    if (!intersection) return;

    const geoJsonIntersection = createGeoJsonObject(intersection);

    postDeleteAndNew(geoJsonIntersection);
  };

  const union = (): void => {
    const coordinates = getCoordinatesFromGeoJson(selectedPolygons, geoJson);
    if (!coordinates) return;

    const union = turfUnion(coordinates[0], coordinates[1]);
    if (!union) return;

    const geoJsonUnion = createGeoJsonObject(union);
    // Set new polygons (geoJson)
    postDeleteAndNew(geoJsonUnion);
  };

  return (
    <div>
      <button onClick={intersect}>Intersect</button>
      <button onClick={union}>Union</button>
      <button onClick={toggleCanSetDataPoints}>Set Data Points</button>
      <button onClick={createPolygon}>Create Polygon</button>
    </div>
  );
};

export default ControlButtonGroup;
