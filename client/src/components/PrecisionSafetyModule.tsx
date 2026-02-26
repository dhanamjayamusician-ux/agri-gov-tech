import { useState, useEffect } from 'react';
import { MapPin, AlertCircle, Trash2, CheckCircle, Plus, Phone } from 'lucide-react';

interface EmergencyAlert {
  id: string;
  type: string;
  location: string;
  description: string;
  latitude: string;
  longitude: string;
  status: 'reported' | 'resolved';
  date: string;
  contactName: string;
}

export default function PrecisionSafetyModule() {
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [contactName, setContactName] = useState('');

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

  const emergencyContacts: { [key: string]: string } = {
    medical: '102',
    police: '100',
    fire: '101',
    agricultural: '1551',
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLatitude(position.coords.latitude.toFixed(6));
        setLongitude(position.coords.longitude.toFixed(6));
      });
    }
  };

  const handleAddAlert = () => {
    if (!alertType || !location || !description || !contactName) return;

    const newAlert: EmergencyAlert = {
      id: Date.now().toString(),
      type: alertType,
      location,
      description,
      latitude: latitude || 'Not captured',
      longitude: longitude || 'Not captured',
      status: 'reported',
      date: new Date().toLocaleString('en-IN'),
      contactName,
    };

    setAlerts([newAlert, ...alerts]);
    setAlertType('');
    setLocation('');
    setDescription('');
    setLatitude('');
    setLongitude('');
    setContactName('');
    setShowForm(false);
  };

  const handleResolveAlert = (id: string) => {
    setAlerts(
      alerts.map((a) =>
        a.id === id ? { ...a, status: 'resolved' } : a
      )
    );
  };

  const handleDeleteAlert = (id: string) => {
    setAlerts(alerts.filter((a) => a.id !== id));
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'medical':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'fire':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'police':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'agricultural':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'medical':
        return '🏥';
      case 'fire':
        return '🔥';
      case 'police':
        return '👮';
      case 'agricultural':
        return '🚜';
      default:
        return '⚠️';
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden h-64 shadow-lg">
        <img
          src="https://private-us-east-1.manuscdn.com/sessionFile/5HBtBj98sqahu7c24M8NyC/sandbox/KMqf49xFbzL1JXPEJbZidE-img-3_1772126337000_na1fn_aGVyby1wcmVjaXNpb24tc2FmZXR5.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvNUhCdEJqOThzcWFodTdjMjRNOE55Qy9zYW5kYm94L0tNcWY0OXhGYnpMMUpYUEVKYlppZEUtaW1nLTNfMTc3MjEyNjMzNzAwMF9uYTFmbl9hR1Z5Ynkxd2NtVmphWE5wYjI0dGMyRm1aWFI1LnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=iO-Izi1KTvufXXIz2GeNlyCzqePqR34mbFnKP6BdnXUw23nWLCUmi~6jtlzFz5LBzSgy06mdJz29MXfa5UOiCTyleCbBlSlCStNwzkogwI3kb~SesgSEm41-E6eQn51bGI1IUK5fTP6Xt-R9WmgyEFsKDueQAvHP6ywLd3BJZnEJBz8rtHjyaubif3E3EcoQJZunQkHdoKY59FRjlAVT9lX5hjL1q8xBbdvo7XkCCYBnBIre0d9qNZeduYE6AVZ1Qj5cWuT8vBnehFPaft9JOdbuxPPoFyZSb2SeZC6bU4BTS4kAfIxLfe2vdNRRnR78PqsmoKUDJxcpjzWAKl8x3g__"
          alt="Precision Safety"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Precision Safety & Emergency Response</h2>
            <p className="text-white/90">Report emergencies with GPS location for rapid response</p>
          </div>
        </div>
      </div>

      {/* Emergency Contacts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Object.entries(emergencyContacts).map(([type, number]) => (
          <a
            key={type}
            href={`tel:${number}`}
            className="card-elevated p-4 text-center hover:shadow-lg transition-all"
          >
            <div className="text-2xl mb-2">{getAlertIcon(type)}</div>
            <p className="text-xs font-semibold text-foreground capitalize mb-1">{type}</p>
            <p className="text-lg font-bold text-primary">{number}</p>
          </a>
        ))}
      </div>

      {/* Add Alert Button */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="w-full btn-primary flex items-center justify-center gap-2"
      >
        <Plus size={20} />
        Report Emergency
      </button>

      {/* Form */}
      {showForm && (
        <div className="card-elevated p-6 space-y-4 border-2 border-accent">
          <h3 className="text-xl font-semibold text-primary">Report Emergency</h3>

          <div>
            <label className="block text-sm font-medium mb-2">Emergency Type</label>
            <select
              value={alertType}
              onChange={(e) => setAlertType(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select emergency type...</option>
              <option value="medical">Medical Emergency</option>
              <option value="fire">Fire</option>
              <option value="police">Police/Crime</option>
              <option value="agricultural">Agricultural Disaster</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Your Name</label>
            <input
              type="text"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="Your full name"
              className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Near Visakhapatnam Port, Village Name"
              className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-2">Latitude</label>
              <input
                type="text"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="Auto-detect"
                className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Longitude</label>
              <input
                type="text"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="Auto-detect"
                className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
          </div>

          <button
            onClick={handleGetLocation}
            className="w-full px-4 py-2 rounded-lg bg-secondary text-secondary-foreground font-semibold transition-all duration-300 flex items-center justify-center gap-2"
          >
            <MapPin size={18} />
            Get Current Location
          </button>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the emergency situation..."
              className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              rows={4}
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleAddAlert}
              className="flex-1 btn-primary"
            >
              Report Emergency
            </button>
            <button
              onClick={() => setShowForm(false)}
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
            <AlertCircle size={48} className="mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No emergencies reported. Stay safe!</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`card-elevated p-6 space-y-4 border-l-4 ${
                alert.status === 'resolved' ? 'border-green-500 opacity-75' : 'border-accent'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{getAlertIcon(alert.type)}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getAlertColor(alert.type)}`}>
                      {alert.type.toUpperCase()}
                    </span>
                    {alert.status === 'resolved' && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-300">
                        RESOLVED
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{alert.date}</p>
                </div>
                <button
                  onClick={() => handleDeleteAlert(alert.id)}
                  className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                >
                  <Trash2 size={20} className="text-red-600" />
                </button>
              </div>

              <div className="bg-secondary/50 p-4 rounded-lg space-y-3">
                <div>
                  <p className="font-semibold text-sm mb-1">Reported By</p>
                  <p className="text-sm text-foreground">{alert.contactName}</p>
                </div>
                <div>
                  <p className="font-semibold text-sm mb-1">Location</p>
                  <p className="text-sm text-foreground">{alert.location}</p>
                </div>
                {alert.latitude !== 'Not captured' && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Latitude</p>
                      <p className="text-sm font-mono text-foreground">{alert.latitude}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Longitude</p>
                      <p className="text-sm font-mono text-foreground">{alert.longitude}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="font-semibold text-sm mb-2">Description</p>
                <p className="text-sm text-foreground">{alert.description}</p>
              </div>

              {alert.status === 'reported' && (
                <button
                  onClick={() => handleResolveAlert(alert.id)}
                  className="w-full px-4 py-2 rounded-lg bg-green-100 text-green-800 font-semibold transition-all duration-300 flex items-center justify-center gap-2 hover:bg-green-200"
                >
                  <CheckCircle size={18} />
                  Mark as Resolved
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
