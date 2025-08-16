import React from "react";
import { Camera } from "lucide-react";

const ResultsSection = ({
  resultUrl,
  detections,
  success,
  error,
  resetUpload,
  selectedFile,
}) => (
  <div className="bg-white rounded-xl shadow-xl p-4">
    <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
      <Camera className="mr-2 text-green-600" size={20} />
      Analysis Results
    </h2>
    {!resultUrl ? (
      <div className="border-2 border-gray-200 rounded-xl p-8 text-center bg-gray-50">
        <div className="text-gray-400 mb-3">
          <Camera size={32} className="mx-auto" />
        </div>
        <p className="text-base font-medium text-gray-500 mb-2">
          No analysis yet
        </p>
        <p className="text-sm text-gray-400 px-2">
          Upload and analyze an image to see results here
        </p>
      </div>
    ) : (
      <div className="space-y-3">
        {detections.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-3 mb-2">
            <h3 className="font-semibold text-gray-800 mb-2 text-sm">
              Detected Condition
            </h3>
            <ul className="text-gray-700 font-medium text-sm mb-2">
              {detections.map((det, idx) => (
                <li key={idx} className="mb-1">
                  <span className="font-semibold text-blue-900">
                    {det.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {detections.length > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <h4 className="font-medium text-orange-800 text-sm mb-2">
              Confidence Level:
            </h4>
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-orange-500 h-2 rounded-full"
                  style={{
                    width: `${Math.round(detections[0].confidence * 100)}%`,
                  }}
                ></div>
              </div>
              <span className="text-orange-700 text-sm font-medium">
                {Math.round(detections[0].confidence * 100)}%
              </span>
            </div>
          </div>
        )}

        <div className="relative">
          <img
            src={resultUrl}
            alt="Analysis Result"
            className="w-full h-48 sm:h-64 object-contain rounded-xl shadow-md"
            style={{ background: "#f3f4f6" }} // Optional: subtle background for transparency
          />
        </div>
        <button
          onClick={resetUpload}
          disabled={!selectedFile}
          className={`w-full bg-gray-600 text-white py-3 px-4 rounded-lg font-medium transition-colors
            ${
              !selectedFile
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-700 active:bg-gray-800"
            }`}
        >
          Analyze Another Image
        </button>
      </div>
    )}
  </div>
);

export default ResultsSection;
