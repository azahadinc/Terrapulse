
"use client";

import React, { useState, useMemo } from 'react';
import Globe from '@/components/Globe';
import Sidebar from '@/components/Sidebar';
import EventDetails from '@/components/EventDetails';
import { MOCK_EVENTS, EventCategory, TerraEvent } from '@/lib/events-data';
import { Toaster } from '@/components/ui/toaster';
import { Layers, Activity, Search } from 'lucide-react';

export default function Home() {
  const [activeCategories, setActiveCategories] = useState<EventCategory[]>(['news', 'weather', 'social', 'politics', 'trends']);
  const [timelineValue, setTimelineValue] = useState(5); // Default to latest
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<TerraEvent | null>(null);

  const filteredEvents = useMemo(() => {
    const currentDate = new Date(2024, 2, 18 + timelineValue);
    return MOCK_EVENTS.filter(event => {
      const isCategoryMatch = activeCategories.includes(event.category);
      const isSearchMatch = 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        event.description.toLowerCase().includes(searchTerm.toLowerCase());
      const eventDate = new Date(event.timestamp);
      const isTimelineMatch = eventDate <= currentDate;
      
      return isCategoryMatch && isSearchMatch && isTimelineMatch;
    });
  }, [activeCategories, searchTerm, timelineValue]);

  const handleToggleCategory = (category: EventCategory) => {
    setActiveCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };

  const handleEventClick = (event: TerraEvent) => {
    setSelectedEvent(event);
  };

  return (
    <main className="relative w-screen h-screen bg-background overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(54,121,220,0.1),transparent)] pointer-events-none" />

      {/* Top Navigation Overlay */}
      <div className="absolute top-8 left-0 right-0 z-10 px-8 flex justify-between items-center pointer-events-none">
        {/* Left Section */}
        <div className="pointer-events-auto">
          <div className="glass-panel px-4 py-2 rounded-full flex items-center gap-2 text-white/60 text-sm font-medium">
            <Activity className="w-4 h-4 text-accent animate-pulse" />
            <span>LIVE NETWORK FEED</span>
          </div>
        </div>

        {/* Center Section (Absolute Centered) */}
        <div className="absolute left-1/2 -translate-x-1/2 pointer-events-auto">
          <div className="glass-panel px-4 py-2 rounded-full flex items-center gap-2 text-white/60 text-sm font-medium border-accent/10">
            <Layers className="w-4 h-4 text-primary" />
            <span>GLOBAL TOPOGRAPHY ACTIVE</span>
          </div>
        </div>

        {/* Right Section */}
        <div className="glass-panel px-6 py-3 rounded-full flex items-center gap-4 text-white pointer-events-auto border-accent/20">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search globe for events..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none outline-none text-sm w-64 placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Main 3D Scene */}
      <Globe 
        events={filteredEvents} 
        onEventClick={handleEventClick}
        hoveredEventId={selectedEvent?.id}
      />

      {/* Control Sidebar */}
      <Sidebar 
        activeCategories={activeCategories}
        onToggleCategory={handleToggleCategory}
        timelineValue={timelineValue}
        onTimelineChange={setTimelineValue}
      />

      {/* Detail Panel */}
      <EventDetails 
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />

      {/* HUD Info (Bottom Right) */}
      <div className="absolute bottom-8 right-8 z-10 glass-panel p-4 rounded-xl text-[10px] font-mono text-white/40 tracking-widest uppercase">
        <div className="flex flex-col gap-1">
          <p>ENGINE: TERRA-CORE-V2</p>
          <p>LATENCY: 14MS</p>
          <p>SYNCED NODES: {filteredEvents.length}</p>
          <p>STATUS: SYNCED</p>
        </div>
      </div>

      <Toaster />
    </main>
  );
}
