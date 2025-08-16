import React, { useState, useRef } from "react";
import {
  Upload,
  Camera,
  X,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";

const SkinConditionAnalyzer = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [detections, setDetections] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB");
        return;
      }

      setSelectedFile(file);
      setError("");
      setSuccess(false);
      setResultUrl("");
      setDetections([]);

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setError("");
    setSuccess(false);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://localhost:8000/infer", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setResultUrl(`data:image/jpeg;base64,${data.image}`);
        setDetections(data.detections || []);
        setSuccess(true);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.error || "Failed to analyze image");
      }
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    setResultUrl("");
    setDetections([]);
    setError("");
    setSuccess(false);
    setIsLoading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4 sm:py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Skin Condition Analyzer
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 px-2">
            Upload an image to get AI-powered skin condition analysis
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Upload Section */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
              <Upload className="mr-2 text-blue-600" size={20} />
              Upload Image
            </h2>

            {!previewUrl ? (
              <div
                onClick={triggerFileSelect}
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 sm:p-12 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 active:bg-blue-100"
              >
                <Camera
                  size={32}
                  className="sm:w-12 sm:h-12 mx-auto text-gray-400 mb-3 sm:mb-4"
                />
                <p className="text-base sm:text-lg font-medium text-gray-600 mb-2">
                  Tap to upload an image
                </p>
                <p className="text-xs sm:text-sm text-gray-500 px-2">
                  Support: JPG, PNG, WebP (Max 10MB)
                </p>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-48 sm:h-56 lg:h-64 object-cover rounded-xl shadow-md"
                />
                <button
                  onClick={resetUpload}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 active:bg-red-700 transition-colors touch-manipulation"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileSelect}
              className="hidden"
            />

            {selectedFile && (
              <div className="mt-3 sm:mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs sm:text-sm text-gray-600 break-all">
                  <strong>File:</strong> {selectedFile.name}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">
                  <strong>Size:</strong>{" "}
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                onClick={handleUpload}
                disabled={!selectedFile || isLoading}
                className="flex-1 bg-blue-600 text-white py-3 sm:py-3 px-4 sm:px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center touch-manipulation active:bg-blue-800"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={20} />
                    Analyzing...
                  </>
                ) : (
                  "Analyze Image"
                )}
              </button>

              <button
                onClick={triggerFileSelect}
                disabled={!selectedFile}
                className={`bg-gray-200 text-gray-700 py-3 sm:py-3 px-4 sm:px-6 rounded-lg font-medium transition-colors touch-manipulation
                  ${
                    !selectedFile
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-300 active:bg-gray-400"
                  }`}
              >
                Change Image
              </button>
            </div>

            {/* Status Messages */}
            {error && (
              <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                <AlertCircle
                  className="text-red-500 mr-2 mt-0.5 flex-shrink-0"
                  size={16}
                />
                <p className="text-red-700 text-xs sm:text-sm">{error}</p>
              </div>
            )}

            {success && !error && (
              <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
                <CheckCircle
                  className="text-green-500 mr-2 flex-shrink-0"
                  size={16}
                />
                <p className="text-green-700 text-xs sm:text-sm">
                  Analysis completed successfully!
                </p>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 mt-4 lg:mt-0">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
              <Camera className="mr-2 text-green-600" size={20} />
              Analysis Results
            </h2>

            {!resultUrl ? (
              <div className="border-2 border-gray-200 rounded-xl p-8 sm:p-12 text-center bg-gray-50">
                <div className="text-gray-400 mb-3 sm:mb-4">
                  <Camera size={32} className="sm:w-12 sm:h-12 mx-auto" />
                </div>
                <p className="text-base sm:text-lg font-medium text-gray-500 mb-2">
                  No analysis yet
                </p>
                <p className="text-xs sm:text-sm text-gray-400 px-2">
                  Upload and analyze an image to see results here
                </p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {/* Detections */}
                {detections.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 mb-2">
                    <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">
                      Detected Conditions
                    </h3>
                    <ul className="text-gray-700 text-xs sm:text-sm">
                      {detections.map((det, idx) => (
                        <li key={idx} className="mb-1">
                          <strong>Name:</strong> {det.name},{" "}
                          <strong>Confidence:</strong>{" "}
                          {det.confidence.toFixed(2)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="relative">
                  <img
                    src={resultUrl}
                    alt="Analysis Result"
                    className="w-full h-48 sm:h-56 lg:h-64 object-cover rounded-xl shadow-md"
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                  <h3 className="font-semibold text-blue-800 mb-2 text-sm sm:text-base">
                    Analysis Information
                  </h3>
                  <p className="text-blue-700 text-xs sm:text-sm">
                    The analyzed image shows the AI model's detection and
                    classification results. Areas of interest have been
                    highlighted and annotated based on the trained model.
                  </p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
                  <h3 className="font-semibold text-yellow-800 mb-2 text-sm sm:text-base">
                    Important Disclaimer
                  </h3>
                  <p className="text-yellow-700 text-xs sm:text-sm">
                    This analysis is for informational purposes only and should
                    not replace professional medical advice. Please consult a
                    dermatologist for proper diagnosis.
                  </p>
                </div>

                <button
                  onClick={resetUpload}
                  className="w-full bg-gray-600 text-white py-3 px-4 sm:px-6 rounded-lg font-medium hover:bg-gray-700 active:bg-gray-800 transition-colors touch-manipulation"
                >
                  Analyze Another Image
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 sm:mt-8 text-gray-500 text-xs sm:text-sm px-4">
          <p>
            AI-powered skin condition analysis • Always consult healthcare
            professionals
          </p>
        </div>
      </div>
    </div>
  );
};

export default SkinConditionAnalyzer;
