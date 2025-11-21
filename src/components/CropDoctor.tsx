import React, { useState, useRef } from 'react';
import { Camera, Upload, CheckCircle, AlertTriangle, X } from 'lucide-react';
import { Button } from './Button';
import { analyzeCropImage } from '../services/geminiService';
import { CropAnalysisResult, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface CropDoctorProps {
  lang: Language;
}

export const CropDoctor: React.FC<CropDoctorProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<CropAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImage(base64);
        // Clear previous analysis when new image is loaded
        setAnalysis(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Strip base64 prefix if present for the API call
      const base64Data = image.split(',')[1];
      const result = await analyzeCropImage(base64Data, lang);
      setAnalysis(result);
    } catch (err) {
      setError(t.error_api);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setImage(null);
    setAnalysis(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="animate-fade-in space-y-6 pb-24">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold text-forest dark:text-cream">{t.scan}</h2>
      </div>

      {!image ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-forest/30 dark:border-lime/30 rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-forest/5 dark:hover:bg-forest-light/10 transition-colors h-64 bg-white dark:bg-forest-dark/50"
        >
          <div className="bg-lime/20 p-4 rounded-full mb-4">
             <Camera className="text-forest dark:text-lime h-8 w-8" />
          </div>
          <p className="text-lg font-medium text-forest dark:text-cream">{t.upload_t}</p>
          <p className="text-sm text-gray-500 mt-2">Supports JPG, PNG</p>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
        </div>
      ) : (
        <div className="relative rounded-2xl overflow-hidden shadow-xl bg-black">
          <img src={image} alt="Crop" className="w-full h-64 object-cover opacity-90" />
          <button 
            onClick={handleReset}
            className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 backdrop-blur-sm"
          >
            <X size={20} />
          </button>
        </div>
      )}

      {image && !analysis && (
        <Button 
          onClick={handleAnalyze} 
          isLoading={loading}
          className="w-full text-lg"
          variant="primary"
        >
           {loading ? t.analyzing : "Analyze Health"}
        </Button>
      )}

      {error && (
        <div className="p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-200 rounded-xl border border-red-200 dark:border-red-800">
          {error}
        </div>
      )}

      {analysis && (
        <div className="bg-white dark:bg-forest-light/20 p-6 rounded-2xl shadow-sm border border-forest/10 dark:border-lime/10 animate-fade-in">
          <div className="flex items-start gap-4 mb-4">
            {analysis.healthy ? (
              <CheckCircle className="text-lime w-8 h-8 flex-shrink-0" />
            ) : (
              <AlertTriangle className="text-amber-500 w-8 h-8 flex-shrink-0" />
            )}
            <div>
              <h3 className="text-xl font-bold text-forest dark:text-cream">
                {analysis.diagnosis}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${analysis.healthy ? 'bg-lime' : 'bg-amber-500'}`} 
                    style={{ width: `${analysis.confidence}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500">{analysis.confidence}% {t.confidence}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-cream dark:bg-forest-dark/50 p-4 rounded-xl">
            <h4 className="font-semibold text-forest dark:text-lime mb-2 text-sm uppercase tracking-wider">
              {t.treatment}
            </h4>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {analysis.treatment}
            </p>
          </div>

          <div className="mt-6 flex gap-3">
             <Button variant="secondary" className="flex-1 text-sm">Save Report</Button>
             <Button variant="outline" className="flex-1 text-sm">Ask Expert</Button>
          </div>
        </div>
      )}
    </div>
  );
};