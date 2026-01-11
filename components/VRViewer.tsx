
import React from 'react';
import { Box, Maximize2, Info, Compass } from 'lucide-react';

const VRViewer: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-2">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-tighter animate-pulse">
              Simulated Reality
            </span>
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">Durian VR <span className="text-green-600">Inspection</span></h2>
          </div>
          <p className="text-gray-500 max-w-xl">
            Inspect the anatomical structure of the King of Fruits. Use your VR headset or mouse to rotate, zoom, and analyze thorn density and flesh consistency in high-definition 3D.
          </p>
        </div>
        <div className="flex gap-2">
          <div className="p-3 bg-white border border-gray-100 rounded-2xl flex items-center gap-3 shadow-sm">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Model Fidelity</p>
              <p className="text-sm font-bold">4K Photogrammetry</p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative aspect-video w-full bg-black rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white group">
        <div className="absolute inset-0 z-10 pointer-events-none border-[1px] border-white/10 rounded-[2.5rem]"></div>
        
        {/* HUD Overlays */}
        <div className="absolute top-8 left-8 z-20 pointer-events-none hidden md:block">
          <div className="bg-black/40 backdrop-blur-md border border-white/10 p-4 rounded-2xl text-white space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-[10px] font-black uppercase tracking-widest">Tracking Active</span>
            </div>
            <p className="text-[9px] text-white/60 leading-tight">X: 104.29 | Y: 3.14 | Z: 88.02<br/>STABILIZATION: 99.8%</p>
          </div>
        </div>

        <iframe 
          title="Durian 3D Model"
          className="w-full h-full"
          frameBorder="0"
          allowFullScreen
          allow="autoplay; fullscreen; xr-spatial-tracking"
          src="https://sketchfab.com/models/67402a40f24747c1b501b5f7af51af77/embed?autostart=1&cardboard=1&internal=1&tracking=0&ui_ar=0&ui_infos=0&ui_snapshots=1&ui_stop=0&ui_theatre=1&ui_watermark=0"
        ></iframe>

        <div className="absolute bottom-8 right-8 z-20">
          <button className="bg-white/90 backdrop-blur hover:bg-white text-gray-900 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-xl transition-all hover:scale-105 active:scale-95">
            <Maximize2 className="w-4 h-4" /> Enter VR Mode
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 bg-yellow-50 rounded-2xl flex items-center justify-center text-yellow-600 shrink-0">
            <Info className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900">Thorn Density</h4>
            <p className="text-sm text-gray-500">Analyze the D197 thorn pattern for maturity indicators.</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 shrink-0">
            <Box className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900">Spatial Proximity</h4>
            <p className="text-sm text-gray-500">Use AR on mobile to place this durian in your actual environment.</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
            <Maximize2 className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900">360 Inspection</h4>
            <p className="text-sm text-gray-500">Full rotatable view to check for hidden pest damage or cracks.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VRViewer;
