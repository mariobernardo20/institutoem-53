import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Radio as RadioIcon, Users, Globe, ArrowLeft, Cloud, Sun, CloudRain, Thermometer, Wind, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { PortugalNews } from "@/components/PortugalNews";
import { WeatherWidget } from "@/components/WeatherWidget";
import { RadioTeam } from "@/components/RadioTeam";
import RadioComments from "@/components/RadioComments";
import RadioPolls from "@/components/RadioPolls";
import { useRadioPrograms } from "@/hooks/useRadioPrograms";
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
const Radio = () => {
  const {
    toast
  } = useToast();
  const {
    t
  } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [listeners, setListeners] = useState(2847);
  const [currentTime, setCurrentTime] = useState(new Date());
  const audioRef = useRef<HTMLAudioElement>(null);
  const {
    getTodayPrograms,
    getCurrentProgram
  } = useRadioPrograms();
  useEffect(() => {
    // Update current time every minute to refresh current program
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    // Simulate listener count updates
    const listenerInterval = setInterval(() => {
      setListeners(prev => prev + Math.floor(Math.random() * 10) - 5);
    }, 30000);
    return () => {
      clearInterval(timeInterval);
      clearInterval(listenerInterval);
    };
  }, []);
  const currentProgram = getCurrentProgram();
  const todayPrograms = getTodayPrograms();
  const getCurrentProgramName = () => {
    if (currentProgram) {
      return currentProgram.name;
    }
    return "Conteúdo Motivacional 24h";
  };
  const getCurrentProgramDescription = () => {
    if (currentProgram) {
      return `Apresentado por ${currentProgram.host} - ${currentProgram.description}`;
    }
    return "Música e conteúdo inspiracional para empreendedores";
  };
  const togglePlay = async () => {
    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
      toast({
        title: "Rádio pausada",
        description: "Reprodução pausada com sucesso"
      });
    } else {
      setIsLoading(true);
      toast({
        title: t('radio.connecting'),
        description: "A conectar à Rádio Instituto Empreendedor"
      });
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
        toast({
          title: "Erro de conexão",
          description: "Não foi possível conectar ao stream da rádio",
          variant: "destructive"
        });
      }
    }
  };
  const stations = [{
    name: "Rádio Instituto Empreendedor",
    description: "A primeira rádio portuguesa dedicada ao empreendedorismo e inovação",
    listeners: listeners.toLocaleString(),
    quality: "320 kbps",
    category: "Empreendedorismo",
    isLive: true,
    country: "PT",
    frequency: "96.5 FM",
    founded: "2020"
  }];
  const getScheduleDisplay = () => {
    if (todayPrograms.length > 0) {
      return todayPrograms.map(program => ({
        time: `${program.start_time} - ${program.end_time}`,
        program: program.name,
        host: program.host,
        description: program.description
      }));
    }

    // Fallback schedule if no programs are configured
    return [{
      time: "00:00 - 23:59",
      program: "Conteúdo Motivacional 24h",
      host: "Sistema Automático",
      description: "Música e conteúdo inspiracional - Configure a programação no painel administrativo"
    }];
  };
  const schedule = getScheduleDisplay();
  return <div className="min-h-screen bg-gray-100">
      <Header />
      
      {/* Header with Live Status */}
      <div className="bg-slate-700 text-white p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <RadioIcon className="h-6 w-6" />
            <span className="text-lg font-medium">AO VIVO - Rádio Instituto Empreendedor</span>
            <Badge className="bg-red-500 text-white text-xs px-2 py-1 rounded">● LIVE</Badge>
          </div>
          <Button variant="ghost" size="sm" className="text-white hover:bg-slate-600" asChild>
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Radio Info Section */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 flex items-center justify-center">
              <Button onClick={togglePlay} disabled={isLoading} className="bg-transparent hover:bg-transparent p-0 h-auto">
                {isLoading ? <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" /> : isPlaying ? <Pause className="h-8 w-8 text-white" /> : <Play className="h-8 w-8 text-white" />}
              </Button>
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">Rádio Instituto Empreendedor</h1>
              <p className="text-green-100 mb-2">🇵🇹 A primeira rádio portuguesa dedicada ao empreendedorismo</p>
              <p className="text-sm text-green-200">96.5 FM | 320 kbps | Fundada em 2020</p>
            </div>

            <div className="text-right">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5" />
                <span className="font-bold text-2xl">{listeners.toLocaleString()}</span>
                <span className="text-sm">{t('radio.listeners')}</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Globe className="h-4 w-4" />
                <span className="text-sm">Lisboa, Portugal</span>
              </div>
              <div className="text-xs text-green-200">
                Alcance nacional e internacional
              </div>
            </div>
          </div>

          {/* Now Playing Section */}
          <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">{t('radio.currentProgram')}</span>
              </div>
              <div className="text-xs text-green-200">
                {currentTime.toLocaleTimeString("pt-PT", {
                hour: '2-digit',
                minute: '2-digit'
              })}
              </div>
            </div>
            <p className="text-xl font-bold mb-1">{getCurrentProgramName()}</p>
            <p className="text-sm text-green-200">
              {getCurrentProgramDescription()}
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Available Stations */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <RadioIcon className="h-5 w-5" />
              <h2 className="text-xl font-bold">Estação Disponível</h2>
            </div>
            <p className="text-gray-600 mb-6">A primeira rádio portuguesa dedicada ao empreendedorismo</p>
            
            <div className="space-y-4 mb-8">
              {stations.map((station, index) => <Card key={index} className="border hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium text-sm">🇵🇹 {station.country}</span>
                          <span className="font-bold">{station.name}</span>
                          {station.isLive && <Badge className="bg-red-500 text-white text-xs px-2 py-1">AO VIVO</Badge>}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{station.description}</p>
                        <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <span>👥 {station.listeners} ouvintes</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>📻 {station.quality}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>📡 {station.frequency}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>📅 Desde {station.founded}</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className="ml-4">
                        {station.category}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>)}
            </div>

            {/* Daily Schedule */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-2">{t('radio.schedule')}</h2>
              <p className="text-gray-600 mb-6">Horários e apresentadores - {currentTime.toLocaleDateString("pt-PT")}</p>
              
              <div className="space-y-3">
                {schedule.map((item, index) => {
                const now = new Date();
                const currentTime = now.getHours() * 60 + now.getMinutes();
                const [startHour, startMinute] = item.time.split(' - ')[0].split(':').map(Number);
                const [endHour, endMinute] = item.time.split(' - ')[1].split(':').map(Number);
                const startTime = startHour * 60 + startMinute;
                const endTime = endHour * 60 + endMinute;
                const isCurrentProgram = currentTime >= startTime && currentTime < endTime;
                return <div key={index} className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${isCurrentProgram ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}`}>
                      <div className="text-sm font-mono text-gray-600 min-w-[120px]">
                        {item.time}
                        {isCurrentProgram && <div className="text-xs text-green-600 font-normal mt-1">
                            • AGORA
                          </div>}
                      </div>
                      <div className="flex-1">
                        <div className={`font-medium ${isCurrentProgram ? 'text-green-700' : ''}`}>
                          {item.program}
                        </div>
                        <div className="text-sm text-gray-600">{item.host}</div>
                        <div className="text-xs text-gray-500 mt-1">{item.description}</div>
                      </div>
                      {isCurrentProgram && <div className="flex-shrink-0">
                          <Badge className="bg-green-500 text-white text-xs">
                            AO VIVO
                          </Badge>
                        </div>}
                    </div>;
              })}
              </div>
            </div>

            {/* Interactive Section - Polls and Comments */}
            <div className="space-y-8">
              <RadioPolls programId={currentProgram?.id} />
              <RadioComments programId={currentProgram?.id} />
            </div>
          </div>

          {/* Sidebar with Weather, News and Team */}
          <div className="space-y-6">
            <WeatherWidget />
            <PortugalNews />
            <RadioTeam />
          </div>
        </div>
      </div>

      {/* Hidden Audio Element for Stream */}
      <audio ref={audioRef} src="https://stream.zeno.fm/ug07t11zn0hvv" preload="none" onError={() => {
      setIsPlaying(false);
      setIsLoading(false);
      toast({
        title: "Erro de stream",
        description: "Não foi possível carregar o stream da rádio",
        variant: "destructive"
      });
    }} onLoadedData={() => {
      setIsLoading(false);
    }} />

      {/* Instituto Empreendedor Information Section */}
      <div className="bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <img 
            src="/lovable-uploads/53771331-bace-4f5a-85f6-ef64b646b7b2.png" 
            alt="Instituto Empreendedor - Informações e Links"
            className="w-full max-w-4xl mx-auto"
          />
        </div>
      </div>

      {/* Radio Floating Player */}
      {isPlaying}
    </div>;
};
export default Radio;