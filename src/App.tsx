import { MapContainer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";
import "leaflet-compare/dist/leaflet-compare.css";
import "leaflet-compare/dist/leaflet-compare";
import { useEffect, useRef, useState } from "react";
import L from "leaflet";

function LeafletCompare({ show } : { show: boolean }) {
  const map = useMap();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const compareRef = useRef<any>(null);

  useEffect(() => {
    if (compareRef.current && compareRef.current !== undefined && compareRef.current !== null) {
      compareRef.current.remove();
      compareRef.current = null;
    }

    if (show) {
      map.createPane("left");
      map.createPane("right");

   

      const stamenLayer = L.tileLayer('https://tileserver.memomaps.de/tilegen/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: 'Map <a href="https://memomaps.de/">memomaps.de</a> <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        pane: "right"
      });

      const osmLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        pane: "left"
      });
      
      stamenLayer.addTo(map);
      osmLayer.addTo(map);
      // @ts-expect-error compare is not part of the types
      compareRef.current = L.control.compare([stamenLayer], [osmLayer]).addTo(map);
    }
  }, [map, show]);

  return null;
}

function App() {
  const [showCompare, setShowCompare] = useState(true);

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false} dragging={false} style={{ height: "100%", width: "100%" }}>
        
        <LeafletCompare key={"compare"} show={showCompare} />
        <button 
          style={{ position: 'absolute', top: 10, right: 10, zIndex: 1000 }} 
          onClick={() => setShowCompare(!showCompare)}
        >
          {showCompare ? "Esconder" : "Mostrar"} Comparador
        </button>
      </MapContainer>
    </div>
  );
}

export default App;
