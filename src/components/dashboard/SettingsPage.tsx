import { motion } from "framer-motion";
import { Settings, Moon, Bell, Database, Download, AlertTriangle, Info } from "lucide-react";
import { useUserState } from "../../context/UserStateContext";

export function SettingsPage() {
  const { state, updateSettings, clearData } = useUserState();

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "heritage_data.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="pb-32 pt-8 max-w-4xl mx-auto"
    >
      <div className="mb-12">
        <h1 className="font-serif text-5xl text-parchment mb-3 flex items-center gap-4">
          Settings <Settings className="text-parchment/30" size={32} />
        </h1>
        <p className="font-sans text-sm text-parchment/50 uppercase tracking-widest">
          Manage your preferences and data
        </p>
      </div>

      <div className="space-y-8">
        
        {/* Appearance */}
        <SettingsSection title="Appearance">
          <SettingsRow 
            icon={<Moon />} 
            title="Dark Theme" 
            description="The cinematic dark theme is currently enabled by default for the best experience."
          >
            <div className="w-12 h-6 bg-gold rounded-full relative opacity-50 cursor-not-allowed">
              <div className="absolute right-1 top-1 w-4 h-4 bg-ink rounded-full" />
            </div>
          </SettingsRow>
        </SettingsSection>

        {/* Notifications */}
        <SettingsSection title="Notifications">
          <SettingsRow 
            icon={<Bell />} 
            title="Enable Notifications" 
            description="Receive updates on new heritage sites and suggested trails."
          >
            <button 
              onClick={() => updateSettings({ notificationsEnabled: !state.settings.notificationsEnabled })}
              className={`w-12 h-6 rounded-full relative transition-colors ${state.settings.notificationsEnabled ? 'bg-gold' : 'bg-parchment/20'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-ink rounded-full transition-all ${state.settings.notificationsEnabled ? 'right-1' : 'left-1'}`} />
            </button>
          </SettingsRow>
        </SettingsSection>

        {/* Data Management */}
        <SettingsSection title="Data & Storage">
          <SettingsRow 
            icon={<Download />} 
            title="Export Data" 
            description="Download all your saved collections, favorites, and activity history as a JSON file."
          >
            <button 
              onClick={handleExport}
              className="px-4 py-2 rounded-lg border border-gold/30 bg-gold/5 text-gold font-sans text-xs uppercase tracking-widest hover:bg-gold/20 transition-all"
            >
              Export JSON
            </button>
          </SettingsRow>
          
          <SettingsRow 
            icon={<AlertTriangle className="text-red-400" />} 
            title="Clear Favorites" 
            description="Remove all monuments from your favorites list."
          >
            <button 
              onClick={() => { if(confirm("Clear all favorites?")) clearData("favorites") }}
              className="px-4 py-2 rounded-lg border border-red-900/50 bg-red-900/10 text-red-400 font-sans text-xs uppercase tracking-widest hover:bg-red-900/30 transition-all"
            >
              Clear
            </button>
          </SettingsRow>
          
          <SettingsRow 
            icon={<AlertTriangle className="text-red-400" />} 
            title="Clear Saved Collections" 
            description="Remove all items from your saved collections."
          >
            <button 
               onClick={() => { if(confirm("Clear all saved collections?")) clearData("savedCollections") }}
              className="px-4 py-2 rounded-lg border border-red-900/50 bg-red-900/10 text-red-400 font-sans text-xs uppercase tracking-widest hover:bg-red-900/30 transition-all"
            >
              Clear
            </button>
          </SettingsRow>
        </SettingsSection>

        {/* About */}
        <SettingsSection title="About">
          <SettingsRow 
            icon={<Info />} 
            title="Application Info" 
            description="Heritage AI - Demo Build"
          >
            <div className="text-right">
              <div className="font-sans text-sm text-parchment/80">Version 1.0.0</div>
              <div className="font-sans text-xs text-parchment/40 uppercase tracking-widest mt-1">Hackathon Build</div>
            </div>
          </SettingsRow>
        </SettingsSection>

      </div>
    </motion.div>
  );
}

function SettingsSection({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="explore-card p-8 rounded-3xl border border-gold/10">
      <h2 className="font-serif text-2xl text-gold mb-6">{title}</h2>
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
}

function SettingsRow({ icon, title, description, children }: { icon: React.ReactNode, title: string, description: string, children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-parchment/10 last:border-0 last:pb-0">
      <div className="flex items-start gap-4 flex-1">
        <div className="text-parchment/40 mt-1">{icon}</div>
        <div>
          <h3 className="font-sans text-sm text-parchment mb-1 font-medium">{title}</h3>
          <p className="font-sans text-xs text-parchment/50 max-w-md leading-relaxed">{description}</p>
        </div>
      </div>
      <div className="shrink-0 pl-10 md:pl-0">
        {children}
      </div>
    </div>
  );
}
