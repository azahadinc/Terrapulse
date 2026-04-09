
"use client";

import React, { useState, useEffect } from 'react';
import { TerraEvent } from '@/lib/events-data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Sparkles, MapPin, Clock, ArrowUpRight, Loader2, Info } from 'lucide-react';
import { summarizeEvent } from '@/ai/flows/ai-event-summarizer';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface EventDetailsProps {
  event: TerraEvent | null;
  onClose: () => void;
}

const EventDetails: React.FC<EventDetailsProps> = ({ event, onClose }) => {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setSummary(null);
  }, [event?.id]);

  if (!event) return null;

  const handleSummarize = async () => {
    setLoading(true);
    try {
      const res = await summarizeEvent({ eventDetails: event.description });
      setSummary(res.summary);
    } catch (error) {
      console.error("AI Error:", error);
      toast({
        title: "Synthesis Error",
        description: "Unable to reach the AI core. Please check your connection.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewSource = () => {
    toast({
      title: "Opening Source Feed",
      description: `Connecting to ${event.category} satellite data stream for event ID: ${event.id}`,
    });
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'news': return 'text-[#3679DC] border-[#3679DC] bg-[#3679DC]/10';
      case 'politics': return 'text-red-500 border-red-500 bg-red-500/10';
      case 'trends': return 'text-pink-500 border-pink-500 bg-pink-500/10';
      case 'weather': return 'text-[#47E1E5] border-[#47E1E5] bg-[#47E1E5]/10';
      case 'social': return 'text-green-500 border-green-500 bg-green-500/10';
      default: return 'text-white border-white bg-white/10';
    }
  };

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-20 w-[420px] glass-panel rounded-3xl overflow-hidden animate-in slide-in-from-right-10 duration-500">
      {/* Cover Image Placeholder */}
      <div className="h-48 relative bg-secondary overflow-hidden">
        <img 
          src={`https://picsum.photos/seed/${event.id}/800/600`} 
          alt={event.title}
          className="w-full h-full object-cover opacity-60 transition-transform duration-700 hover:scale-110"
          data-ai-hint="event photo"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-4 right-4 bg-black/50 hover:bg-black/80 text-white rounded-full h-8 w-8"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="p-8 pt-0 -mt-6 relative flex flex-col gap-6">
        <div>
          <div className="flex gap-2 mb-3">
            <Badge variant="outline" className={`capitalize font-bold px-3 py-1 ${getCategoryColor(event.category)}`}>
              {event.category}
            </Badge>
            <Badge variant="secondary" className="bg-white/10 text-white">
              Intensity: {event.intensity}/10
            </Badge>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2 font-headline">{event.title}</h2>
        </div>

        <div className="flex flex-col gap-4 text-sm text-muted-foreground border-y border-white/5 py-4">
          <div className="items-center gap-3 hidden md:flex">
            <MapPin className="w-4 h-4 text-accent" />
            <span>Coordinates: {event.lat.toFixed(4)}, {event.lon.toFixed(4)}</span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-accent" />
            <span>Recorded: {format(new Date(event.timestamp), 'PPpp')}</span>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-white/80 leading-relaxed leading-7">
            {event.description}
          </p>

          {summary ? (
            <div className="p-4 rounded-xl bg-primary/20 border border-primary/30 animate-in fade-in duration-300">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-accent" />
                <span className="text-xs font-bold uppercase tracking-wider text-accent">AI Summary</span>
              </div>
              <p className="text-sm text-white font-medium leading-relaxed italic">
                "{summary}"
              </p>
            </div>
          ) : (
            <Button 
              onClick={handleSummarize} 
              disabled={loading}
              className="w-full bg-accent hover:bg-accent/90 text-background font-bold h-12 rounded-xl group"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2 group-hover:animate-bounce" />
              )}
              {loading ? "Synthesizing Data..." : "Generate AI Summary"}
            </Button>
          )}

          <Button 
            variant="outline" 
            onClick={handleViewSource}
            className="w-full border-white/10 hover:bg-white/5 text-white h-12 rounded-xl"
          >
            View Source Data
            <ArrowUpRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
