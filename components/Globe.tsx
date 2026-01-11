
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { Cloud, Sun, CloudRain, Plus, Minus } from 'lucide-react';
import { GlobeDestination, WeatherData } from '../types.ts';

interface GlobeProps {
  destinations: GlobeDestination[];
  onSelectDestination: (dest: GlobeDestination) => void;
  activeId?: string;
  weather?: WeatherData | null;
}

const WeatherIcon = ({ condition }: { condition: string }) => {
  const c = condition.toLowerCase();
  if (c.includes('cloud')) return <Cloud className="w-4 h-4 text-slate-300" />;
  if (c.includes('rain')) return <CloudRain className="w-4 h-4 text-indigo-400" />;
  if (c.includes('clear')) return <Sun className="w-4 h-4 text-yellow-400" />;
  return <Sun className="w-4 h-4 text-yellow-400 opacity-50" />;
};

const Globe: React.FC<GlobeProps> = ({ destinations, onSelectDestination, activeId, weather }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [weatherPos, setWeatherPos] = useState<{ x: number, y: number } | null>(null);
  
  const projectionRef = useRef(d3.geoOrthographic().scale(800).center([0, 0]).translate([300, 300]));
  const isDraggingRef = useRef(false);
  const baseScaleRef = useRef(800);
  const rotationTimerRef = useRef<d3.Timer | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    const width = 600, height = 600;
    const sensitivity = 0.25; // Tactile sensitivity factor
    const svg = d3.select(svgRef.current).attr('viewBox', `0 0 ${width} ${height}`);
    const projection = projectionRef.current;
    
    // Initial centering on Southeast Asia if new
    if (!activeId && projection.rotate()[0] === 0) {
      projection.rotate([-101, -4]); 
    }

    const path = d3.geoPath().projection(projection);
    
    svg.selectAll('*').remove();
    const defs = svg.append('defs');
    
    // Glossy Land Gradient
    const landGradient = defs.append('linearGradient').attr('id', 'land-grad').attr('x1', '0%').attr('y1', '0%').attr('x2', '100%').attr('y2', '100%');
    landGradient.append('stop').attr('offset', '0%').attr('stop-color', '#166534');
    landGradient.append('stop').attr('offset', '100%').attr('stop-color', '#064e3b');
    
    // Red Pin Glow
    const filter = defs.append("filter").attr("id", "glow");
    filter.append("feGaussianBlur").attr("stdDeviation", "3").attr("result", "blur");
    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "blur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // Ocean Depth Gradient
    const oceanGradient = defs.append('radialGradient').attr('id', 'ocean-grad')
      .attr('cx', '50%').attr('cy', '50%').attr('r', '50%');
    oceanGradient.append('stop').attr('offset', '70%').attr('stop-color', '#0c0a09');
    oceanGradient.append('stop').attr('offset', '100%').attr('stop-color', '#1c1917');

    const oceanGroup = svg.append('g');
    const graticuleGroup = svg.append('g');
    const landGroup = svg.append('g');
    const pinGroup = svg.append('g');

    const ocean = oceanGroup.append('circle')
      .attr('cx', width / 2)
      .attr('cy', height / 2)
      .attr('r', projection.scale())
      .attr('fill', 'url(#ocean-grad)')
      .attr('stroke', '#ffffff10')
      .attr('stroke-width', '1px');

    const graticule = d3.geoGraticule().step([15, 15]);
    const gratLines = graticuleGroup.append("path")
      .datum(graticule)
      .attr("class", "graticule")
      .attr("d", path as any)
      .attr("fill", "none")
      .attr("stroke", "#ffffff05")
      .attr("stroke-width", "0.5px");

    const render = () => {
      const currentScale = projection.scale();
      ocean.attr('r', currentScale);
      landGroup.selectAll('path.land').attr('d', path as any);
      gratLines.attr("d", path as any);
      
      const pins = pinGroup.selectAll<SVGGElement, GlobeDestination>('.pin-container').data(destinations, d => d.id);
      
      const pinsEnter = pins.enter().append('g')
        .attr('class', 'pin-container cursor-pointer')
        .on('click', (event, d) => {
          event.stopPropagation();
          onSelectDestination(d);
        });

      pinsEnter.append('circle')
        .attr('r', 5)
        .attr('fill', '#ef4444')
        .attr('stroke', '#fff')
        .attr('stroke-width', 1.5)
        .attr('filter', 'url(#glow)');

      pinsEnter.append('text')
        .attr('class', 'label-text-bg')
        .attr('dy', -12)
        .attr('text-anchor', 'middle')
        .attr('font-size', '11px')
        .attr('font-weight', '900')
        .attr('stroke', '#000')
        .attr('stroke-width', 3)
        .attr('stroke-linejoin', 'round')
        .attr('opacity', 0.8);

      pinsEnter.append('text')
        .attr('class', 'label-text')
        .attr('dy', -12)
        .attr('text-anchor', 'middle')
        .attr('font-size', '11px')
        .attr('font-weight', '900')
        .attr('fill', '#fff');

      const pinsMerged = pins.merge(pinsEnter as any);

      pinsMerged.attr('transform', d => {
        const coords = projection(d.coordinates);
        return coords ? `translate(${coords[0]},${coords[1]})` : 'translate(0,0)';
      }).style('display', d => {
        const rotate = projection.rotate();
        return d3.geoDistance(d.coordinates, [-rotate[0], -rotate[1]]) > (Math.PI / 1.95) ? 'none' : 'inline';
      });

      pinsMerged.select('circle')
        .attr('fill', d => d.id === activeId ? '#22c55e' : '#ef4444')
        .attr('r', d => d.id === activeId ? 8 : 5);

      const pinScaleFactor = Math.max(0.4, Math.min(2.0, currentScale / baseScaleRef.current));
      pinsMerged.selectAll<SVGTextElement, GlobeDestination>('text')
        .attr('font-size', d => `${(d.id === activeId ? 14 : 11) * pinScaleFactor}px`)
        .attr('dy', d => -(d.id === activeId ? 18 : 12) * pinScaleFactor);

      pinsMerged.select('.label-text').text(d => `${d.name.split(' ')[0]} ${d.priceLabel || ''}`);
      pinsMerged.select('.label-text-bg').text(d => `${d.name.split(' ')[0]} ${d.priceLabel || ''}`);

      if (activeId) {
        const active = destinations.find(d => d.id === activeId);
        if (active) {
          const coords = projection(active.coordinates);
          if (coords) setWeatherPos({ x: coords[0], y: coords[1] });
        }
      }
    };

    d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json').then((data: any) => {
      const countries = topojson.feature(data, data.objects.countries) as any;
      landGroup.selectAll('path')
        .data(countries.features)
        .enter().append('path')
        .attr('class', 'land')
        .attr('fill', 'url(#land-grad)')
        .attr('stroke', '#ffffff10')
        .attr('stroke-width', '0.5px')
        .attr('d', path as any);
      render();
    });

    // Precise Drag Handler using deltas
    const drag = d3.drag<SVGSVGElement, unknown>()
      .on('start', () => { 
        isDraggingRef.current = true;
        svg.style('cursor', 'grabbing');
      })
      .on('drag', (event) => {
        const rotate = projection.rotate();
        // Adjust delta based on sensitivity and scale
        const k = sensitivity * (800 / projection.scale());
        projection.rotate([
          rotate[0] + event.dx * k,
          rotate[1] - event.dy * k
        ]);
        render();
      })
      .on('end', () => { 
        isDraggingRef.current = false;
        svg.style('cursor', 'grab');
      });

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 10]) 
      .on('zoom', (event) => {
        if (event.sourceEvent?.type === 'wheel' || event.sourceEvent?.type === 'touchmove') {
          projection.scale(baseScaleRef.current * event.transform.k);
          render();
        }
      });

    // Apply handlers
    svg.call(drag as any).call(zoom as any);
    svg.style('cursor', 'grab');

    if (rotationTimerRef.current) rotationTimerRef.current.stop();
    
    // Ultra-slow "slow motion" cinematic rotation (reduced from 0.04 to 0.005)
    rotationTimerRef.current = d3.timer(() => {
      if (!activeId && !isDraggingRef.current) {
        projection.rotate([projection.rotate()[0] + 0.005, projection.rotate()[1]]);
        render();
      }
    });

    // Auto-centering transition for active pins
    if (activeId) {
      const active = destinations.find(d => d.id === activeId);
      if (active) {
        const currentRotate = projection.rotate();
        const targetRotate: [number, number, number] = [-active.coordinates[0], -active.coordinates[1], currentRotate[2]];
        d3.transition()
          .duration(1200)
          .ease(d3.easeCubicOut)
          .tween("rotate", () => {
            const r = d3.interpolate(projection.rotate(), targetRotate);
            return (t) => {
              projection.rotate(r(t) as [number, number, number]);
              render();
            };
          });
      }
    }

    return () => {
      if (rotationTimerRef.current) rotationTimerRef.current.stop();
    };
  }, [destinations, activeId]);

  const zoomTo = (factor: number) => {
    if (!svgRef.current) return;
    const currentScale = projectionRef.current.scale();
    projectionRef.current.scale(currentScale * factor);
    renderManual();
  };

  const resetZoom = () => {
    projectionRef.current.scale(baseScaleRef.current);
    renderManual();
  };

  const renderManual = () => {
    const svg = d3.select(svgRef.current);
    const path = d3.geoPath().projection(projectionRef.current);
    svg.selectAll('path').attr('d', path as any);
    svg.selectAll('circle').filter(':not(.pin-container circle)').attr('r', projectionRef.current.scale());
    // Trigger pin update
    svg.selectAll('.pin-container').attr('transform', (d: any) => {
      const coords = projectionRef.current(d.coordinates);
      return coords ? `translate(${coords[0]},${coords[1]})` : 'translate(0,0)';
    });
  };

  return (
    <div ref={containerRef} className="relative w-full h-[450px] sm:h-[550px] overflow-hidden rounded-[3rem] border border-white/10 flex items-center justify-center shadow-2xl transition-all duration-500"
         style={{ background: 'radial-gradient(circle at 50% 50%, #1c1917 0%, #0c0a09 100%)' }}>
      
      <div className="absolute inset-0 pointer-events-none z-10 opacity-30 bg-gradient-to-tr from-transparent via-white/5 to-white/10"></div>
      
      <div className="absolute top-8 left-10 z-20 flex flex-col gap-1 pointer-events-none">
        <div className="text-white/60 text-[10px] uppercase font-black tracking-[0.2em] flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${activeId ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
          {activeId ? "LOCATION IDENTIFIED" : "AUTONOMOUS SCANNING"}
        </div>
        <div className="text-white/20 text-[9px] uppercase font-bold tracking-widest">
          {activeId ? "Manual override active" : "Tactile navigation enabled"}
        </div>
      </div>
      
      <div className="absolute right-8 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-3 group-hover:opacity-100 transition-opacity duration-300">
        <button onClick={() => zoomTo(1.2)} className="w-11 h-11 bg-stone-900/60 hover:bg-red-600/80 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white border border-white/10 transition-all hover:scale-105 active:scale-90 shadow-2xl">
          <Plus className="w-5 h-5" />
        </button>
        <button onClick={resetZoom} className="w-11 h-11 bg-stone-900/60 hover:bg-stone-800 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white border border-white/10 text-[9px] font-black tracking-tighter transition-all hover:scale-105 active:scale-90 shadow-2xl">
          1:1
        </button>
        <button onClick={() => zoomTo(0.8)} className="w-11 h-11 bg-stone-900/60 hover:bg-stone-800 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white border border-white/10 transition-all hover:scale-105 active:scale-90 shadow-2xl">
          <Minus className="w-5 h-5" />
        </button>
      </div>

      <svg ref={svgRef} className="w-full h-full relative z-0 touch-none" />
      
      {weather && weatherPos && (
        <div className="absolute bg-stone-900/90 backdrop-blur-2xl text-white p-4 rounded-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500 pointer-events-none animate-in fade-in zoom-in-95" 
             style={{ left: weatherPos.x, top: weatherPos.y - 85, transform: 'translateX(-50%)' }}>
          <div className="flex flex-col items-center min-w-[100px]">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-2 bg-white/5 rounded-xl">
                <WeatherIcon condition={weather.condition} />
              </div>
              <span className="text-xl font-black">{weather.temp}°C</span>
            </div>
            <div className="text-[9px] uppercase font-black text-red-500 tracking-[0.1em]">Verified Hub</div>
          </div>
          <div className="absolute bottom-[-5px] left-1/2 -translate-x-1/2 w-4 h-4 bg-stone-900/90 rotate-45 border-r border-b border-white/10"></div>
        </div>
      )}
    </div>
  );
};

export default Globe;
