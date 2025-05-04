"use client"

import { useEffect, useState, useRef } from "react"
import dynamic from "next/dynamic"
import { MapPin } from "lucide-react"
import L from "leaflet" // Import Leaflet

// Dynamically import Leaflet components with no SSR
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false })
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false })
const GeoJSON = dynamic(() => import("react-leaflet").then((mod) => mod.GeoJSON), { ssr: false })
const ZoomControl = dynamic(() => import("react-leaflet").then((mod) => mod.ZoomControl), { ssr: false })

const CountryMap = ({ country }) => {
  const [borders, setBorders] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [mapReady, setMapReady] = useState(false)
  const geoJsonRef = useRef(null)
  
  const capitalCoords = country.capitalInfo?.latlng || country.latlng
  const countryCoords = country.latlng

  useEffect(() => {
    // Import Leaflet CSS
    import('leaflet/dist/leaflet.css');
    
    // Fix for Leaflet in Next.js
    import("leaflet").then((L) => {
      // Fix for default marker icons in Leaflet with webpack
      delete L.Icon.Default.prototype._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
      })

      setMapReady(true)
    })
  }, [])

  // Fit map to GeoJSON bounds when data loads
  useEffect(() => {
    if (geoJsonRef.current && borders) {
      const map = geoJsonRef.current?._map;
      if (map) {
        try {
          // Try to fit the map to the GeoJSON bounds
          const bounds = geoJsonRef.current.getBounds();
          map.fitBounds(bounds, { padding: [20, 20] });
        } catch (e) {
          console.error("Error fitting to bounds:", e);
          // Fallback to center on country coordinates with default zoom
          if (countryCoords && countryCoords.length >= 2) {
            map.setView([countryCoords[0], countryCoords[1]], 5);
          }
        }
      }
    }
  }, [borders, countryCoords]);

  useEffect(() => {
    const fetchBorders = async () => {
      try {
        // Check if cca3 exists before making the request
        if (!country?.cca3) {
          setError("Missing country code required for borders");
          setLoading(false);
          return;
        }
        
        // Try different formats for the country code
        let data = null;
        let response = null;
        const formats = [
          country.cca3.toLowerCase(),           // lka
          country.cca2?.toLowerCase(),          // lk (if available)
          country.cioc?.toLowerCase()           // sri (if available)
        ].filter(Boolean); // Remove undefined/null values
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        // Try each format until one works
        for (const format of formats) {
          try {
            response = await fetch(
              `https://raw.githubusercontent.com/johan/world.geo.json/master/countries/${format}.geo.json`,
              { signal: controller.signal }
            );
            
            if (response.ok) {
              data = await response.json();
              break; // Exit the loop if successful
            }
          } catch (e) {
            // Continue to next format
            console.log(`Failed with format ${format}:`, e);
          }
        }
        
        clearTimeout(timeoutId);
        
        if (!data) {
          // If all formats failed, try the general countries collection
          try {
            response = await fetch(
              'https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json',
              { signal: controller.signal }
            );
            
            if (response.ok) {
              const allCountries = await response.json();
              // Find the country by matching properties
              const countryFeature = allCountries.features.find(
                f => f.properties.name === country.name.common || 
                    f.properties.iso_a3 === country.cca3
              );
              
              if (countryFeature) {
                data = {
                  type: "FeatureCollection",
                  features: [countryFeature]
                };
              }
            }
          } catch (e) {
            console.error("Failed to fetch from general collection:", e);
          }
        }
        
        if (data) {
          setBorders(data);
          setLoading(false);
        } else {
          // Create a simple polygon from latlng as fallback
          if (country.latlng && country.latlng.length >= 2) {
            const lat = country.latlng[0];
            const lng = country.latlng[1];
            // Create a simple polygon around the country center point
            const simpleGeoJSON = {
              type: "FeatureCollection",
              features: [{
                type: "Feature",
                properties: { name: country.name.common },
                geometry: {
                  type: "Point",
                  coordinates: [lng, lat]
                }
              }]
            };
            setBorders(simpleGeoJSON);
            setError("Using approximate location - detailed borders unavailable");
          } else {
            throw new Error("Couldn't find geographic data for this country");
          }
        }
      } catch (error) {
        console.error("Border fetch error:", error);
        setError("Could not load borders: " + error.message);
        setBorders([]); // Set empty borders to avoid blocking the map display
      } finally {
        setLoading(false);
      }
    };
  
    fetchBorders();
  }, [country]);

  // Style for the country polygon
  const countryStyle = {
    fillColor: "transparent",  // No fill color
    fillOpacity: 0,            // Completely transparent fill
    color: "transparent",      // Transparent border
    weight: 0,                 // No border weight
  }

  if (loading || !mapReady) {
    return (
      <div className="flex justify-center items-center h-96 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-96 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <div className="text-center">
          <MapPin className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
        </div>
      </div>
    )
  }

  // Custom marker icon
  const createCustomIcon = (L) => {
    return L.divIcon({
      html: `<div class="flex items-center justify-center w-8 h-8 bg-red-500 rounded-full border-2 border-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>`,
      className: "",
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    })
  }

  return (
    <div className="h-96 rounded-lg overflow-hidden shadow-lg relative">
      <style jsx global>{`
        .leaflet-container {
          height: 100%;
          width: 100%;
        }
      `}</style>

      {typeof window !== "undefined" && (
        <MapContainer 
          center={countryCoords} 
          zoom={4} 
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={true}
          zoomControl={false}
        >
          <ZoomControl position="topright" />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {borders && <GeoJSON 
            ref={geoJsonRef}
            data={borders} 
            style={countryStyle} 
          />}

          {capitalCoords && (
            <Marker position={[capitalCoords[0], capitalCoords[1]]} icon={createCustomIcon(L)}>
              <Popup>
                <div className="text-center">
                  <strong>{country.capital?.[0] || "Capital"}</strong>
                  <p>Capital of {country.name.common}</p>
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      )}
    </div>
  )
}

export default CountryMap