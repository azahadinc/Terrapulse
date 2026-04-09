"use client";

import React, { useState, useMemo, useEffect } from 'react';
import Globe from '@/components/Globe';
import Sidebar from '@/components/Sidebar';
import EventDetails from '@/components/EventDetails';
import { MOCK_EVENTS, EventCategory, TerraEvent } from '@/lib/events-data';
import { Toaster } from '@/components/ui/toaster';
import { Layers, Activity, Search, Sparkles, Loader2 } from 'lucide-react';
import { generateGlobalEvents } from '@/ai/flows/generate-events-flow';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [activeCategories, setActiveCategories] = useState<EventCategory[]>(['news', 'weather', 'social', 'politics', 'trends']);
  const [timelineValue, setTimelineValue] = useState(5); 
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<TerraEvent | null>(null);
  const [events, setEvents] = useState<TerraEvent[]>(MOCK_EVENTS);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const filteredEvents = useMemo(() => {
    const currentDate = new Date(2024, 2, 18 + timelineValue);
    return events.filter(event => {
      const isCategoryMatch = activeCategories.includes(event.category);
      const isSearchMatch = 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        event.description.toLowerCase().includes(searchTerm.toLowerCase());
      const eventDate = new Date(event.timestamp);
      const isTimelineMatch = eventDate <= currentDate;
      
      return isCategoryMatch && isSearchMatch && isTimelineMatch;
    });
  }, [events, activeCategories, searchTerm, timelineValue]);

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

  const handleAiSync = async (query?: string) => {
    setIsGenerating(true);
    try {
      const res = await generateGlobalEvents({ query, count: 12 });
      // Map generated events to ensure IDs are unique if merged
      const newEvents = res.events.map(e => ({
        ...e,
        id: `ai-${Math.random().toString(36).substr(2, 9)}`
      })) as TerraEvent[];
      
      setEvents(prev => [...newEvents, ...prev].slice(0, 100)); // Keep last 100 events
      
      toast({
        title: query ? `AI Search Complete` : "Global Data Sync Complete",
        description: `Successfully synthesized ${newEvents.length} new global data points.`,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Sync Failed",
        description: "Could not connect to the global AI network.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="relative w-screen h-screen bg-background overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(54,121,220,0.1),transparent)] pointer-events-none" />

      <div className="absolute top-8 left-0 right-0 z-10 px-8 flex justify-between items-center pointer-events-none">
        <div className="pointer-events-auto">
          <div className="glass-panel px-4 py-2 rounded-full flex items-center gap-2 text-white/60 text-sm font-medium">
            <Activity className="w-4 h-4 text-accent animate-pulse" />
            <span>LIVE NETWORK FEED</span>
          </div>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 pointer-events-auto">
          <div className="glass-panel px-4 py-2 rounded-full flex items-center gap-2 text-white/60 text-sm font-medium border-accent/10">
            <Layers className="w-4 h-4 text-primary" />
            <span>GLOBAL TOPOGRAPHY ACTIVE</span>
          </div>
        </div>

        <div className="flex gap-4 pointer-events-auto">
          <div className="glass-panel px-6 py-3 rounded-full flex items-center gap-4 text-white border-accent/20">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search globe..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && searchTerm && handleAiSync(searchTerm)}
              className="bg-transparent border-none outline-none text-sm w-48 placeholder:text-muted-foreground"
            />
            {searchTerm && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleAiSync(searchTerm)}
                disabled={isGenerating}
                className="h-6 px-2 text-[10px] bg-accent/20 text-accent hover:bg-accent/30 rounded-full"
              >
                {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3 mr-1" />}
                AI Search
              </Button>
            )}
          </div>
        </div>
      </div>

      <Globe 
        events={filteredEvents} 
        onEventClick={handleEventClick}
        hoveredEventId={selectedEvent?.id}
      />

      <Sidebar 
        activeCategories={activeCategories}
        onToggleCategory={handleToggleCategory}
        timelineValue={timelineValue}
        onTimelineChange={setTimelineValue}
        onAiSync={() => handleAiSync()}
        isGenerating={isGenerating}
      />

      <EventDetails 
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />

      <div className="absolute bottom-8 right-8 z-10 glass-panel p-4 rounded-xl text-[10px] font-mono text-white/40 tracking-widest uppercase">
        <div className="flex flex-col gap-1">
          <p>ENGINE: TERRA-CORE-V2</p>
          <p>LATENCY: 14MS</p>
          <p>SYNCED NODES: {filteredEvents.length}</p>
          <p>STATUS: {isGenerating ? 'SYNCING...' : 'SYNCED'}</p>
        </div>
      </div>

      <Toaster />
    </main>
  );
}
