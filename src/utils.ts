import { getArea } from "ol/sphere";

/**
 * Format area output of a polygon
 */
export function formatArea(polygon) {
  const area = getArea(polygon);
  let output;
  if (area > 10000) {
    output = Math.round((area / 1000000) * 100) / 100 + " " + "km<sup>2</sup>";
  } else {
    output = Math.round(area * 100) / 100 + " " + "m<sup>2</sup>";
  }
  return output;
};
