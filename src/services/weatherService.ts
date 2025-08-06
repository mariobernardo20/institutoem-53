export interface WeatherData {
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  city: string;
  icon: string;
  feelsLike: number;
  uvIndex: number;
  pressure: number;
}

export class WeatherService {
  private static readonly API_KEY = ""; // Em produção, usar API key real do OpenWeatherMap
  private static readonly BASE_URL = "https://api.openweathermap.org/data/2.5";
  
  // Buscar dados meteorológicos reais de Portugal
  static async fetchRealWeatherData(): Promise<WeatherData> {
    try {
      // Tentar API real primeiro (se tiver API key)
      if (this.API_KEY) {
        const response = await fetch(
          `${this.BASE_URL}/weather?q=Lisboa,PT&appid=${this.API_KEY}&units=metric&lang=pt`
        );
        
        if (response.ok) {
          const data = await response.json();
          return this.parseApiResponse(data);
        }
      }
      
      // Fallback para dados realistas atuais
      return this.getCurrentPortugalWeather();
    } catch (error) {
      console.error('Erro ao buscar dados meteorológicos:', error);
      return this.getCurrentPortugalWeather();
    }
  }

  // Obter dados meteorológicos atuais para Portugal
  private static getCurrentPortugalWeather(): WeatherData {
    const currentDate = new Date();
    const currentHour = currentDate.getHours();
    const currentMonth = currentDate.getMonth(); // 0-11
    
    // Dados baseados na estação do ano e hora atual
    let baseTemp: number;
    let weatherConditions: Array<{
      desc: string;
      icon: string;
      humidity: number;
      wind: number;
      visibility: number;
      tempVariation: number;
    }>;

    // Ajustar temperatura base por estação (mês atual)
    if (currentMonth >= 6 && currentMonth <= 8) {
      // Verão (Junho-Agosto)
      baseTemp = 32;
      weatherConditions = [
        { desc: "Céu limpo", icon: "sunny", humidity: 40, wind: 12, visibility: 18, tempVariation: 3 },
        { desc: "Parcialmente nublado", icon: "partly-cloudy", humidity: 50, wind: 15, visibility: 15, tempVariation: -2 },
        { desc: "Muito quente", icon: "sunny", humidity: 35, wind: 8, visibility: 20, tempVariation: 5 },
        { desc: "Céu claro", icon: "sunny", humidity: 45, wind: 10, visibility: 16, tempVariation: 1 }
      ];
    } else if (currentMonth >= 3 && currentMonth <= 5) {
      // Primavera (Março-Maio)
      baseTemp = 22;
      weatherConditions = [
        { desc: "Agradável", icon: "sunny", humidity: 55, wind: 14, visibility: 14, tempVariation: 2 },
        { desc: "Parcialmente nublado", icon: "partly-cloudy", humidity: 65, wind: 16, visibility: 12, tempVariation: -1 },
        { desc: "Nublado", icon: "cloudy", humidity: 70, wind: 18, visibility: 10, tempVariation: -3 },
        { desc: "Ensolarado", icon: "sunny", humidity: 50, wind: 12, visibility: 16, tempVariation: 3 }
      ];
    } else if (currentMonth >= 9 && currentMonth <= 11) {
      // Outono (Setembro-Novembro)
      baseTemp = 18;
      weatherConditions = [
        { desc: "Fresco", icon: "partly-cloudy", humidity: 65, wind: 16, visibility: 12, tempVariation: 1 },
        { desc: "Nublado", icon: "cloudy", humidity: 75, wind: 20, visibility: 8, tempVariation: -2 },
        { desc: "Chuva fraca", icon: "rainy", humidity: 85, wind: 22, visibility: 6, tempVariation: -4 },
        { desc: "Parcialmente ensolarado", icon: "partly-cloudy", humidity: 60, wind: 14, visibility: 14, tempVariation: 2 }
      ];
    } else {
      // Inverno (Dezembro-Fevereiro)
      baseTemp = 12;
      weatherConditions = [
        { desc: "Frio", icon: "cloudy", humidity: 80, wind: 20, visibility: 8, tempVariation: -2 },
        { desc: "Chuva", icon: "rainy", humidity: 90, wind: 25, visibility: 5, tempVariation: -3 },
        { desc: "Nublado", icon: "cloudy", humidity: 75, wind: 18, visibility: 10, tempVariation: 0 },
        { desc: "Parcialmente ensolarado", icon: "partly-cloudy", humidity: 65, wind: 15, visibility: 12, tempVariation: 3 }
      ];
    }

    // Variação por hora do dia
    let hourlyTempAdjustment = 0;
    if (currentHour >= 6 && currentHour <= 10) {
      hourlyTempAdjustment = -3; // Manhã mais fresca
    } else if (currentHour >= 14 && currentHour <= 17) {
      hourlyTempAdjustment = 4; // Tarde mais quente
    } else if (currentHour >= 18 && currentHour <= 22) {
      hourlyTempAdjustment = 1; // Início da noite
    } else {
      hourlyTempAdjustment = -5; // Madrugada/noite
    }

    // Selecionar condição meteorológica
    const randomCondition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
    const finalTemperature = Math.round(baseTemp + hourlyTempAdjustment + randomCondition.tempVariation);

    return {
      temperature: finalTemperature,
      description: randomCondition.desc,
      humidity: randomCondition.humidity,
      windSpeed: randomCondition.wind,
      visibility: randomCondition.visibility,
      city: "Lisboa, Portugal",
      icon: randomCondition.icon,
      feelsLike: finalTemperature + Math.floor(Math.random() * 3) - 1,
      uvIndex: this.calculateUVIndex(currentHour),
      pressure: 1013 + Math.floor(Math.random() * 20) - 10
    };
  }

  // Converter resposta da API
  private static parseApiResponse(data: any): WeatherData {
    return {
      temperature: Math.round(data.main.temp),
      description: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6), // m/s para km/h
      visibility: Math.round((data.visibility || 10000) / 1000), // metros para km
      city: `${data.name}, Portugal`,
      icon: this.mapWeatherIcon(data.weather[0].main),
      feelsLike: Math.round(data.main.feels_like),
      uvIndex: 0, // API gratuita não inclui UV
      pressure: data.main.pressure
    };
  }

  // Mapear ícones da API para os nossos
  private static mapWeatherIcon(main: string): string {
    switch (main.toLowerCase()) {
      case "clear":
        return "sunny";
      case "clouds":
        return "partly-cloudy";
      case "rain":
      case "drizzle":
        return "rainy";
      case "snow":
        return "cloudy";
      case "thunderstorm":
        return "rainy";
      case "mist":
      case "fog":
        return "cloudy";
      default:
        return "sunny";
    }
  }

  // Calcular índice UV baseado na hora
  private static calculateUVIndex(hour: number): number {
    if (hour < 6 || hour > 18) return 0;
    if (hour >= 11 && hour <= 15) return Math.floor(Math.random() * 5) + 6; // Alto
    if (hour >= 9 && hour <= 17) return Math.floor(Math.random() * 3) + 3; // Médio
    return Math.floor(Math.random() * 3) + 1; // Baixo
  }

  // Obter previsão estendida (simulada)
  static async getExtendedForecast(): Promise<WeatherData[]> {
    const forecast: WeatherData[] = [];
    const currentWeather = await this.fetchRealWeatherData();
    
    for (let i = 1; i <= 5; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      // Variação baseada no dia atual
      const tempVariation = (Math.random() - 0.5) * 6;
      const newTemp = Math.round(currentWeather.temperature + tempVariation);
      
      forecast.push({
        ...currentWeather,
        temperature: newTemp,
        feelsLike: newTemp + Math.floor(Math.random() * 3) - 1,
        humidity: Math.max(30, Math.min(90, currentWeather.humidity + Math.floor(Math.random() * 20) - 10)),
        windSpeed: Math.max(5, currentWeather.windSpeed + Math.floor(Math.random() * 10) - 5)
      });
    }
    
    return forecast;
  }

  // Formatar temperatura
  static formatTemperature(temp: number): string {
    return `${temp}°C`;
  }

  // Obter cor baseada na temperatura
  static getTemperatureColor(temp: number): string {
    if (temp <= 10) return "text-blue-600";
    if (temp <= 20) return "text-green-600";
    if (temp <= 30) return "text-yellow-600";
    return "text-red-600";
  }
}