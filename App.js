import { StatusBar } from 'expo-status-bar';
// paper:
import { PaperProvider } from 'react-native-paper';
// taustakuva
import { ImageBackground } from 'react-native';
// safearea:
import { SafeAreaProvider } from 'react-native-safe-area-context';
// navigation:
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// components:
import Calendar from './components/Calendar';
import AddEvent from './components/AddEvent';
// SQLite:
import * as SQLite from 'expo-sqlite';


// ladatut:
// 
// npx expo install react-native-safe-area-context
//
// npm install react-native-paper
//
// npm install @react-navigation/native
// npm install @react-navigation/native-stack
// npx expo install react-native-screens
//
// npx expo install expo-location
//
// npx expo install expo-sqlite
//
// npx expo install react-native-big-calendar
// npm install tslib
//     ^^^
//    tarvitaan, koska react-native-big-calendar on kirjoitettu TypeScriptillä.
//    tslib sisältää apufunktiot, joita TypeScript-koodi tarvitsee toimiakseen oikein JavaScript-ympäristössä.




const Stack = createNativeStackNavigator();


export default function App() {


  // <SQLite.SQLiteProvider> /// pois ehk
  return (
    //<SQLite.SQLiteProvider>
    <SafeAreaProvider>
      <PaperProvider>
        {/* tässäkin täytyy olla taustakuva koska muuten
        sivua vaihtaessa vilahtaa valkoinen tausta*/}
        <ImageBackground
          source={require('./components/bricks.png')}
          style={{ flex: 1 }}
        >
          <NavigationContainer>
            <Stack.Navigator
              screenOptions={{
                headerStyle: {
                  backgroundColor: '#ffffffff',
                },
                headerTitleAlign: 'center',
                headerTintColor: '#000000ff',
              }}
            >
              <Stack.Screen name="Kalenteri" component={Calendar} />
              <Stack.Screen name="Lisää tapahtuma" component={AddEvent} />
            </Stack.Navigator>
            <StatusBar style="dark" translucent={false} backgroundColor="#ffffffff" />
            {/* translucent={false} <-- korjaa ongelman jossa navigaatiosivun otsikko menee status barin alle */}
          </NavigationContainer>
        </ImageBackground>
      </PaperProvider>
    </SafeAreaProvider>
    //</SQLite.SQLiteProvider>
  );
}