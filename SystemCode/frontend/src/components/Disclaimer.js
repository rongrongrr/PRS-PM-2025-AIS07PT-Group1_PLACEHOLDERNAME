import React from "react";
import { AlertCircle } from "lucide-react";

const Disclaimer = ({ onAccept }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 animate-in">
      <div className="p-6 sm:p-8">
        <div className="text-center mb-6">
          <div className="bg-yellow-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <AlertCircle className="text-yellow-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Medical Disclaimer
          </h2>
          <p className="text-sm text-gray-600">
            Please read and accept before proceeding.
          </p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="space-y-3 text-sm text-gray-700">
            <p className="font-medium text-gray-900">
              This AI-powered skin analysis tool is created and used for
              educational purposes only.
            </p>
            <div className="space-y-2">
              <p>
                • This analysis should <strong>NOT replace</strong> professional
                medical advice.
              </p>
              <p>
                • Results may not be 100% accurate and should be verified by a
                medical professional.
              </p>
              <p>
                • Please <strong>consult a dermatologist</strong> for proper
                diagnosis and treatment.
              </p>
              <p>
                • This tool is not intended to diagnose, treat, cure, or prevent
                any medical condition.
              </p>
            </div>
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
          <p className="text-red-800 text-sm font-medium text-center">
            For emergency skin conditions, please seek immediate medical
            attention.
          </p>
        </div>
        <div className="text-center">
          <button
            onClick={onAccept}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 active:bg-blue-800 transition-colors touch-manipulation w-full sm:w-auto"
          >
            I Understand & Accept
          </button>
        </div>
        <div className="text-center mt-4">
          <p className="text-sm text-gray-500">
            By continuing, you acknowledge that you have read and understood
            this disclaimer.
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default Disclaimer;
