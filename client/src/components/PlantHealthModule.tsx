import { useState, useEffect, useRef } from 'react';
import { Camera, Trash2, CheckCircle, AlertCircle, Plus, Upload, X } from 'lucide-react';

interface PlantRecord {
  id: string;
  cropType: string;
  diseaseDetected: string;
  severity: 'low' | 'medium' | 'high';
  date: string;
  imageUrl: string;
  imageBase64: string;
  recommendation: string;
  confidence: number;
}

export default function PlantHealthModule() {
  const [records, setRecords] = useState<PlantRecord[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [cropType, setCropType] = useState('');
  const [diseaseDetected, setDiseaseDetected] = useState('');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high'>('low');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('plantHealthRecords');
    if (saved) {
      setRecords(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('plantHealthRecords', JSON.stringify(records));
  }, [records]);

  const mockDiseases: { [key: string]: { disease: string; recommendation: string; confidence: number } } = {
    rice: {
      disease: 'Leaf Blast',
      recommendation: 'Use resistant varieties. Apply carbendazim. Maintain proper spacing.',
      confidence: 0.92,
    },
    sugarcane: {
      disease: 'Red Rot Disease',
      recommendation: 'Remove infected plants immediately. Use certified seed. Apply fungicide treatment.',
      confidence: 0.88,
    },
    groundnut: {
      disease: 'Leaf Spot',
      recommendation: 'Apply mancozeb spray. Ensure proper drainage. Rotate crops yearly.',
      confidence: 0.85,
    },
    cotton: {
      disease: 'Leaf Curl Virus',
      recommendation: 'Control whiteflies. Remove infected plants. Use neem oil spray.',
      confidence: 0.90,
    },
  };

  const handleImageCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setImageBase64(base64);
      setImagePreview(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleAddRecord = async () => {
    if (!cropType || !diseaseDetected || !imageBase64) return;

    setIsLoading(true);

    // Simulate ML model inference delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const mockDisease = mockDiseases[cropType.toLowerCase()] || {
      disease: diseaseDetected,
      recommendation: 'Consult with agricultural expert for detailed guidance.',
      confidence: 0.75,
    };

    const newRecord: PlantRecord = {
      id: Date.now().toString(),
      cropType,
      diseaseDetected: mockDisease.disease,
      severity,
      date: new Date().toLocaleDateString('en-IN'),
      imageUrl: imagePreview || '',
      imageBase64,
      recommendation: mockDisease.recommendation,
      confidence: mockDisease.confidence,
    };

    setRecords([newRecord, ...records]);
    setCropType('');
    setDiseaseDetected('');
    setSeverity('low');
    setImagePreview(null);
    setImageBase64('');
    setShowForm(false);
    setIsLoading(false);
  };

  const handleDeleteRecord = (id: string) => {
    setRecords(records.filter((r) => r.id !== id));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden h-64 shadow-lg">
        <img
          src="https://private-us-east-1.manuscdn.com/sessionFile/5HBtBj98sqahu7c24M8NyC/sandbox/KMqf49xFbzL1JXPEJbZidE-img-1_1772126338000_na1fn_aGVyby1wbGFudC1oZWFsdGg.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvNUhCdEJqOThzcWFodTdjMjRNOE55Qy9zYW5kYm94L0tNcWY0OXhGYnpMMUpYUEVKYlppZEUtaW1nLTFfMTc3MjEyNjMzODAwMF9uYTFmbl9hR1Z5Ynkxd2JHRnVkQzFvWldGc2RHZy5wbmc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=OEkyCrHMb9aI0gRcYO32bmZUiPyRgYt4B5--50iqzWYV1QR01mh-LL0FoAjvGTtU8l1kK6Y2fcqh5SP3p92zCYFWw7S4wnTDphHjBXto27hmRyWtSzV1y2Ri7yiOCgIqLIsX7ehnqMT1ZAHtJa27DRf7XO~AVydcxnYgeSg6eEw7oi2p~Cm7j6U594xodMs9eIfD7cTuKMFfKzLpGoPy17W~gwbQNePOPmgtT0xjwH2V~cG2BVhIYVCTaHpOLo0Atl-olH3chBnVTh23ebmG0RK6tRTl3fhw2G9b~21KrjqqK0qNdMF-1k0h7fq7taHDj0qXG-o0dr6sEriYuXmqw__"
          alt="Plant Health"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Plant Health Detection</h2>
            <p className="text-white/90">Identify crop diseases early and get expert recommendations</p>
          </div>
        </div>
      </div>

      {/* Add Record Button */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="w-full btn-primary flex items-center justify-center gap-2"
      >
        <Plus size={20} />
        Add New Detection
      </button>

      {/* Form */}
      {showForm && (
        <div className="card-elevated p-6 space-y-4">
          <h3 className="text-xl font-semibold text-primary">Record New Detection</h3>

          {/* Image Capture Section */}
          <div className="space-y-3">
            <label className="block text-sm font-medium">Capture Plant Image</label>
            <div className="flex gap-2">
              <button
                onClick={() => cameraInputRef.current?.click()}
                className="flex-1 px-4 py-3 border-2 border-dashed border-primary rounded-lg bg-blue-50 text-primary font-semibold hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
              >
                <Camera size={20} />
                Take Photo
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 px-4 py-3 border-2 border-dashed border-primary rounded-lg bg-blue-50 text-primary font-semibold hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
              >
                <Upload size={20} />
                Upload Image
              </button>
            </div>

            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageCapture}
              className="hidden"
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageCapture}
              className="hidden"
            />

            {/* Image Preview */}
            {imagePreview && (
              <div className="relative rounded-lg overflow-hidden bg-gray-100">
                <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" />
                <button
                  onClick={() => {
                    setImagePreview(null);
                    setImageBase64('');
                  }}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X size={20} />
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Crop Type</label>
            <select
              value={cropType}
              onChange={(e) => setCropType(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select crop type...</option>
              <option value="rice">Rice</option>
              <option value="sugarcane">Sugarcane</option>
              <option value="groundnut">Groundnut</option>
              <option value="cotton">Cotton</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Disease Observed</label>
            <input
              type="text"
              value={diseaseDetected}
              onChange={(e) => setDiseaseDetected(e.target.value)}
              placeholder="e.g., Rust, Leaf Spot, Blight..."
              className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Severity Level</label>
            <div className="flex gap-3">
              {['low', 'medium', 'high'].map((level) => (
                <button
                  key={level}
                  onClick={() => setSeverity(level as 'low' | 'medium' | 'high')}
                  className={`flex-1 py-2 px-3 rounded-lg font-medium transition-all ${
                    severity === level
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground'
                  }`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleAddRecord}
              disabled={isLoading || !imageBase64}
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin">⏳</div>
                  Analyzing...
                </>
              ) : (
                'Save Record'
              )}
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setImagePreview(null);
                setImageBase64('');
              }}
              className="flex-1 px-6 py-3 rounded-lg bg-muted text-muted-foreground font-semibold transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Records List */}
      <div className="space-y-4">
        {records.length === 0 ? (
          <div className="card-elevated p-8 text-center">
            <Camera size={48} className="mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No detections recorded yet. Start by adding a new record.</p>
          </div>
        ) : (
          records.map((record) => (
            <div key={record.id} className="card-elevated p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-primary">{record.cropType.toUpperCase()}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(record.severity)}`}>
                      {record.severity.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{record.date}</p>
                </div>
                <button
                  onClick={() => handleDeleteRecord(record.id)}
                  className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                >
                  <Trash2 size={20} className="text-red-600" />
                </button>
              </div>

              {/* Image Thumbnail */}
              {record.imageUrl && (
                <div className="rounded-lg overflow-hidden bg-gray-100">
                  <img src={record.imageUrl} alt="Detection" className="w-full h-32 object-cover" />
                </div>
              )}

              <div className="bg-secondary/50 p-4 rounded-lg space-y-2">
                <div className="flex items-start gap-2">
                  <AlertCircle size={18} className="text-accent mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">Disease Detected</p>
                    <p className="text-sm text-foreground">{record.diseaseDetected}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Confidence: {(record.confidence * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">Recommendation</p>
                    <p className="text-sm text-foreground">{record.recommendation}</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
