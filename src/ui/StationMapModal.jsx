import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { X, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import SERVER_URL from "../Server/serverURL";
import "leaflet/dist/leaflet.css";

// Pulsing emerald marker (divIcon, no image assets needed)
const createStationIcon = () =>
  L.divIcon({
    className: "",
    html: `
      <div style="position:relative;width:20px;height:20px;">
        <div style="
          position:absolute;inset:0;
          background:#10b981;border-radius:50%;
          box-shadow:0 0 0 3px rgba(16,185,129,0.3);
        "></div>
        <div style="
          position:absolute;inset:0;
          background:#10b981;border-radius:50%;
          animation:pulseMarker 1.5s ease-out infinite;
        "></div>
      </div>
      <style>
        @keyframes pulseMarker {
          0% { transform:scale(1); opacity:0.7; }
          100% { transform:scale(2.8); opacity:0; }
        }
      </style>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });

// Fit map bounds to all station markers
const FitBounds = ({ stations }) => {
  const map = useMap();
  useEffect(() => {
    const valid = stations.filter(
      (s) => s?.location?.coordinates?.length === 2
    );
    if (valid.length === 0) return;

    if (valid.length === 1) {
      const [lon, lat] = valid[0].location.coordinates;
      map.setView([lat, lon], 13);
    } else {
      const bounds = L.latLngBounds(
        valid.map((s) => {
          const [lon, lat] = s.location.coordinates;
          return [lat, lon];
        })
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [stations, map]);
  return null;
};

const StationsMapModal = ({ stations = [], onClose }) => {
  const icon = createStationIcon();
  const validStations = stations.filter(
    (s) => s?.location?.coordinates?.length === 2
  );
  const defaultCenter = [20.5937, 78.9629]; // India fallback

  return (
    <div className="mb-8 rounded-lg overflow-hidden shadow-lg relative">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 z-[1000] bg-black/60 text-white p-1.5 rounded-full hover:bg-black/80"
      >
        <X size={20} />
      </button>

      <MapContainer
        center={defaultCenter}
        zoom={5}
        style={{ height: "480px", width: "100%", background: "#0a0a0a" }}
        zoomControl={true}
      >
        {/* Google hybrid tiles */}
        <TileLayer
          url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
          attribution="&copy; Google Maps"
          maxZoom={20}
        />

        <FitBounds stations={validStations} />

        {validStations.map((station) => {
          const [lon, lat] = station.location.coordinates;
          return (
            <Marker key={station._id} position={[lat, lon]} icon={icon}>
              <Popup>
                <div style={{ minWidth: 180 }}>
                  <img
                    src={station.image}
                    alt={station.stationName}
                    style={{
                      width: "100%",
                      height: 90,
                      objectFit: "cover",
                      borderRadius: 6,
                      marginBottom: 6,
                    }}
                  />
                  <p style={{ fontWeight: 600, marginBottom: 2 }}>
                    {station.stationName}
                  </p>
                  <p style={{ fontSize: 12, color: "#555", marginBottom: 6 }}>
                    <MapPin size={12} style={{ display: "inline" }} />{" "}
                    {station.city}, {station.state}
                  </p>
                  <p style={{ fontSize: 13, marginBottom: 6 }}>
                    ₹{station.pricePerHour}/hr
                  </p>
                  <Link to={`/${station._id}/view`}>
                    <button
                      style={{
                        background: "#059669",
                        color: "#fff",
                        border: "none",
                        padding: "6px 10px",
                        borderRadius: 6,
                        fontSize: 12,
                        cursor: "pointer",
                        width: "100%",
                      }}
                    >
                      Book Now
                    </button>
                  </Link>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default StationsMapModal;