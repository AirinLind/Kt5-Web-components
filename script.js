class WeatherWidget extends HTMLElement {
    constructor() {
      super();
  
      this.attachShadow({ mode: 'open' });
    }
  
    connectedCallback() {
      this.render();
      this.fetchWeather();
    }
  
    async fetchWeather() {
      const city = 'London';
  
      const lat = 51.5074;
      const lon = -0.1278; 
  
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
  
      try {
        const response = await fetch(url);
  
        if (!response.ok) {
          throw new Error(`API запрос не удался: ${response.statusText}`);
        }
  
        const weatherData = await response.json();
        
        this.updateWeather(weatherData);
      } catch (error) {
        console.error('Ошибка при получении данных о погоде:', error);
      }
    }
  
    updateWeather(data) {
      const { current_weather } = data;
  
      if (current_weather) {
        this.shadowRoot.querySelector('.temperature').textContent = `${current_weather.temperature}°C`;
        this.shadowRoot.querySelector('.conditions').textContent = this.getWeatherDescription(current_weather.weathercode);
        this.shadowRoot.querySelector('.wind').textContent = `Wind: ${current_weather.windspeed} km/h`;
      }
    }
  
    getWeatherDescription(weatherCode) {
      const weatherDescriptions = {
        1: 'Clear',
        2: 'Partly Cloudy',
        3: 'Cloudy',
        4: 'Overcast',
        5: 'Rainy',
        6: 'Stormy',
        7: 'Snowy',
        8: 'Foggy'
      };
  
      return weatherDescriptions[weatherCode] || 'Unknown';
    }
  
    render() {
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: block;
            max-width: 300px;
            background-color: #f0f8ff;
            border-radius: 15px;
            padding: 30px;
            margin: 20px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            font-family: Arial, sans-serif;
            color: #333;
            transition: transform 0.3s ease-in-out;

          }
  
          :host(:hover) {
            transform: scale(1.05);
          }
  
          .weather-info {
            text-align: center;
          }
  
          .temperature {
            font-size: 2em;
            font-weight: bold;
            color: #ff6347;
          }
  
          .conditions {
            font-size: 1.2em;
            margin-top: 10px;
            color: #4682b4;
          }
  
          .wind {
            font-size: 1em;
            margin-top: 5px;
            color: #32cd32;
          }
        </style>
  
        <div class="weather-info">
          <div class="temperature"></div>
          <div class="conditions"></div>
          <div class="wind"></div>
        </div>
      `;
    }
  }
  
  customElements.define('weather-widget', WeatherWidget);
  