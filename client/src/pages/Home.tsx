import { useState } from 'react';
import { Camera, Mic, MapPin } from 'lucide-react';
import PlantHealthModule from '@/components/PlantHealthModule';
import VoiceAssistantModule from '@/components/VoiceAssistantModule';
import PrecisionSafetyModule from '@/components/PrecisionSafetyModule';

export default function Home() {
  const [activeModule, setActiveModule] = useState<'plant' | 'voice' | 'safety'>('plant');

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">🌾</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary">AGRI-GOV-TECH</h1>
                <p className="text-xs text-muted-foreground">Rural Assistance Platform</p>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Visakhapatnam, Andhra Pradesh
            </div>
          </div>
        </div>
      </header>

      {/* Module Navigation */}
      <nav className="bg-secondary border-b border-border sticky top-16 z-40">
        <div className="container mx-auto px-4">
          <div className="flex gap-0">
            <button
              onClick={() => setActiveModule('plant')}
              className={`flex-1 py-4 px-4 text-center font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                activeModule === 'plant'
                  ? 'bg-primary text-primary-foreground border-b-4 border-primary'
                  : 'text-secondary-foreground hover:bg-opacity-50'
              }`}
            >
              <Camera size={20} />
              <span className="hidden sm:inline">Plant Health</span>
            </button>
            <button
              onClick={() => setActiveModule('voice')}
              className={`flex-1 py-4 px-4 text-center font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                activeModule === 'voice'
                  ? 'bg-primary text-primary-foreground border-b-4 border-primary'
                  : 'text-secondary-foreground hover:bg-opacity-50'
              }`}
            >
              <Mic size={20} />
              <span className="hidden sm:inline">Voice Assistant</span>
            </button>
            <button
              onClick={() => setActiveModule('safety')}
              className={`flex-1 py-4 px-4 text-center font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                activeModule === 'safety'
                  ? 'bg-primary text-primary-foreground border-b-4 border-primary'
                  : 'text-secondary-foreground hover:bg-opacity-50'
              }`}
            >
              <MapPin size={20} />
              <span className="hidden sm:inline">Safety</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {activeModule === 'plant' && <PlantHealthModule />}
        {activeModule === 'voice' && <VoiceAssistantModule />}
        {activeModule === 'safety' && <PrecisionSafetyModule />}
      </main>

      {/* Footer */}
      <footer className="bg-secondary border-t border-border mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>AGRI-GOV-TECH © 2025 | Empowering Rural Communities</p>
          <p className="mt-2">For emergencies, contact local authorities immediately</p>
        </div>
      </footer>
    </div>
  );
}
