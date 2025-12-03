import { View, Text } from 'react-native';

const weatherIcons = {
  0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️',
  45: '🌫️', 48: '🌫️', 51: '🌦️', 53: '🌦️', 55: '🌧️',
  61: '🌧️', 63: '🌧️', 65: '🌧️', 71: '❄️', 73: '❄️',
  75: '❄️', 77: '❄️'
};

export default function Weather({ dailyWeather, gutterWidth = 0 }) {
  if (!dailyWeather) return null;

  return (
    // mäppäys
    <View style={{ flexDirection: 'row', paddingLeft: gutterWidth }}>
      {dailyWeather.time.map((date, index) => {
        const icon = weatherIcons[dailyWeather.weathercode[index]] ?? '?';

        // palautetaan icon
        return (
          <View key={date} style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ fontSize: 24 }}>{icon ?? '?'}</Text>
          </View>
        );
      })}
    </View>
  );
}

// Funktio jonka avulla lisätään säätiedot näkyviin kalenteriin.