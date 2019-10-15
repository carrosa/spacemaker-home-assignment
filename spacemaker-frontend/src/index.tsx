import React from "react";
import { render } from "react-dom";
import Map from "./components/Map";
import * as serviceWorker from "./serviceWorker";
import MapProvider from "./store/MapProvider";

function App() {
  return (
    <div>
      <MapProvider>
        <Map />
      </MapProvider>
    </div>
  );
}

render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
