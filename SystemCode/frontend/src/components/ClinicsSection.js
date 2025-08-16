import React, { useState } from "react";
import { MapPin } from "lucide-react";

const ClinicsSection = () => {
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const fetchClinics = (coords) => {
    setLoading(true);
    fetch(
      `http://localhost:8000/clinics?lat=${coords.latitude}&lng=${coords.longitude}`
    )
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setClinics(data))
      .catch(() => setClinics([]))
      .finally(() => setLoading(false));
  };

  const handleFindClinics = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setShowResults(true);
          fetchClinics(pos.coords);
        },
        () => {
          setShowResults(true);
          fetchClinics(null);
        }
      );
    } else {
      setShowResults(true);
      fetchClinics(null);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-xl p-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
        <MapPin className="mr-2 text-red-600" size={20} />
        Nearby Clinics
      </h2>
      {!showResults ? (
        <div className="flex flex-col items-center justify-center py-8">
          <button
            onClick={handleFindClinics}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 active:bg-blue-800 transition-colors"
          >
            Find clinics near me
          </button>
          <p className="text-xs text-gray-500 mt-2 text-center">
            This will use your current location to show nearby clinics.
          </p>
        </div>
      ) : loading ? (
        <div className="text-center py-8 text-blue-600 font-medium">
          Loading clinics...
        </div>
      ) : (
        <div
          className="space-y-3 overflow-y-auto"
          style={{ maxHeight: "320px" }}
        >
          {clinics.map((clinic, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-200 rounded-lg p-3 hover:border-red-300 hover:shadow-md transition-all"
            >
              <h3 className="font-semibold text-gray-800 text-sm">
                {clinic.name}
              </h3>
              <p className="text-gray-600 text-sm mb-2">{clinic.department}</p>
              <div className="flex items-center text-sm text-gray-500 mb-1">
                <MapPin size={12} className="mr-1" />
                <span>{clinic.address}</span>
              </div>
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <span>{clinic.rating}</span>
              </div>
              <button className="text-red-600 text-sm font-medium hover:text-red-700">
                View Details →
              </button>
            </div>
          ))}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
            <p className="text-blue-700 text-sm font-medium mb-1">
              Need more options?
            </p>
            <button className="text-blue-600 text-sm font-medium hover:text-blue-700 underline">
              Find More Clinics Near You
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClinicsSection;
