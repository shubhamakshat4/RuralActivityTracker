import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./GeographicalMap.css";

// 30 Odisha District Coordinates (Lat, Lng)
const ODISHA_DISTRICTS = {
  "Angul": { lat: 20.8407, lng: 85.1042 },
  "Balangir": { lat: 20.7107, lng: 83.4878 },
  "Balasore": { lat: 21.4934, lng: 86.9337 },
  "Baleshwar": { lat: 21.4934, lng: 86.9337 },
  "Bargarh": { lat: 21.3340, lng: 83.6230 },
  "Bhadrak": { lat: 21.0600, lng: 86.5000 },
  "Boudh": { lat: 20.8400, lng: 84.3200 },
  "Cuttack": { lat: 20.4625, lng: 85.8828 },
  "Deogarh": { lat: 21.5300, lng: 84.7300 },
  "Dhenkanal": { lat: 20.6700, lng: 85.6000 },
  "Gajapati": { lat: 18.8100, lng: 84.1600 },
  "Ganjam": { lat: 19.3800, lng: 85.0500 },
  "Jagatsinghpur": { lat: 20.2700, lng: 86.1700 },
  "Jajpur": { lat: 20.8500, lng: 86.3300 },
  "Jharsuguda": { lat: 21.8600, lng: 84.0000 },
  "Kalahandi": { lat: 19.9100, lng: 83.1600 },
  "Kandhamal": { lat: 20.2400, lng: 84.1400 },
  "Kendrapara": { lat: 20.5000, lng: 86.4200 },
  "Kendujhar": { lat: 21.6300, lng: 85.5800 },
  "Keonjhar": { lat: 21.6300, lng: 85.5800 },
  "Khordha": { lat: 20.2500, lng: 85.6200 },
  "Khurda": { lat: 20.2500, lng: 85.6200 },
  "Koraput": { lat: 18.8100, lng: 82.7100 },
  "Malkangiri": { lat: 18.3400, lng: 81.8800 },
  "Mayurbhanj": { lat: 21.9300, lng: 86.7300 },
  "Nabarangpur": { lat: 19.2300, lng: 82.5500 },
  "Nayagarh": { lat: 20.1300, lng: 85.1000 },
  "Nuapada": { lat: 20.8300, lng: 82.5200 },
  "Puri": { lat: 19.8135, lng: 85.8312 },
  "Rayagada": { lat: 19.1700, lng: 83.4200 },
  "Sambalpur": { lat: 21.4700, lng: 84.0000 },
  "Subarnapur": { lat: 20.8400, lng: 83.9200 },
  "Sonepur": { lat: 20.8400, lng: 83.9200 },
  "Sundargarh": { lat: 22.1200, lng: 84.0300 }
};

// Generate deterministic offset for unique placement of villages/entries
function getOffsetLocation(districtName, villageName, index) {
  const distKey = Object.keys(ODISHA_DISTRICTS).find(
    d => d.toLowerCase() === (districtName || "").toLowerCase().trim()
  );
  const base = distKey ? ODISHA_DISTRICTS[distKey] : { lat: 20.5, lng: 84.5 };
  
  let str = (villageName || "") + index;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const angle = (Math.abs(hash) % 360) * (Math.PI / 180);
  const radius = 0.02 + ((Math.abs(hash * 13) % 80) / 1000); // ~2 to 10 km spread

  return {
    lat: base.lat + Math.sin(angle) * radius,
    lng: base.lng + Math.cos(angle) * radius
  };
}

export default function GeographicalMap() {
  const navigate = useNavigate();
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);

  const [allSubmissions, setAllSubmissions] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedModule, setSelectedModule] = useState("ALL");
  const [selectedDistrict, setSelectedDistrict] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeItem, setActiveItem] = useState(null); // Modal popup detail

  // Check admin session
  useEffect(() => {
    const admin = localStorage.getItem("admin");
    if (!admin) {
      navigate("/admin-login");
    }
  }, [navigate]);

  // Fetch data across sheets
  const fetchSheetData = async (sheetId) => {
    try {
      const res = await fetch(`https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?sheet=Sheet1`);
      const text = await res.text();
      const json = JSON.parse(text.substring(47).slice(0, -2));
      return json.table.rows || [];
    } catch (err) {
      console.error("Error fetching sheet:", sheetId, err);
      return [];
    }
  };

  useEffect(() => {
    const loadAllSubmissions = async () => {
      setLoading(true);
      const nashaSheet = "1DMljlhLSzr656-vQeUgBlRMeZLc3HejpHq0gWy7Mts8";
      const modelVillageSheet = "1Ica9n20oQmcUHRaLDTbosQnfn3WQNZoqKt8D6hqR8Y0";
      const ssuActivitiesSheet = "1RgY8hXTIg6-f0pRoCOSzT4uOyfPmfkA9REmLJEXHAAI";

      const [nashaRows, modelVillageRows, ssuRows] = await Promise.all([
        fetchSheetData(nashaSheet),
        fetchSheetData(modelVillageSheet),
        fetchSheetData(ssuActivitiesSheet)
      ]);

      const parseRows = (rows, moduleName, color, iconSymbol) =>
        (rows || []).map((r, idx) => {
          const districtName = r.c[10]?.v || "";
          const villageName = r.c[14]?.v || "";
          const coords = getOffsetLocation(districtName, villageName, idx);

          return {
            id: `${moduleName}-${idx}`,
            module: moduleName,
            color,
            iconSymbol,
            name: r.c[0]?.v || "N/A",
            mobile: r.c[1]?.v?.toString() || "N/A",
            attendance: r.c[2]?.v || "N/A",
            program: r.c[3]?.v || "N/A",
            programStartDate: r.c[4]?.v || "N/A",
            programEndDate: r.c[5]?.v || "N/A",
            hoursPerDay: r.c[6]?.v || "N/A",
            totalHours: r.c[7]?.v || "N/A",
            stateName: r.c[8]?.v || "Odisha",
            districtName: districtName || "Odisha",
            subdistrictName: r.c[12]?.v || "",
            villageName: villageName || "",
            description: r.c[16]?.v || "",
            photos: r.c[17]?.v || "",
            videos: r.c[18]?.v || "",
            createdAt: r.c[19]?.v || "",
            lat: coords.lat,
            lng: coords.lng
          };
        });

      const parsed = [
        ...parseRows(ssuRows, "Sri Sri University Activities", "#611827", "🏛️"),
        ...parseRows(nashaRows, "Nasha Mukt Bharat Abhiyan", "#1d4ed8", "🚫"),
        ...parseRows(modelVillageRows, "Model Village Project", "#15803d", "🏡")
      ];

      setAllSubmissions(parsed);
      setFilteredData(parsed);
      setLoading(false);
    };

    loadAllSubmissions();
  }, []);

  // Filter Data
  useEffect(() => {
    let result = [...allSubmissions];

    if (selectedModule !== "ALL") {
      result = result.filter(item => item.module === selectedModule);
    }

    if (selectedDistrict !== "ALL") {
      result = result.filter(
        item => item.districtName.toLowerCase().trim() === selectedDistrict.toLowerCase().trim()
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        item =>
          item.program.toLowerCase().includes(q) ||
          item.villageName.toLowerCase().includes(q) ||
          item.districtName.toLowerCase().includes(q) ||
          item.name.toLowerCase().includes(q)
      );
    }

    setFilteredData(result);
  }, [selectedModule, selectedDistrict, searchQuery, allSubmissions]);

  // Initialize Map when container is ready
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      if (mapContainerRef.current._leaflet_id) {
        mapContainerRef.current._leaflet_id = null;
      }

      const map = L.map(mapContainerRef.current, {
        center: [20.5, 84.5],
        zoom: 7.5,
        zoomControl: true
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;

      // Force Leaflet to recalculate container size
      setTimeout(() => {
        map.invalidateSize();
      }, 200);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [loading]);

  // Render Markers on Map
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    const bounds = L.latLngBounds();

    filteredData.forEach(item => {
      bounds.extend([item.lat, item.lng]);

      const customIcon = L.divIcon({
        className: "custom-leaflet-marker",
        html: `<div style="
          background-color: ${item.color};
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 3px solid #ffffff;
          box-shadow: 0 4px 10px rgba(0,0,0,0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          cursor: pointer;
          transition: transform 0.2s ease;
        ">${item.iconSymbol}</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -18]
      });

      const popupContent = `
        <div style="font-family: inherit; width: 230px; padding: 4px;">
          <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: ${item.color}; margin-bottom: 4px;">
            ${item.module}
          </div>
          <h4 style="margin: 0 0 6px 0; font-size: 14px; color: #1e293b;">${item.program}</h4>
          <p style="margin: 3px 0; font-size: 12px; color: #475569;">
            <strong>📍 Location:</strong> ${item.villageName ? item.villageName + ', ' : ''}${item.districtName}
          </p>
          <p style="margin: 3px 0; font-size: 12px; color: #475569;">
            <strong>📅 Dates:</strong> ${item.programStartDate} to ${item.programEndDate}
          </p>
          <button id="view-details-${item.id}" style="
            margin-top: 10px;
            width: 100%;
            padding: 6px 12px;
            background-color: ${item.color};
            color: #ffffff;
            border: none;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
          ">View Full Details</button>
        </div>
      `;

      const marker = L.marker([item.lat, item.lng], { icon: customIcon });
      marker.bindPopup(popupContent);

      marker.on("popupopen", () => {
        const btn = document.getElementById(`view-details-${item.id}`);
        if (btn) {
          btn.onclick = () => setActiveItem(item);
        }
      });

      markersLayerRef.current.addLayer(marker);
    });

    if (filteredData.length > 0 && mapInstanceRef.current) {
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
      mapInstanceRef.current.invalidateSize();
    }
  }, [filteredData]);

  // Unique Districts list
  const districtList = Object.keys(ODISHA_DISTRICTS).sort();

  return (
    <div className="geoMapPage">
      {/* Top Header */}
      <div className="geoHeader">
        <div className="headerLeft">
          <button className="backBtn" onClick={() => navigate("/admin-panel")}>
            ← Back to Admin Panel
          </button>
          <h2>🗺️ Geographical Mapping of Activities</h2>
          <p>Interactive tracking across Odisha districts and villages</p>
        </div>

        {/* Quick Metrics */}
        <div className="metricsBar">
          <div className="metricCard">
            <span className="metricVal">{filteredData.length}</span>
            <span className="metricLabel">Activities Shown</span>
          </div>
          <div className="metricCard">
            <span className="metricVal">
              {new Set(filteredData.map(i => i.districtName)).size}
            </span>
            <span className="metricLabel">Districts Covered</span>
          </div>
          <div className="metricCard">
            <span className="metricVal">
              {new Set(filteredData.map(i => i.villageName).filter(Boolean)).size}
            </span>
            <span className="metricLabel">Villages Reached</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filterStrip">
        <div className="filterGroup">
          <label>Module / Project:</label>
          <select value={selectedModule} onChange={e => setSelectedModule(e.target.value)}>
            <option value="ALL">All Modules</option>
            <option value="Sri Sri University Activities">Sri Sri University Activities</option>
            <option value="Nasha Mukt Bharat Abhiyan">Nasha Mukt Bharat Abhiyan</option>
            <option value="Model Village Project">Model Village Project</option>
          </select>
        </div>

        <div className="filterGroup">
          <label>District:</label>
          <select value={selectedDistrict} onChange={e => setSelectedDistrict(e.target.value)}>
            <option value="ALL">All Odisha Districts</option>
            {districtList.map(dist => (
              <option key={dist} value={dist}>{dist}</option>
            ))}
          </select>
        </div>

        <div className="filterGroup searchGroup">
          <label>Search:</label>
          <input
            type="text"
            placeholder="Search village, program, or name..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Main Map Container */}
      <div className="mapWrapper">
        {loading && (
          <div className="mapLoader">
            <div className="spinner"></div>
            <p>Loading activity data across Odisha...</p>
          </div>
        )}
        <div ref={mapContainerRef} className="leafletMap"></div>
      </div>

      {/* Map Legend */}
      <div className="mapLegend">
        <h4>Legend</h4>
        <div className="legendItem">
          <span className="dot" style={{ backgroundColor: "#611827" }}></span> SSU Activities
        </div>
        <div className="legendItem">
          <span className="dot" style={{ backgroundColor: "#1d4ed8" }}></span> Nasha Mukt Bharat
        </div>
        <div className="legendItem">
          <span className="dot" style={{ backgroundColor: "#15803d" }}></span> Model Village
        </div>
      </div>

      {/* Full Detail Modal */}
      {activeItem && (
        <div className="modalOverlay" onClick={() => setActiveItem(null)}>
          <div className="modalCard" onClick={e => e.stopPropagation()}>
            <div className="modalHeader" style={{ borderLeft: `6px solid ${activeItem.color}` }}>
              <div>
                <span className="modalTag" style={{ backgroundColor: activeItem.color }}>
                  {activeItem.module}
                </span>
                <h3>{activeItem.program}</h3>
              </div>
              <button className="closeModalBtn" onClick={() => setActiveItem(null)}>×</button>
            </div>

            <div className="modalBody">
              <div className="infoGrid">
                <div className="infoTile">
                  <label>Submitter Name</label>
                  <span>{activeItem.name}</span>
                </div>
                <div className="infoTile">
                  <label>Mobile Number</label>
                  <span>{activeItem.mobile}</span>
                </div>
                <div className="infoTile">
                  <label>District</label>
                  <span>{activeItem.districtName}</span>
                </div>
                <div className="infoTile">
                  <label>Subdistrict / Village</label>
                  <span>
                    {activeItem.subdistrictName ? `${activeItem.subdistrictName} / ` : ""}
                    {activeItem.villageName || "N/A"}
                  </span>
                </div>
                <div className="infoTile">
                  <label>Program Dates</label>
                  <span>{activeItem.programStartDate} to {activeItem.programEndDate}</span>
                </div>
                <div className="infoTile">
                  <label>Hours / Attendance</label>
                  <span>{activeItem.hoursPerDay} hrs/day ({activeItem.totalHours} hrs) | {activeItem.attendance} Attendees</span>
                </div>
              </div>

              {activeItem.description && (
                <div className="descBox">
                  <label>Activity Description:</label>
                  <p>{activeItem.description}</p>
                </div>
              )}

              {/* Photos & Videos Section */}
              <div className="mediaSection">
                {activeItem.photos && (
                  <div className="mediaBlock">
                    <h4>Photos</h4>
                    <div className="mediaLinks">
                      {activeItem.photos.split(",").map((link, idx) => {
                        const clean = link.trim();
                        if (!clean) return null;
                        return (
                          <a key={idx} href={clean} target="_blank" rel="noreferrer" className="mediaBtn photoBtn">
                            📷 Photo {idx + 1}
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}

                {activeItem.videos && (
                  <div className="mediaBlock">
                    <h4>Videos</h4>
                    <div className="mediaLinks">
                      {activeItem.videos.split(",").map((link, idx) => {
                        const clean = link.trim();
                        if (!clean) return null;
                        return (
                          <a key={idx} href={clean} target="_blank" rel="noreferrer" className="mediaBtn videoBtn">
                            🎥 Video {idx + 1}
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="modalFooter">
              <button onClick={() => setActiveItem(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
