import React from "react";
import {
  Upload,
  Camera,
  X,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

const UploadSection = ({
  selectedFile,
  setSelectedFile,
  previewUrl,
  setPreviewUrl,
  fileInputRef,
  setError,
  setSuccess,
  setResultUrl,
  setDetections,
  isLoading,
  setIsLoading,
  error,
  success,
  resultUrl,
}) => {
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB");
        return;
      }
      setSelectedFile(file);
      setError("");
      setSuccess(false);
      setResultUrl("");
      setDetections([]);
      setPreviewUrl(URL.createObjectURL(file));
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

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    setResultUrl("");
    setDetections([]);
    setError("");
    setSuccess(false);
    setIsLoading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="bg-white rounded-xl shadow-xl p-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
        <Upload className="mr-2 text-blue-600" size={20} />
        Upload Image
      </h2>
      {!previewUrl ? (
        <div
          onClick={triggerFileSelect}
          className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 active:bg-blue-100"
        >
          <Camera size={32} className="mx-auto text-gray-400 mb-3" />
          <p className="text-base font-medium text-gray-600 mb-2">
            Tap to upload an image
          </p>
          <p className="text-sm text-gray-500 px-2">
            Support: JPG, PNG, WebP (Max 10MB)
          </p>
        </div>
      ) : (
        <div className="relative">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-48 sm:h-64 object-contain rounded-xl shadow-md"
            style={{ background: "#f3f4f6" }} // Optional
          />
          <button
            onClick={resetUpload}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 active:bg-red-700 transition-colors"
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
        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 break-all">
            <strong>File:</strong> {selectedFile.name}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Size:</strong>{" "}
            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>
      )}
      <div className="mt-4 flex flex-col sm:flex-row gap-2">
        <button
          onClick={handleUpload}
          disabled={!selectedFile || isLoading}
          className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center active:bg-blue-800"
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
          className={`bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors
            ${
              !selectedFile
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-300 active:bg-gray-400"
            }`}
        >
          Change Image
        </button>
      </div>
      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
          <AlertCircle
            className="text-red-500 mr-2 mt-0.5 flex-shrink-0"
            size={16}
          />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}
      {success && !error && (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center">
          <CheckCircle
            className="text-green-500 mr-2 flex-shrink-0"
            size={16}
          />
          <p className="text-green-700 text-sm">
            Analysis completed successfully!
          </p>
        </div>
      )}
    </div>
  );
};

export default UploadSection;
