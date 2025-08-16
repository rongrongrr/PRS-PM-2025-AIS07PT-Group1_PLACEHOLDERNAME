import React, { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";

const ConditionInfoSection = ({ success, resultUrl, detections }) => {
  const [conditionInfo, setConditionInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    if (success && resultUrl && detections && detections.length > 0) {
      setLoading(true);
      setApiError("");
      const conditionName = detections[0].name;
      fetch(
        `http://localhost:8000/condition-info?name=${encodeURIComponent(
          conditionName
        )}`
      )
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch condition info");
          return res.json();
        })
        .then((data) => setConditionInfo(data))
        .catch(() =>
          setApiError(
            "Could not fetch condition information. Please try again later."
          )
        )
        .finally(() => setLoading(false));
    } else {
      setConditionInfo(null);
    }
  }, [success, resultUrl, detections]);

  return (
    <div className="bg-white rounded-xl shadow-xl p-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
        <AlertCircle className="mr-2 text-purple-600" size={20} />
        Condition Info
      </h2>
      {!success || !resultUrl ? (
        <div className="border-2 border-gray-200 rounded-xl p-6 text-center bg-gray-50">
          <div className="text-gray-400 mb-3">
            <AlertCircle size={32} className="mx-auto" />
          </div>
          <p className="text-sm font-medium text-gray-500 mb-1">
            No condition detected
          </p>
          <p className="text-sm text-gray-400 px-2">
            Complete analysis to see condition information
          </p>
        </div>
      ) : loading ? (
        <div className="text-center py-6">
          <span className="text-purple-600 text-sm">
            Loading condition info...
          </span>
        </div>
      ) : apiError ? (
        <div className="text-center py-6">
          <span className="text-red-600 text-sm">{apiError}</span>
        </div>
      ) : conditionInfo ? (
        <div className="space-y-3">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="font-semibold text-purple-800 mb-2 text-sm">
              Detected Condition
            </h3>
            <p className="text-purple-900 font-medium text-sm mb-2">
              {conditionInfo.fullname || detections[0].name}
            </p>
            <p className="text-purple-700 text-sm leading-relaxed">
              {conditionInfo.description}
            </p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <h4 className="font-medium text-green-800 text-sm mb-2">
              Common Symptoms:
            </h4>
            <ul className="text-green-700 text-sm space-y-1">
              {conditionInfo.symptoms && conditionInfo.symptoms.length > 0 ? (
                conditionInfo.symptoms.map((symptom, idx) => (
                  <li key={idx}>• {symptom}</li>
                ))
              ) : (
                <li>No symptoms listed.</li>
              )}
            </ul>
          </div>
        </div>
      ) : (
        <div className="text-center py-6">
          <span className="text-gray-600 text-sm">
            No information available.
          </span>
        </div>
      )}
    </div>
  );
};

export default ConditionInfoSection;
