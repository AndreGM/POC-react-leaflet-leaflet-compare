import { MapContainer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";
import "leaflet-compare/dist/leaflet-compare.css";
import "leaflet-compare/dist/leaflet-compare";
import { useEffect, useRef, useState } from "react";
import L from "leaflet";

function LeafletCompare({ show }: { show: boolean }) {
  const map = useMap();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const compareRef = useRef<any>(null);

  useEffect(() => {
    if (
      compareRef.current &&
      compareRef.current !== undefined &&
      compareRef.current !== null
    ) {
      compareRef.current.remove();
      compareRef.current = null;
    }
    
    if (show) {

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

      map.createPane("left");
      map.createPane("right");

      const wmsLayer1 = L.tileLayer.wms(
        "https://datageo.ambiente.sp.gov.br/geoserver/datageo/wms?",
        {
          layers: "datageo:IGR2024",
          format: "image/png",
          transparent: true,
          attribution: "DataGEO",
          pane: "left",
        }
      );

      const wmsLayer2 = L.tileLayer.wms(
        "https://datageo.ambiente.sp.gov.br/geoserver/datageo/wms?",
        {
          layers: "datageo:IGR2023",
          format: "image/png",
          transparent: true,
          attribution: "DataGEO",
          pane: "right",
        }
      );

      wmsLayer1.addTo(map);
      wmsLayer2.addTo(map);

      // @ts-expect-error compare is not part of the types
      compareRef.current = L.control.compare([wmsLayer1], [wmsLayer2]).addTo(map);
    }
    else{
      map.eachLayer((layer) => {
        if (layer.options.pane === "left" || layer.options.pane === "right") {
          map.removeLayer(layer);

    }
  });
    }
  }, [map, show]);

  return null;
}

function App() {
  const [showCompare, setShowCompare] = useState(true);

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <MapContainer
        center={[-23, -46]}
        zoom={7}
        scrollWheelZoom={false}
        dragging={false}
        style={{ height: "100%", width: "100%" }}
      >
        <LeafletCompare key={"compare"} show={showCompare} />
        <button
          style={{ position: "absolute", top: 10, right: 10, zIndex: 1000 }}
          onClick={() => setShowCompare(!showCompare)}
        >
          {showCompare ? "Esconder" : "Mostrar"} Comparador
        </button>
      </MapContainer>
    </div>
  );
}

export default App;
