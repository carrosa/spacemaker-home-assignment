import React from "react";

type Props = {
  intersect(): void;
  union(): void;
  setCanSetDataPoints(): void;
  createPolygon(): void;
};

const ControlButtonGroup = ({
  intersect,
  union,
  setCanSetDataPoints,
  createPolygon
}: Props) => {
  return (
    <div>
      <button onClick={intersect}>Intersect</button>
      <button onClick={union}>Union</button>
      <button onClick={setCanSetDataPoints}>Set Data Points</button>
      <button onClick={createPolygon}>Create Polygon</button>
    </div>
  );
};

export default ControlButtonGroup;
