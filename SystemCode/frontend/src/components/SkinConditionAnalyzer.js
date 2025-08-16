import React, { useState, useRef } from "react";
import UploadSection from "./UploadSection";
import ResultsSection from "./ResultsSection";
import ConditionInfoSection from "./ConditionInfoSection";
import ClinicsSection from "./ClinicsSection";
import Footer from "./Footer";
import Disclaimer from "./Disclaimer";

const SkinConditionAnalyzer = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [detections, setDetections] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  const acceptDisclaimer = () => {
    setShowDisclaimer(false);
  };
  const fileInputRef = useRef(null);

  return (
    <>
      {showDisclaimer && <Disclaimer onAccept={acceptDisclaimer} />}
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4 sm:py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              Skin Condition Analyzer
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 px-2">
              Upload an image to get AI-powered skin condition analysis
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-4 lg:gap-6">
            <UploadSection
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
              previewUrl={previewUrl}
              setPreviewUrl={setPreviewUrl}
              fileInputRef={fileInputRef}
              setError={setError}
              setSuccess={setSuccess}
              setResultUrl={setResultUrl}
              setDetections={setDetections}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              error={error}
              success={success}
              resultUrl={resultUrl}
            />
            <ResultsSection
              resultUrl={resultUrl}
              detections={detections}
              success={success}
              error={error}
              resetUpload={() => {
                setSelectedFile(null);
                setPreviewUrl("");
                setResultUrl("");
                setDetections([]);
                setError("");
                setSuccess(false);
                setIsLoading(false);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              selectedFile={selectedFile}
            />
            <div className="flex flex-col gap-4">
              <ConditionInfoSection
                success={success}
                resultUrl={resultUrl}
                detections={detections}
              />
              <ClinicsSection />
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default SkinConditionAnalyzer;
