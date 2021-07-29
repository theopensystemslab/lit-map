import { css, customElement, html, LitElement, property } from "lit-element";
import stylefunction from "ol-mapbox-style/dist/stylefunction";
import { MVT } from "ol/format";
import { Tile as TileLayer } from "ol/layer";
import VectorTileLayer from "ol/layer/VectorTile";
import Map from "ol/Map";
import { fromLonLat, transformExtent } from "ol/proj";
import { OSM, XYZ } from "ol/source";
import { ATTRIBUTION } from "ol/source/OSM";
import VectorTileSource from "ol/source/VectorTile";
import View from "ol/View";

// Ordnance Survey sources
const tileServiceUrl = `https://api.os.uk/maps/raster/v1/zxy/Light_3857/{z}/{x}/{y}.png?key=${import.meta.env.VITE_APP_ORDNANCE_SURVEY_KEY}`;
const vectorTileServiceUrl = `https://api.os.uk/maps/vector/v1/vts/tile/{z}/{y}/{x}.pbf?srs=3857&key=${import.meta.env.VITE_APP_ORDNANCE_SURVEY_KEY}`;
const vectorTileStyleUrl = `https://api.os.uk/maps/vector/v1/vts/resources/styles?srs=3857&key=${import.meta.env.VITE_APP_ORDNANCE_SURVEY_KEY}`;

@customElement("my-map")
export class MyMap extends LitElement {
  // default map size, can be overridden with CSS
  static styles = css`
    :host {
      display: block;
      width: 500px;
      height: 500px;
    }
  `;

  // configurable component properties
  @property({ type: Number })
  latitude = 51.507351;

  @property({ type: Number })
  longitude = -0.127758;

  @property({ type: Number })
  zoom = 10;

  @property({ type: Number })
  minZoom = 7;

  @property({ type: Number })
  maxZoom = 22;

  // runs after the initial render
  firstUpdated() {
    const target = this.shadowRoot!.querySelector("#map") as HTMLElement;

    const rasterBaseMap = new TileLayer({
      source: import.meta.env.VITE_APP_ORDNANCE_SURVEY_KEY
        ? new XYZ({
            url: tileServiceUrl,
            attributions: [
              "© Crown copyright and database rights 2021 OS (0)100019252",
            ],
            attributionsCollapsible: false,
            maxZoom: 20,
          })
        : // No OrdnanceSurvey key found, sign up for free here https://osdatahub.os.uk/plans
          new OSM({
            attributions: [ATTRIBUTION],
          }),
    });
    
    const osVectorTileBaseMap = new VectorTileLayer({
      declutter: true,
      source: new VectorTileSource({
        format: new MVT(),
        url: vectorTileServiceUrl,
        attributions: [
          "© Crown copyright and database rights 2021 OS (0)100019252",
        ],
        attributionsCollapsible: false,
      }),
    });
    
    // ref https://github.com/openlayers/ol-mapbox-style#usage-example
    fetch(vectorTileStyleUrl)
      .then((response) => response.json())
      .then((glStyle) => stylefunction(osVectorTileBaseMap, glStyle, "esri"))
      .catch((error) => console.log(error));

    new Map({
      target,
      layers: [import.meta.env.VITE_APP_ORDNANCE_SURVEY_KEY ? osVectorTileBaseMap : rasterBaseMap], // maybe a @property ENUM in future?
      view: new View({
        projection: "EPSG:3857",
        extent: transformExtent(
          // UK Boundary
          [-10.76418, 49.528423, 1.9134116, 61.331151],
          "EPSG:4326",
          "EPSG:3857"
        ),
        minZoom: this.minZoom,
        maxZoom: this.maxZoom,
        center: fromLonLat([this.longitude, this.latitude]),
        zoom: this.zoom,
      }),
    });
  }

  // render the map
  render() {
    return html`<link
        rel="stylesheet"
        href="https://cdn.skypack.dev/ol@^6.6.1/ol.css"
      />
      <div id="map" style="height: 100%" />`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "my-map": MyMap;
  }
}
