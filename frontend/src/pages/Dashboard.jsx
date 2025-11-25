import { useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import { fromLonLat } from 'ol/proj';

export default function Dashboard() {
  const mapElementRef = useRef(null);
  const mapRef = useRef(null);
  const vectorSourceRef = useRef(new VectorSource());
  const [robots, setRobots] = useState([]);

  const BACKEND_PORT = import.meta.env.VITE_PORT_BACKEND;
  const WS_PORT = import.meta.env.VITE_PORT_WEBSOCKET;

  useEffect(() => {
    if (!mapRef.current && mapElementRef.current) {
      const vectorLayer = new VectorLayer({
        source: vectorSourceRef.current,
      });

      mapRef.current = new Map({
        target: mapElementRef.current,
        layers: [
          new TileLayer({ source: new OSM() }),
          vectorLayer,
        ],
        view: new View({
          center: fromLonLat([0, 0]),
          zoom: 2,
        }),
      });
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    async function fetchRobots() {
      try {
        const res = await fetch(`http://localhost:${BACKEND_PORT}/robots`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!res.ok) {
          console.error("GET /robots failed");
          return;
        }

        const data = await res.json();
        setRobots(data);
      } catch (err) {
        console.error("Error fetching robots:", err);
      }
    }

    fetchRobots();
  }, []);

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:${BACKEND_PORT}`);
    ws.onmessage = (msg) => {
      const updated = JSON.parse(msg.data);
      setRobots(updated);
    };
    return () => ws.close();
  }, []);

  useEffect(() => {
    if (!vectorSourceRef.current) return;

    vectorSourceRef.current.clear();
    robots.forEach((robot) => {
      const feature = new Feature({
        geometry: new Point(fromLonLat([parseFloat(robot.lon), parseFloat(robot.lat)])),
        name: robot.name,
      });

      feature.setStyle(
        new Style({
          image: new CircleStyle({
            radius: 7,
            fill: new Fill({ color: 'red' }),
            stroke: new Stroke({ color: 'black', width: 2 }),
          }),
        })
      );

      vectorSourceRef.current.addFeature(feature);
    });
  }, [robots]);

  return (
    <div style={{ position: 'relative', display: 'flex', gap: '20px' }}>
      <button
        onClick={() => {
          localStorage.removeItem('token');
          window.location.href = '/';
        }}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          padding: "6px 12px",
          fontSize: "12px",
          cursor: "pointer",
          background: "#eee",
          border: "1px solid #aaa",
          borderRadius: "4px"
        }}
      >
        Logout
      </button>
      <div
        ref={mapElementRef}
        style={{ width: '70vw', height: '80vh', border: '1px solid #ccc' }}
      ></div>

      <div style={{ width: '25vw' }}>
        <h3>Robots List</h3>
        <ul>
          {robots.map((r) => (
            <li key={r.id}>
              {r.name} - {r.status} - {r.lat.toFixed(4)}, {r.lon.toFixed(4)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
