import React, { useContext, useEffect, useState } from "react";
import { Map as LeafletMap, TileLayer, Polygon } from "react-leaflet";
import { GeoJson } from "../../types";
import { deleteGeoJson, getAllGeoJson, addGeoJson } from "../../utils/api";
import styles from "./style.module.css";
import ControlButtonGroup from "../ControlButtonGroup";
import {
  createPolygon,
  getDataPointPosition
} from "../../utils/polygon-creation";
import { MapContext } from "../../store/MapProvider";

const Map = () => {
  const {
    selectedDataPoints,
    setSelectedDataPoints,
    canSetDataPoints,
    polygons
  } = useContext(MapContext);

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
      <ControlButtonGroup />
    </div>
  );
};

export default Map;
