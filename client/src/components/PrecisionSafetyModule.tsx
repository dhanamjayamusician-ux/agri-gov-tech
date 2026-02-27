import { useState, useEffect } from 'react';
import { MapPin, Trash2, AlertTriangle, Plus, Phone, Navigation, Loader } from 'lucide-react';

interface EmergencyAlert {
  id: string;
  emergencyType: string;
  description: string;
  latitude: number;
  longitude: number;
  location: string;
  timestamp: string;
  status: 'pending' | 'dispatched' | 'resolved';
  responderName?: string;
  eta?: string;
}

export default function PrecisionSafetyModule() {
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [emergencyType, setEmergencyType] = useState('medical');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoadingGPS, setIsLoadingGPS] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('emergencyAlerts');
    if (saved) {
      setAlerts(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('emergencyAlerts', JSON.stringify(alerts));
  }, [alerts]);

  const captureGPS = () => {
    setIsLoadingGPS(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setGpsCoords({ lat: latitude, lng: longitude });
          setLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
          setIsLoadingGPS(false);
        },
        (error) => {
          console.error('GPS error:', error);
          alert('Unable to get location. Please enable GPS and try again.');
          setIsLoadingGPS(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
      setIsLoadingGPS(false);
    }
  };

  const handleSubmitAlert = async () => {
    if (!emergencyType || !description || !gpsCoords) {
      alert('Please fill all fields and capture GPS location');
      return;
    }

    setIsSubmitting(true);

    // Simulate backend processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newAlert: EmergencyAlert = {
      id: Date.now().toString(),
      emergencyType,
      description,
      latitude: gpsCoords.lat,
      longitude: gpsCoords.lng,
      location,
      timestamp: new Date().toLocaleString('en-IN'),
      status: 'dispatched',
      responderName: 'Responder Unit ' + Math.floor(Math.random() * 100),
      eta: Math.floor(Math.random() * 20 + 5) + ' mins',
    };

    setAlerts([newAlert, ...alerts]);
    setEmergencyType('medical');
    setDescription('');
    setLocation('');
    setGpsCoords(null);
    setShowForm(false);
    setIsSubmitting(false);

    alert('Emergency alert sent! Responders are on the way.');
  };

  const handleDeleteAlert = (id: string) => {
    setAlerts(alerts.filter((a) => a.id !== id));
  };

  const makeCall = (number: string) => {
    window.location.href = `tel:${number}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'dispatched':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEmergencyIcon = (type: string) => {
    switch (type) {
      case 'medical':
        return '🏥';
      case 'agricultural':
        return '🌾';
      case 'natural':
        return '⛈️';
      case 'security':
        return '🚨';
      default:
        return '⚠️';
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden h-64 shadow-lg">
        <img
          src="https://private-us-east-1.manuscdn.com/sessionFile/5HBtBj98sqahu7c24M8NyC/sandbox/KMqf49xFbzL1JXPEJbZidE-img-3_1772126341000_na1fn_aGVyby1wcmVjaXNpb24tc2FmZXR5.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvNUhCdEJqOThzcWFodTdjMjRNOE55Qy9zYW5kYm94L0tNcWY0OXhGYnpMMUpYUEVKYlppZEUtaW1nLTNfMTc3MjEyNjM0MV9uYTFmbl9hR1Z5Ynkxd2JHRnVkQzFvWldGc2RHZy5wbmc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=HEh0P1wFKLDcJVfKMxSKkBLPu7VqVqvqxQr6YgLN0zcJKvjpNOQiXvLjJGLMZOsqnPqxCvHpVdPSFMbTxPvLPMZQJqvYKmZ0Rl8s3MgDKLLhXXHhCDTFE7CtxDNqMGfGkJHpCvZbvQxdvJkPPNQqEBVTfQfKqVHCvhCLcGGHMHqvJvXVHGWPVjLPHvPkZVHFxIvNXHPbqDwfKKRBBEcWJYkGqCJnZLkRbJqQPYXWFONXxvHfyJqvKPKvZZvnKMwQaFVJbGLVHvhyqJfQ__"
          alt="Precision Safety"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Precision Safety & Emergency Response</h2>
            <p className="text-white/90">Report emergencies with exact GPS location for rapid response</p>
          </div>
        </div>
      </div>

      {/* Emergency Hotlines */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => makeCall('100')}
          className="p-4 rounded-lg bg-red-100 text-red-700 font-semibold hover:bg-red-200 transition-colors flex items-center justify-center gap-2"
        >
          <Phone size={20} />
          <span>Police (100)</span>
        </button>
        <button
          onClick={() => makeCall('101')}
          className="p-4 rounded-lg bg-orange-100 text-orange-700 font-semibold hover:bg-orange-200 transition-colors flex items-center justify-center gap-2"
        >
          <Phone size={20} />
          <span>Fire (101)</span>
        </button>
        <button
          onClick={() => makeCall('102')}
          className="p-4 rounded-lg bg-green-100 text-green-700 font-semibold hover:bg-green-200 transition-colors flex items-center justify-center gap-2"
        >
          <Phone size={20} />
          <span>Ambulance (102)</span>
        </button>
        <button
          onClick={() => makeCall('1551')}
          className="p-4 rounded-lg bg-purple-100 text-purple-700 font-semibold hover:bg-purple-200 transition-colors flex items-center justify-center gap-2"
        >
          <Phone size={20} />
          <span>Disaster (1551)</span>
        </button>
      </div>

      {/* Report Emergency Button */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="w-full btn-primary flex items-center justify-center gap-2"
      >
        <Plus size={20} />
        Report Emergency
      </button>

      {/* Form */}
      {showForm && (
        <div className="card-elevated p-6 space-y-4 border-2 border-red-300">
          <h3 className="text-xl font-semibold text-red-600">Emergency Alert Form</h3>

          <div>
            <label className="block text-sm font-medium mb-2">Emergency Type</label>
            <select
              value={emergencyType}
              onChange={(e) => setEmergencyType(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="medical">Medical Emergency</option>
              <option value="agricultural">Agricultural Crisis</option>
              <option value="natural">Natural Disaster</option>
              <option value="security">Security Threat</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the emergency situation..."
              className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
              rows={3}
            />
          </div>

          {/* GPS Capture Section */}
          <div className="space-y-3 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
            <label className="block text-sm font-medium">📍 Capture Your Location</label>
            <button
              onClick={captureGPS}
              disabled={isLoadingGPS}
              className="w-full px-4 py-3 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoadingGPS ? (
                <>
                  <Loader size={20} className="animate-spin" />
                  Getting Location...
                </>
              ) : (
                <>
                  <Navigation size={20} />
                  Get My GPS Location
                </>
              )}
            </button>

            {gpsCoords && (
              <div className="p-3 bg-green-100 rounded-lg border border-green-300">
                <p className="text-sm font-semibold text-green-700">✓ Location Captured</p>
                <p className="text-xs text-green-600 mt-1">
                  Latitude: {gpsCoords.lat.toFixed(6)}
                </p>
                <p className="text-xs text-green-600">
                  Longitude: {gpsCoords.lng.toFixed(6)}
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Location Name (Optional)</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Near Visakhapatnam Port, Village Name"
              className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSubmitAlert}
              disabled={isSubmitting || !gpsCoords}
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed bg-red-600 hover:bg-red-700"
            >
              {isSubmitting ? 'Sending Alert...' : 'Send Emergency Alert'}
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setEmergencyType('medical');
                setDescription('');
                setLocation('');
                setGpsCoords(null);
              }}
              className="flex-1 px-6 py-3 rounded-lg bg-muted text-muted-foreground font-semibold transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Alerts List */}
      <div className="space-y-4">
        {alerts.length === 0 ? (
          <div className="card-elevated p-8 text-center">
            <MapPin size={48} className="mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No emergency alerts reported yet.</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div key={alert.id} className="card-elevated p-6 space-y-4 border-l-4 border-red-500">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{getEmergencyIcon(alert.emergencyType)}</span>
                    <h3 className="text-lg font-semibold text-primary capitalize">{alert.emergencyType}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(alert.status)}`}>
                      {alert.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{alert.timestamp}</p>
                </div>
                <button
                  onClick={() => handleDeleteAlert(alert.id)}
                  className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                >
                  <Trash2 size={20} className="text-red-600" />
                </button>
              </div>

              <div className="bg-secondary/50 p-4 rounded-lg space-y-2">
                <p className="font-semibold text-sm">Description</p>
                <p className="text-sm text-foreground">{alert.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-xs font-semibold text-blue-700 mb-1">📍 GPS Coordinates</p>
                  <p className="text-xs text-blue-600">{alert.latitude.toFixed(6)}</p>
                  <p className="text-xs text-blue-600">{alert.longitude.toFixed(6)}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-xs font-semibold text-green-700 mb-1">🚗 Responder Info</p>
                  <p className="text-xs text-green-600">{alert.responderName}</p>
                  <p className="text-xs text-green-600">ETA: {alert.eta}</p>
                </div>
              </div>

              {alert.location && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs font-semibold text-gray-700 mb-1">Location Name</p>
                  <p className="text-sm text-gray-600">{alert.location}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
