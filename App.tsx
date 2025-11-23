import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Wand2, 
  Shirt, 
  Coffee, 
  Monitor, 
  Image as ImageIcon, 
  Loader2,
  Trash2,
  Download,
  Settings,
  ChevronRight,
  Shield,
  Bell
} from 'lucide-react';
import { Card } from './components/Card';
import { generateImageEdit, GeneratedImageResult } from './services/geminiService';

// Constants for marketing presets
const MARKETING_PRESETS = [
  {
    id: 'mug',
    label: 'Coffee Mug',
    icon: <Coffee size={20} />,
    prompt: "Generate a realistic product photography shot of a ceramic coffee mug featuring this image printed clearly on the side. The lighting should be professional studio lighting.",
  },
  {
    id: 'billboard',
    label: 'City Billboard',
    icon: <Monitor size={20} />, // Using Monitor as a proxy for 'Display'
    prompt: "A high-angle shot of a busy city street featuring a large digital billboard displaying this image as an advertisement. The scene should look realistic and urban.",
  },
  {
    id: 'tshirt',
    label: 'Apparel',
    icon: <Shirt size={20} />,
    prompt: "A model wearing a clean white t-shirt with this image printed on the center chest. The style should be casual street wear.",
  },
];

const SAMPLE_IMAGE_URL = 'https://picsum.photos/400/400';

const App: React.FC = () => {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [sourceMimeType, setSourceMimeType] = useState<string>('image/png');
  const [isProcessing, setIsProcessing] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [generatedResults, setGeneratedResults] = useState<GeneratedImageResult[]>([]);
  const [activeTab, setActiveTab] = useState<'create' | 'settings'>('create');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSourceImage(reader.result as string);
        setSourceMimeType(file.type);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async (prompt: string, typeLabel: string = 'Custom') => {
    if (!sourceImage) return;

    setIsProcessing(true);
    try {
      const result = await generateImageEdit(sourceImage, sourceMimeType, prompt);
      setGeneratedResults(prev => [{ ...result, promptUsed: `${typeLabel}: ${prompt}` }, ...prev]);
    } catch (error) {
      console.error("Failed to generate", error);
      alert("Failed to generate image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePresetClick = (preset: typeof MARKETING_PRESETS[0]) => {
    handleGenerate(preset.prompt, preset.label);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;
    handleGenerate(customPrompt, 'Custom Edit');
    setCustomPrompt('');
  };

  const clearHistory = () => {
    setGeneratedResults([]);
  };

  // Render the Settings View (Visual Replica of the Request)
  const renderSettings = () => (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 text-center mb-8">
        Settings
      </h2>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider ml-1">Account & Security</h3>
        <Card className="flex items-center justify-between !py-4 group cursor-pointer hover:border-blue-500/30">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shadow-[0_0_10px_rgba(59,130,246,0.2)]">
               <Shield size={20} className="text-blue-400" />
            </div>
            <span className="text-slate-200 font-medium">Privacy</span>
          </div>
          <ChevronRight size={20} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
        </Card>
        <Card className="flex items-center justify-between !py-4 group cursor-pointer hover:border-blue-500/30">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shadow-[0_0_10px_rgba(59,130,246,0.2)]">
               <div className="w-5 h-5 rounded-full border-2 border-slate-500/50" />
            </div>
            <span className="text-slate-200 font-medium">Block Users</span>
          </div>
          <ChevronRight size={20} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
        </Card>
      </div>

      <div className="space-y-2 mt-6">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider ml-1">App Preferences</h3>
        <Card className="flex items-center justify-between !py-4 hover:border-blue-500/30">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
               <Bell size={20} className="text-blue-400" />
            </div>
            <span className="text-slate-200 font-medium">Notifications</span>
          </div>
          <div className="w-12 h-7 bg-orange-300 rounded-full p-1 cursor-pointer transition-colors relative">
             <div className="w-5 h-5 bg-white rounded-full shadow-sm absolute right-1" />
          </div>
        </Card>
        <Card className="flex items-center justify-between !py-4 group cursor-pointer hover:border-blue-500/30">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shadow-[0_0_10px_rgba(168,85,247,0.2)]">
               <div className="text-purple-400">🎨</div>
            </div>
            <span className="text-slate-200 font-medium">Theme</span>
          </div>
          <ChevronRight size={20} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
        </Card>
      </div>

      <div className="space-y-2 mt-6">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider ml-1">Data Management</h3>
         <button 
            onClick={clearHistory}
            className="w-full flex items-center justify-center p-4 rounded-2xl border border-red-900/30 bg-red-950/10 text-red-400 hover:bg-red-900/20 hover:border-red-500/30 transition-all font-medium"
          >
            <Trash2 size={18} className="mr-2" />
            Clear Generated History
          </button>
      </div>

      <div className="text-center text-xs text-slate-600 mt-12 pb-8">
        Nano Marketing Studio v1.0 • Powered by Gemini
      </div>
    </div>
  );

  // Render the Main Creation View
  const renderCreate = () => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Column: Inputs */}
      <div className="lg:col-span-5 space-y-6">
        <Card title="Source Product" icon={<ImageIcon size={20} />} className="min-h-[300px] flex flex-col">
          <div 
            className="flex-1 rounded-xl border-2 border-dashed border-slate-700 bg-slate-800/30 flex flex-col items-center justify-center p-6 cursor-pointer hover:border-blue-500/50 hover:bg-slate-800/50 transition-all group relative overflow-hidden"
            onClick={() => fileInputRef.current?.click()}
          >
            {sourceImage ? (
              <img 
                src={sourceImage} 
                alt="Source" 
                className="w-full h-full object-contain rounded-lg z-10"
              />
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-slate-700/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Upload className="text-slate-400 group-hover:text-blue-400" size={32} />
                </div>
                <p className="text-slate-400 font-medium">Click to upload product image</p>
                <p className="text-slate-600 text-sm mt-2">Supports PNG, JPG, WEBP</p>
              </>
            )}
            
            {/* Hidden Input */}
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden" 
            />
          </div>

          {sourceImage && (
             <button 
               onClick={() => { setSourceImage(null); }}
               className="mt-4 text-sm text-red-400 hover:text-red-300 flex items-center justify-center w-full py-2"
             >
               Remove Image
             </button>
          )}
        </Card>

        <Card title="AI Controls" icon={<Wand2 size={20} />}>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-3">Quick Visualizations</label>
              <div className="grid grid-cols-3 gap-3">
                {MARKETING_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handlePresetClick(preset)}
                    disabled={!sourceImage || isProcessing}
                    className={`
                      flex flex-col items-center justify-center p-3 rounded-xl border transition-all
                      ${!sourceImage 
                        ? 'opacity-50 cursor-not-allowed border-slate-800 bg-slate-900' 
                        : 'border-slate-700 bg-slate-800/50 hover:bg-blue-900/20 hover:border-blue-500/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.15)] active:scale-95'
                      }
                    `}
                  >
                    <div className="mb-2 text-slate-300">{preset.icon}</div>
                    <span className="text-xs font-medium text-slate-400">{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-3">Natural Language Edit</label>
              <form onSubmit={handleCustomSubmit} className="relative">
                <input
                  type="text"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="e.g., 'Add a retro neon filter' or 'Place on a wooden table'"
                  disabled={!sourceImage || isProcessing}
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 pr-12 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
                />
                <button 
                  type="submit"
                  disabled={!sourceImage || isProcessing || !customPrompt.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 transition-colors"
                >
                  <Wand2 size={16} />
                </button>
              </form>
            </div>
          </div>
        </Card>
      </div>

      {/* Right Column: Output */}
      <div className="lg:col-span-7">
         <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-200">Generated Assets</h2>
            <span className="text-sm text-slate-500">{generatedResults.length} items</span>
         </div>

         {isProcessing && (
           <Card className="mb-6 border-blue-500/30 bg-blue-900/10">
              <div className="flex items-center justify-center gap-3 py-8 text-blue-300">
                <Loader2 className="animate-spin" size={24} />
                <span className="font-medium animate-pulse">Gemini is dreaming up your image...</span>
              </div>
           </Card>
         )}

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {generatedResults.length === 0 && !isProcessing && (
               <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-600 border-2 border-dashed border-slate-800 rounded-3xl">
                  <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center mb-4">
                     <ImageIcon size={32} opacity={0.5} />
                  </div>
                  <p>No assets generated yet.</p>
                  <p className="text-sm mt-1">Upload an image and select a preset to begin.</p>
               </div>
            )}

            {generatedResults.map((result, index) => (
               <div key={index} className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-blue-500/30 transition-all shadow-lg hover:shadow-2xl hover:shadow-blue-900/10">
                  <img 
                    src={result.imageUrl} 
                    alt="Generated" 
                    className="w-full aspect-square object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                     <p className="text-white font-medium text-sm line-clamp-2 mb-3">{result.promptUsed}</p>
                     <a 
                       href={result.imageUrl} 
                       download={`nano-generated-${Date.now()}.png`}
                       className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white py-2 rounded-lg transition-colors font-medium text-sm"
                     >
                       <Download size={16} /> Download Asset
                     </a>
                  </div>
               </div>
            ))}
         </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#05050a] text-slate-200 selection:bg-blue-500/30">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.5)]">
               <Wand2 className="text-white" size={24} />
             </div>
             <div>
               <h1 className="text-2xl font-bold tracking-tight text-white">Nano Marketing Studio</h1>
               <p className="text-xs text-blue-400 font-medium tracking-wider uppercase">Powered by Gemini 2.5</p>
             </div>
          </div>
          
          <nav className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-white/5 backdrop-blur-md">
            <button 
              onClick={() => setActiveTab('create')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'create' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Studio
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'settings' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Settings
            </button>
          </nav>
        </header>

        {/* Content */}
        <main>
          {activeTab === 'create' ? renderCreate() : renderSettings()}
        </main>
      </div>
    </div>
  );
};

export default App;