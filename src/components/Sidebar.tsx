"use client";

import React from 'react';
import { EventCategory } from '@/lib/events-data';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Globe as GlobeIcon, Cloud, Users, Newspaper, Filter, Landmark, TrendingUp, Sparkles, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

interface SidebarProps {
  activeCategories: EventCategory[];
  onToggleCategory: (category: EventCategory) => void;
  timelineValue: number;
  onTimelineChange: (value: number) => void;
  onAiSync: () => void;
  isGenerating: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeCategories, 
  onToggleCategory, 
  timelineValue, 
  onTimelineChange,
  onAiSync,
  isGenerating
}) => {
  const categories: { id: EventCategory; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'news', label: 'News', icon: <Newspaper className="w-4 h-4" />, color: 'bg-[#3679DC]' },
    { id: 'politics', label: 'Politics', icon: <Landmark className="w-4 h-4" />, color: 'bg-red-500' },
    { id: 'trends', label: 'Trends', icon: <TrendingUp className="w-4 h-4" />, color: 'bg-pink-500' },
    { id: 'weather', label: 'Weather', icon: <Cloud className="w-4 h-4" />, color: 'bg-[#47E1E5]' },
    { id: 'social', label: 'Social', icon: <Users className="w-4 h-4" />, color: 'bg-green-500' },
  ];

  const currentDate = new Date(2024, 2, 18 + timelineValue);

  return (
    <div className="fixed left-6 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-4 w-72">
      {/* Branding */}
      <div className="glass-panel p-6 rounded-2xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/20 rounded-lg">
            <GlobeIcon className="w-6 h-6 text-accent" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-headline">TerraPulse</h1>
        </div>
        <p className="text-sm text-muted-foreground">Global real-time trend & event visualizer</p>
      </div>

      {/* AI Control */}
      <div className="glass-panel p-4 rounded-2xl border-accent/20 bg-accent/5">
        <Button 
          onClick={onAiSync} 
          disabled={isGenerating}
          className="w-full bg-accent hover:bg-accent/90 text-background font-bold h-12 rounded-xl group"
        >
          {isGenerating ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <Sparkles className="w-4 h-4 mr-2 group-hover:animate-pulse" />
          )}
          {isGenerating ? "Syncing Global AI..." : "Sync Global AI Data"}
        </Button>
      </div>

      {/* Filtering */}
      <div className="glass-panel p-6 rounded-2xl">
        <div className="flex items-center gap-2 mb-4 text-white">
          <Filter className="w-4 h-4 text-accent" />
          <h2 className="text-sm font-semibold uppercase tracking-wider">Event Categories</h2>
        </div>
        <div className="flex flex-col gap-2">
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={activeCategories.includes(cat.id) ? "default" : "outline"}
              onClick={() => onToggleCategory(cat.id)}
              className={`justify-start gap-3 w-full transition-all duration-300 ${
                activeCategories.includes(cat.id) 
                  ? 'bg-primary border-primary hover:bg-primary/90' 
                  : 'bg-transparent border-white/10 hover:bg-white/5'
              }`}
            >
              <span className={`p-1.5 rounded-md ${cat.color} text-white`}>
                {cat.icon}
              </span>
              <span className="flex-1 text-left">{cat.label}</span>
              {activeCategories.includes(cat.id) && (
                <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="glass-panel p-6 rounded-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-white">Historical Timeline</h2>
          <Badge variant="outline" className="border-accent/30 text-accent bg-accent/10">
            {format(currentDate, 'MMM d, yyyy')}
          </Badge>
        </div>
        <div className="px-2">
          <Slider
            value={[timelineValue]}
            max={5}
            step={1}
            onValueChange={(val) => onTimelineChange(val[0])}
            className="mb-4"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground font-medium">
            <span>MAR 18</span>
            <span>MAR 20</span>
            <span>MAR 23</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
