import React, { useEffect, useState } from "react";
import { Map as LeafletMap, TileLayer, Polygon } from "react-leaflet";
import { GeoJson } from "../../types";
import { deleteGeoJson, getAllGeoJson, addGeoJson } from "../../utils/api";
import styles from "./style.module.css";
import ControlButtonGroup from "../ControlButtonGroup";
import { createPolygon, getDataPointPosition } from "../../utils/controls";

const Map = () => {
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

  const postNew = () => {
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
        postDeleteAndNew={postDeleteAndNew}
        geoJson={geoJson}
        selectedPolygons={selectedPolygons}
        toggleCanSetDataPoints={toggleCanSetDataPoints}
        createPolygon={postNew}
      />
    </div>
  );
};

export default Map;
