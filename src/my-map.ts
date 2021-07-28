import { css, customElement, html, LitElement, property } from "lit-element";
import TileLayer from "ol/layer/Tile";
import Map from "ol/Map";
import { fromLonLat, transformExtent } from "ol/proj";
import OSM from "ol/source/OSM";
import View from "ol/View";

@customElement("my-map")
export class MyMap extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 500px;
      height: 500px;
    }
  `;

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

  firstUpdated() {
    const target = this.shadowRoot!.querySelector("#map") as HTMLElement;

    new Map({
      target,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
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

  render() {
    return html`<link
        rel="stylesheet"
        href="https://cdn.skypack.dev/ol/ol.css"
      />
      <div id="map" style="height: 100%" />`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "my-map": MyMap;
  }
}
