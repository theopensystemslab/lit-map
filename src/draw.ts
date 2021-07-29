import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";

const redLineStroke = new Stroke({
  color: "#ff0000",
  width: 3,
});

export const drawingSource = new VectorSource();

export const drawingLayer = new VectorLayer({
  source: drawingSource,
  style: new Style({
    fill: new Fill({
      color: "rgba(255, 255, 255, 0.2)",
    }),
    stroke: redLineStroke,
    image: new CircleStyle({
      radius: 5,
      fill: new Fill({
        color: "#c7ea46",
      }),
    }),
  }),
});
