import React, { SyntheticEvent, useEffect, useState } from "react";
import { Map as LeafletMap, TileLayer, GeoJSON, Polygon } from "react-leaflet";
import {
  polygon as turfPolygon,
  intersect as turfIntersection,
  union as turfUnion
} from "@turf/turf";
import { GeoJson } from "../../types";
import { deleteGeoJson, getGeoJson, postGeoJson } from "../../utils/api";
import styles from "./style.module.css";
import ControlButtonGroup from "../ControlButtonGroup";
import {
  createGeoJsonObject,
  createPolygon,
  getCoordinatesFromGeoJson,
  getDataPointPosition
} from "../../utils/controls";

const Map = () => {
  const [geoJson, setGeoJson] = useState<GeoJson[]>([]);
  const [polygons, setPolygons] = useState();
  const [selectedPolygons, setSelectedPolygons] = useState<number[]>([]);
  const [canSetDataPoints, setCanSetDataPoints] = useState<boolean>(false);
  const [selectedDataPoints, setSelectedDataPoints] = useState<number[][]>([]);

  useEffect(() => {
    getGeoJson().then(setGeoJson);
    /*getGeoJson().then(data => setGeoJson(data.features));*/
  }, []);

  useEffect(() => {
    generatePolygons(selectedPolygons);
  }, [geoJson]);

  useEffect(() => {
    // Set color of selected/unselected polygons
    generatePolygons(selectedPolygons);
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

  const generatePolygons = (selectedPolygons: number[]) => {
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

  const postNew = () => {
    postGeoJson(createPolygon(selectedDataPoints))
      .then(data => setGeoJson([...geoJson, data]))
      .then(() => {
        setSelectedDataPoints([]);
        setCanSetDataPoints(false);
      });
  };

  const postDeleteAndNew = (newGeoJson: GeoJson) => {
    postGeoJson(newGeoJson)
      .then(data => {
        console.log(data);
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

  const toggleCanSetDataPoints = () => {
    alert("Choose at least 3 datapoints (click on the map)");
    setCanSetDataPoints(!canSetDataPoints);
  };

  return (
    <div>
      <LeafletMap
        onClick={(e: any) =>
          setSelectedDataPoints(
            getDataPointPosition(e, selectedDataPoints, canSetDataPoints)
          )
        }
        className={styles.map}
        center={[63.430515, 10.395053]}
        zoom={15}
        maxZoom={17}
        attributionControl={true}
        zoomControl={true}
        doubleClickZoom={false}
        scrollWheelZoom={true}
        dragging={true}
        animate={true}
        easeLinearity={0.35}
      >
        <TileLayer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png" />
        {polygons}
      </LeafletMap>
      <ControlButtonGroup
        intersect={intersect}
        union={union}
        setCanSetDataPoints={toggleCanSetDataPoints}
        createPolygon={postNew}
      />
    </div>
  );
};

export default Map;
