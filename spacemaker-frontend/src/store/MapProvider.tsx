import React, { createContext, useEffect, useState } from "react";
import { GeoJson } from "../types";
import { Polygon } from "react-leaflet";
import { addGeoJson, deleteGeoJson, getAllGeoJson } from "../utils/api";
import { createPolygon } from "../utils/polygon-creation";

export const MapContext = createContext({
  geoJson: [] as GeoJson[],
  polygons: [] as any,
  selectedPolygons: [] as number[],
  canSetDataPoints: false,
  selectedDataPoints: [] as number[][],

  setSelectedDataPoints(dataPoints: number[][]) {},
  generatePolygons(selectedPolygons: number[]) {},
  postNewPolygon() {},
  postDeleteAndNew(geoJson: GeoJson) {},
  toggleCanSetDataPoints() {}
});

export const MapProvider: React.FC = ({ children }) => {
  const [geoJson, setGeoJson] = useState<GeoJson[]>([]);
  const [polygons, setPolygons] = useState();
  const [selectedPolygons, setSelectedPolygons] = useState<number[]>([]);
  const [canSetDataPoints, setCanSetDataPoints] = useState<boolean>(false);
  const [selectedDataPoints, setSelectedDataPoints] = useState<number[][]>([]);

  useEffect(() => {
    getAllGeoJson().then(setGeoJson);
    /*getGeoJson().then(data => setGeoJson(data.features));*/
  }, []);

  useEffect(() => {
    generatePolygons();
  }, [geoJson]);

  useEffect(() => {
    // Set color of selected/unselected polygons
    generatePolygons();
  }, [selectedPolygons]);

  const selectPolygon = (index: number) => {
    // Filter away if pressed again or length is greater than 2
    if (selectedPolygons.includes(index)) {
      setSelectedPolygons(selectedPolygons.filter(i => i !== index));
    } else if (selectedPolygons.length > 1) {
      // Set in place of first selected polygon
      setSelectedPolygons([index, selectedPolygons[1]]);
    } else {
      setSelectedPolygons(selectedPolygons => [...selectedPolygons, index]);
    }
  };

  const generatePolygons = () => {
    setPolygons(
      geoJson.map(gj => {
        return (
          <Polygon
            key={gj.id}
            onClick={() => selectPolygon(gj.id)}
            positions={gj.geojson.geometry.coordinates}
            color={selectedPolygons.includes(gj.id) ? "red" : "blue"}
          />
        );
      })
    );
  };

  const postNewPolygon = () => {
    addGeoJson(createPolygon(selectedDataPoints))
      .then(data => setGeoJson([...geoJson, data]))
      .then(() => {
        setSelectedDataPoints([]);
        setCanSetDataPoints(false);
      });
  };

  const postDeleteAndNew = (newGeoJson: GeoJson) => {
    addGeoJson(newGeoJson)
      .then(data => {
        setGeoJson([...geoJson, data]);
      })
      .then(() => {
        selectedPolygons.forEach(selectedPolygon =>
          deleteGeoJson(selectedPolygon)
        );
      })
      .then(() =>
        setGeoJson([
          ...geoJson.filter(gj => !selectedPolygons.includes(gj.id)),
          newGeoJson
        ])
      )
      .then(() => setSelectedPolygons([]));
  };

  const toggleCanSetDataPoints = () => {
    alert("Choose at least 3 datapoints (click on the map)");
    setCanSetDataPoints(!canSetDataPoints);
  };

  return (
    <MapContext.Provider
      value={{
        geoJson,
        polygons,
        selectedPolygons,
        canSetDataPoints,
        selectedDataPoints,

        setSelectedDataPoints,
        generatePolygons,
        postNewPolygon,
        postDeleteAndNew,
        toggleCanSetDataPoints
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

export default MapProvider;
