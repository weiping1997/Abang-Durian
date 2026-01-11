
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { Cloud, Sun, CloudRain, CloudLightning, Snowflake, Wind, Plane, ArrowUpRight } from 'lucide-react';
import { GlobeDestination, WeatherData, FlightInfo } from '../types';

interface GlobeProps {
  destinations: GlobeDestination[];
  onSelectDestination: (dest: GlobeDestination) => void;
  activeId?: string;
  weather?: WeatherData | null;
  flight?: FlightInfo | null;
  routePoints?: GlobeDestination[];
}

const WeatherIcon = ({ condition }: { condition: string }) => {
  const c = condition.toLowerCase();
  if (c.includes('cloud')) return <Cloud className="w-4 h-4 text-slate-300" />;
  if (c.includes('rain')) return <CloudRain className="w-4 h-4 text-indigo-400" />;
  if (c.includes('clear')) return <Sun className="w-4 h-4 text-yellow-400" />;
  if (c.includes('snow')) return <Snowflake className="w-4 h-4 text-blue-200" />;
  if (c.includes('bolt') || c.includes('storm')) return <CloudLightning className="w-4 h-4 text-purple-400" />;
  return <Wind className="w-4 h-4 text-slate-400" />;
};

const Globe: React.FC<GlobeProps> = ({ destinations, onSelectDestination, activeId, weather, flight, routePoints = [] }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [weatherPos, setWeatherPos] = useState<{ x: number, y: number } | null>(null);
  const projectionRef = useRef(d3.geoOrthographic().scale(250).center([0, 0]).translate([300, 300]));

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 600;
    const height = 600;
    const sensitivity = 75;
    const svg = d3.select(svgRef.current).attr('viewBox', `0 0 ${width} ${height}`);
    const projection = projectionRef.current;
    const path = d3.geoPath().projection(projection);

    svg.selectAll('*').remove();

    // Definitions for Filters & Gradients
    const defs = svg.append('defs');
    
    const pinGlow = defs.append('filter').attr('id', 'pin-glow').attr('x', '-100%').attr('y', '-100%').attr('width', '300%').attr('height', '300%');
    pinGlow.append('feGaussianBlur').attr('in', 'SourceGraphic').attr('stdDeviation', 4).attr('result', 'blur');
    const pinMerge = pinGlow.append('feMerge');
    pinMerge.append('feMergeNode').attr('in', 'blur');
    pinMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    const landGradient = defs.append('linearGradient').attr('id', 'land-grad').attr('x1', '0%').attr('y1', '0%').attr('x2', '100%').attr('y2', '100%');
    landGradient.append('stop').attr('offset', '0%').attr('stop-color', '#14532d');
    landGradient.append('stop').attr('offset', '100%').attr('stop-color', '#064e3b');

    const oceanGroup = svg.append('g').attr('class', 'ocean-layer');
    const landGroup = svg.append('g').attr('class', 'land-layer');
    const routeGroup = svg.append('g').attr('class', 'route-layer');
    const pinGroup = svg.append('g').attr('class', 'pin-layer');

    oceanGroup.append('circle')
      .attr('cx', width / 2)
      .attr('cy', height / 2)
      .attr('r', projection.scale())
      .attr('fill', '#0c0a09')
      .attr('stroke', 'rgba(255,255,255,0.05)')
      .attr('stroke-width', '1px');

    const graticule = d3.geoGraticule();
    oceanGroup.append('path')
      .datum(graticule)
      .attr('class', 'graticule')
      .attr('d', path as any)
      .attr('fill', 'none')
      .attr('stroke', 'rgba(255,255,255,0.03)')
      .attr('stroke-width', '0.5px');

    const drag = d3.drag<SVGSVGElement, unknown>().on('drag', (event) => {
      const rotate = projection.rotate();
      const k = sensitivity / projection.scale();
      projection.rotate([rotate[0] + event.dx * k, rotate[1] - event.dy * k]);
      render();
    });

    svg.call(drag as any);

    const render = () => {
      landGroup.selectAll('path.land').attr('d', path as any);
      oceanGroup.selectAll('path.graticule').attr('d', path as any);
      
      const pins = pinGroup.selectAll<SVGGElement, GlobeDestination>('.pin-container').data(destinations, d => d.id);
      const pinsEnter = pins.enter().append('g')
        .attr('class', 'pin-container')
        .style('cursor', 'pointer')
        .on('click', (_, d) => onSelectDestination(d));
      
      pinsEnter.append('circle').attr('class', 'sonar-ring').attr('fill', 'none').attr('stroke', '#4ade80').attr('stroke-width', 2);
      pinsEnter.append('circle').attr('class', 'pin-main').attr('stroke', '#fff').attr('stroke-width', 1.5);

      const pinsMerged = pins.merge(pinsEnter as any);
      pinsMerged.style('display', d => {
        const rotate = projection.rotate();
        const distance = d3.geoDistance(d.coordinates, [-rotate[0], -rotate[1]]);
        return distance > (Math.PI / 2.1) ? 'none' : 'inline';
      });

      pinsMerged.select('.pin-main')
        .attr('r', d => d.id === activeId ? 8 : 4)
        .attr('fill', d => d.id === activeId ? '#fbbf24' : '#22c55e')
        .attr('cx', d => {
          const coords = projection(d.coordinates);
          if (d.id === activeId && coords) setWeatherPos({ x: coords[0], y: coords[1] });
          return coords ? coords[0] : 0;
        })
        .attr('cy', d => {
          const coords = projection(d.coordinates);
          return coords ? coords[1] : 0;
        })
        .style('filter', d => d.id === activeId ? 'url(#pin-glow)' : 'none');

      pinsMerged.select('.sonar-ring')
        .attr('cx', d => projection(d.coordinates)?.[0] || 0)
        .attr('cy', d => projection(d.coordinates)?.[1] || 0)
        .style('display', d => d.id === activeId ? 'inline' : 'none');

      pins.exit().remove();
      if (!activeId) setWeatherPos(null);
    };

    d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json').then((data: any) => {
      const countries = topojson.feature(data, data.objects.countries) as any;
      landGroup.selectAll('path')
        .data(countries.features)
        .enter().append('path')
        .attr('class', 'land')
        .attr('fill', 'url(#land-grad)')
        .attr('stroke', 'rgba(255,255,255,0.1)')
        .attr('stroke-width', '0.5px')
        .attr('d', path as any);
      render();
    });

    const timer = d3.timer(() => {
      if (!activeId) {
        const rotate = projection.rotate();
        projection.rotate([rotate[0] + 0.1, rotate[1]]);
        render();
      }
    });

    if (activeId) {
      const activeDest = destinations.find(d => d.id === activeId);
      if (activeDest) {
        timer.stop();
        d3.transition().duration(1200).ease(d3.easeCubicInOut).tween("rotate", () => {
          const startRotation = projection.rotate();
          const r = d3.interpolate(startRotation, [-activeDest.coordinates[0], -activeDest.coordinates[1], startRotation[2] || 0]);
          return (t: number) => { projection.rotate(r(t) as any); render(); };
        });
      }
    }

    return () => timer.stop();
  }, [destinations, activeId, onSelectDestination]);

  return (
    <div className="relative flex justify-center items-center w-full h-[500px] overflow-hidden rounded-[2.5rem] bg-stone-950/40 border border-white/5 backdrop-blur-3xl shadow-2xl">
      <style>{`
        @keyframes sonar { 0% { r: 10px; opacity: 0.8; stroke-width: 2px; } 100% { r: 35px; opacity: 0; stroke-width: 0.5px; } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        .sonar-ring { animation: sonar 2s infinite ease-out; pointer-events: none; }
        .weather-badge { animation: float 3s ease-in-out infinite; }
      `}</style>
      <svg ref={svgRef} className="max-w-full max-h-full cursor-grab active:cursor-grabbing" />
      
      {weather && weatherPos && (
        <div className="absolute weather-badge z-20 pointer-events-none" style={{ left: `${weatherPos.x}px`, top: `${weatherPos.y - 100}px`, transform: 'translateX(-50%)' }}>
          <div className="bg-stone-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl flex flex-col gap-2 min-w-[180px] pointer-events-auto">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center border border-green-500/20"><WeatherIcon condition={weather.condition} /></div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white leading-none">{weather.temp}°c</span>
                <span className="text-[8px] uppercase tracking-widest text-green-400 font-black">Harvest Status: {weather.condition}</span>
              </div>
            </div>
          </div>
          <div className="w-px h-8 bg-gradient-to-t from-transparent via-white/20 to-white/5 mx-auto -mt-px" />
        </div>
      )}
    </div>
  );
};

export default Globe;
