import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Volume2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRadioPrograms } from "@/hooks/useRadioPrograms";
import { useToast } from "@/components/ui/use-toast";
const RadioPlayer = () => {
  const {
    t
  } = useLanguage();
  const {
    toast
  } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [volume, setVolume] = useState([70]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const {
    getCurrentProgram
  } = useRadioPrograms();
  const currentProgram = getCurrentProgram();
  const getCurrentProgramName = () => {
    return currentProgram?.name || "Conteúdo Motivacional 24h";
  };
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0] / 100;
    }
  }, [volume]);
  const togglePlay = async () => {
    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
      setShowPlayer(false);
      toast({
        title: t('radio.paused'),
        description: "Reprodução pausada"
      });
    } else {
      setIsLoading(true);
      setShowPlayer(true);
      try {
        if (audioRef.current) {
          await audioRef.current.play();
          setIsPlaying(true);
          setIsLoading(false);
          toast({
            title: t('radio.nowPlaying'),
            description: `Programa: ${getCurrentProgramName()}`
          });
        }
      } catch (error) {
        setIsLoading(false);
        setShowPlayer(false);
        toast({
          title: "Erro de conexão",
          description: "Não foi possível conectar ao stream da rádio",
          variant: "destructive"
        });
      }
    }
  };
  return <>
      

      {/* Floating Player */}
      {showPlayer && <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 z-50 min-w-[280px]">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm font-medium">🎵 Rádio Instituto Empreendedor</span>
            <Button variant="outline" size="sm" onClick={togglePlay} className="h-6 w-6 p-0">
              {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
            </Button>
          </div>
          <div className="text-xs text-gray-500">
            🔴 Ao vivo - {getCurrentProgramName()}
          </div>
        </div>}

      {/* Hidden Audio Element */}
      <audio ref={audioRef} src="https://stream.zeno.fm/ug07t11zn0hvv" preload="none" onError={() => {
      setIsPlaying(false);
      setIsLoading(false);
      setShowPlayer(false);
      toast({
        title: "Erro de stream",
        description: "Não foi possível carregar o stream da rádio",
        variant: "destructive"
      });
    }} onLoadedData={() => {
      setIsLoading(false);
    }} />
    </>;
};
export default RadioPlayer;