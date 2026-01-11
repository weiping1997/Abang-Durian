
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { Cloud, Sun, CloudRain, CloudLightning, Snowflake, Wind } from 'lucide-react';
import { GlobeDestination, WeatherData, FlightInfo } from '../types.ts';

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
  return <Wind className="w-4 h-4 text-slate-400" />;
};

const Globe: React.FC<GlobeProps> = ({ destinations, onSelectDestination, activeId, weather }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [weatherPos, setWeatherPos] = useState<{ x: number, y: number } | null>(null);
  const projectionRef = useRef(d3.geoOrthographic().scale(250).center([0, 0]).translate([300, 300]));

  useEffect(() => {
    if (!svgRef.current) return;
    const width = 600, height = 600, sensitivity = 75;
    const svg = d3.select(svgRef.current).attr('viewBox', `0 0 ${width} ${height}`);
    const projection = projectionRef.current;
    const path = d3.geoPath().projection(projection);
    svg.selectAll('*').remove();
    const defs = svg.append('defs');
    const landGradient = defs.append('linearGradient').attr('id', 'land-grad').attr('x1', '0%').attr('y1', '0%').attr('x2', '100%').attr('y2', '100%');
    landGradient.append('stop').attr('offset', '0%').attr('stop-color', '#14532d');
    landGradient.append('stop').attr('offset', '100%').attr('stop-color', '#064e3b');
    const oceanGroup = svg.append('g');
    const landGroup = svg.append('g');
    const pinGroup = svg.append('g');
    oceanGroup.append('circle').attr('cx', width / 2).attr('cy', height / 2).attr('r', projection.scale()).attr('fill', '#0c0a09');
    const render = () => {
      landGroup.selectAll('path.land').attr('d', path as any);
      const pins = pinGroup.selectAll<SVGGElement, GlobeDestination>('.pin-container').data(destinations, d => d.id);
      const pinsEnter = pins.enter().append('g').attr('class', 'pin-container').on('click', (_, d) => onSelectDestination(d));
      pinsEnter.append('circle').attr('r', 4).attr('fill', '#22c55e').attr('stroke', '#fff');
      const pinsMerged = pins.merge(pinsEnter as any);
      pinsMerged.attr('transform', d => {
        const coords = projection(d.coordinates);
        return coords ? `translate(${coords[0]},${coords[1]})` : 'translate(0,0)';
      }).style('display', d => {
        const rotate = projection.rotate();
        return d3.geoDistance(d.coordinates, [-rotate[0], -rotate[1]]) > (Math.PI / 2.1) ? 'none' : 'inline';
      });
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
      landGroup.selectAll('path').data(countries.features).enter().append('path').attr('class', 'land').attr('fill', 'url(#land-grad)').attr('d', path as any);
      render();
    });
    const timer = d3.timer(() => { if (!activeId) { projection.rotate([projection.rotate()[0] + 0.1, projection.rotate()[1]]); render(); } });
    return () => timer.stop();
  }, [destinations, activeId]);

  return (
    <div className="relative w-full h-[400px] overflow-hidden rounded-[2.5rem] bg-stone-950 border border-white/5 flex items-center justify-center">
      <svg ref={svgRef} className="max-w-full max-h-full" />
      {weather && weatherPos && (
        <div className="absolute bg-stone-900 text-white p-3 rounded-xl border border-white/10" style={{ left: weatherPos.x, top: weatherPos.y - 60, transform: 'translateX(-50%)' }}>
          <div className="flex items-center gap-2"><WeatherIcon condition={weather.condition} /> {weather.temp}°C</div>
        </div>
      )}
    </div>
  );
};

export default Globe;
