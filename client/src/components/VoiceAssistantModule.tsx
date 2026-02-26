import { useState, useEffect } from 'react';
import { Mic, Trash2, CheckCircle, Plus, Volume2 } from 'lucide-react';

interface VoiceQuery {
  id: string;
  query: string;
  language: string;
  response: string;
  date: string;
  category: string;
}

export default function VoiceAssistantModule() {
  const [queries, setQueries] = useState<VoiceQuery[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState('hindi');
  const [category, setCategory] = useState('general');

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('voiceQueries');
    if (saved) {
      setQueries(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('voiceQueries', JSON.stringify(queries));
  }, [queries]);

  const mockResponses: { [key: string]: string } = {
    irrigation: 'आपके क्षेत्र में इस समय गेहूं को 7-10 दिन के अंतराल पर सिंचाई की आवश्यकता है। मिट्टी की नमी जांचें और तदनुसार सिंचाई करें।',
    fertilizer: 'धान के लिए यूरिया 120 किग्रा/हेक्टेयर, फास्फोरस 60 किग्रा/हेक्टेयर, और पोटाश 40 किग्रा/हेक्टेयर की सिफारिश की जाती है।',
    pest: 'यदि आप शूट बोरर के संकेत देख रहे हैं, तो क्विनलफॉस 1.5% का छिड़काव करें। 10 दिन के अंतराल पर 2-3 बार दोहराएं।',
    weather: 'आने वाले 5 दिनों में बारिश की संभावना है। अपनी फसल की सुरक्षा के लिए आवश्यक उपाय करें।',
    scheme: 'प्रधानमंत्री किसान सम्मान निधि योजना के तहत आप ₹6000 प्रति वर्ष प्राप्त कर सकते हैं। आवेदन के लिए अपने पटवारी से संपर्क करें।',
    general: 'आपके प्रश्न के लिए धन्यवाद। कृपया अधिक विशिष्ट जानकारी प्रदान करें ताकि मैं बेहतर सहायता दे सकूं।',
  };

  const handleAddQuery = () => {
    if (!query) return;

    const response = mockResponses[category] || mockResponses['general'];

    const newQuery: VoiceQuery = {
      id: Date.now().toString(),
      query,
      language,
      response,
      date: new Date().toLocaleDateString('en-IN'),
      category,
    };

    setQueries([newQuery, ...queries]);
    setQuery('');
    setCategory('general');
    setShowForm(false);
  };

  const handleDeleteQuery = (id: string) => {
    setQueries(queries.filter((q) => q.id !== id));
  };

  const getCategoryLabel = (cat: string) => {
    const labels: { [key: string]: string } = {
      irrigation: '💧 Irrigation',
      fertilizer: '🌱 Fertilizer',
      pest: '🐛 Pest Control',
      weather: '🌤️ Weather',
      scheme: '📋 Government Schemes',
      general: '❓ General Query',
    };
    return labels[cat] || cat;
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden h-64 shadow-lg">
        <img
          src="https://private-us-east-1.manuscdn.com/sessionFile/5HBtBj98sqahu7c24M8NyC/sandbox/KMqf49xFbzL1JXPEJbZidE-img-2_1772126340000_na1fn_aGVyby12b2ljZS1hc3Npc3RhbnQ.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvNUhCdEJqOThzcWFodTdjMjRNOE55Qy9zYW5kYm94L0tNcWY0OXhGYnpMMUpYUEVKYlppZEUtaW1nLTJfMTc3MjEyNjM0MDAwMF9uYTFmbl9hR1Z5YnkxMmIybGpaUzFoYzNOcGMzUmhiblEucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=Ez6sbMjtJ-Cy1-npbjT-xsBcIcGzYtpqw9NdZys0lPhRxxOjXD76~5b0avJ1moi-ERoFUtTNXrc4aKQDbjlrA8bJGk-~ak5OaLcP-4JWEMpqB2KL1wrtY8oWukroYREn1xI23zvAgOEGbvT8ViWK64sYsP~AqDEiewMkWMtxd1GojBCLf4GKDiWh2iHdeQ0YfFEiTOWgxk97WbMnTtTIY~cD08f3OKNBrFdmIYvf0thWJN7mLmiot7gTZBwAJhmJww~zrelvh~chK4u1KxqD2ySB1yEUxFeGcxKr4Od0acVRIZAloLEn3T-UfGCWDxZ76K6ANNbUUWObpPk4IWC56g__"
          alt="Voice Assistant"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Multilingual Voice Assistant</h2>
            <p className="text-white/90">Ask questions in your native language and get instant answers</p>
          </div>
        </div>
      </div>

      {/* Add Query Button */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="w-full btn-primary flex items-center justify-center gap-2"
      >
        <Mic size={20} />
        Ask a Question
      </button>

      {/* Form */}
      {showForm && (
        <div className="card-elevated p-6 space-y-4">
          <h3 className="text-xl font-semibold text-primary">Ask Your Question</h3>

          <div>
            <label className="block text-sm font-medium mb-2">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="hindi">हिंदी (Hindi)</option>
              <option value="punjabi">ਪੰਜਾਬੀ (Punjabi)</option>
              <option value="english">English</option>
              <option value="haryanvi">हरियाणवी (Haryanvi)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Question Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="general">General Query</option>
              <option value="irrigation">Irrigation</option>
              <option value="fertilizer">Fertilizer</option>
              <option value="pest">Pest Control</option>
              <option value="weather">Weather</option>
              <option value="scheme">Government Schemes</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Your Question</label>
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type or describe your question..."
              className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              rows={4}
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleAddQuery}
              className="flex-1 btn-primary"
            >
              Get Answer
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

      {/* Queries List */}
      <div className="space-y-4">
        {queries.length === 0 ? (
          <div className="card-elevated p-8 text-center">
            <Volume2 size={48} className="mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No queries yet. Ask your first question to get started.</p>
          </div>
        ) : (
          queries.map((q) => (
            <div key={q.id} className="card-elevated p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary text-primary-foreground">
                      {getCategoryLabel(q.category)}
                    </span>
                    <span className="text-xs text-muted-foreground">{q.language.toUpperCase()}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{q.date}</p>
                </div>
                <button
                  onClick={() => handleDeleteQuery(q.id)}
                  className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                >
                  <Trash2 size={20} className="text-red-600" />
                </button>
              </div>

              <div className="bg-secondary/50 p-4 rounded-lg">
                <p className="font-semibold text-sm mb-2">Your Question</p>
                <p className="text-sm text-foreground">{q.query}</p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">Answer</p>
                    <p className="text-sm text-foreground">{q.response}</p>
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
