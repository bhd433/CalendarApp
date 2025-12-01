import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, View, ImageBackground, Text, Modal } from 'react-native';
import { Button } from 'react-native-paper';
import { useState, useEffect } from 'react';
import { Calendar as BigCalendar } from 'react-native-big-calendar';
import * as Location from 'expo-location';
import Weather from './Weather';
import 'dayjs/locale/fi'
import * as SQLite from 'expo-sqlite';

export default function Calendar({ navigation }) {

    // api-avain säätietojen hakua varten 
    const API_KEY = 'c0b4705dce661e3006713a99a6c62e78';
    // käyttäjän sijainnille haetaan säätiedot mitkä tulee tähän
    const [weatherData, setWeatherData] = useState(null);
    // modalin avulla voidaan nähdä tapahtuman tiedot klikkaamalla tapahtumaa kalenterissa
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const [events, setEvents] = useState([]);


    const db = SQLite.openDatabaseSync('calendardb');

    //const events = [
    //    { start: new Date(2025, 11, 1, 9, 0), end: new Date(2025, 11, 1, 13, 0), title: 'Aamupalaveri' },
    //    { start: new Date(2025, 11, 2, 11, 0), end: new Date(2025, 11, 2, 12, 0), title: 'Projektikokous' },
    //];

    // database aloitus funktio
    const dbinit = async () => {
        try {
            await db.execAsync(`
                CREATE TABLE IF NOT EXISTS events
                (
                id INTEGER PRIMARY KEY NOT NULL,
                title TEXT,
                start TEXT,
                end TEXT,
                description TEXT,
                color TEXT
                );
            `);
            await update();
        } catch (error) {
            console.error('Tietokannan avaaminen ei onnistunut', error);
        }
    }

    // database päivitys funktio
    const update = async () => {
        try {
            const database_data = await db.getAllAsync('SELECT * FROM events');
            setEvents(database_data);
        } catch (error) {
            console.error('Tapahtumien haku epäonnistui', error);
        }
    };



    // databasen aloitus + haetaan säätiedot käyttäjän sijainnille
    useEffect(() => {
        const init = async () => {
            // databasen aloitus
            try {
                await dbinit();
            } catch (error) {
                console.error('Tietokannan aloitus epäonnistui', error);
            }

            // sijainnin kysely ja säätiedon haku
            try {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert('Sovelluksella ei ole lupaa käyttää sijaintia');
                    return;
                }
                let location = await Location.getCurrentPositionAsync({});
                const latitude = location.coords.latitude;
                const longitude = location.coords.longitude;

                const res = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&timezone=Europe/Helsinki`
                );
                const data = await res.json();
                setWeatherData(data.daily);
            } catch (error) {
                console.error('Säätietojen haku epäonnistui:', error);
            }
        };

        init();
    }, []);


    // kalenterin ulkonäköä muokataan "themen" avulla
    const customTheme = {
        palette: {
            primary: {
                main: 'rgba(219, 99, 0, 1)',
                contrastText: '#000',
            },
            nowIndicator: 'rgba(255, 0, 0, 1)',
            gray: {
                '100': '#000000ff',
                '200': '#000000ff',
                '300': '#000000ff',
                '500': '#000000ff',
                '800': '#000000ff',
            },
            moreLabel: '#000',
        },
        typography: {
            fontFamily: 'System',
            xs: { fontSize: 12, fontWeight: '600', color: '#000' },
            sm: { fontSize: 14, fontWeight: '500', color: '#000' },
            xl: { fontSize: 16, fontWeight: '600', color: '#000' },
            moreLabel: { fontSize: 12, fontWeight: '500', color: '#000' },
        },
        eventCellOverlappings: [{ main: '#f06', contrastText: '#000' }],
        moreLabel: { color: '#000' },
        isRTL: false,
    };



    return (
        <ImageBackground
            source={require('./bricks.png')}
            style={styles.background}
        >
            <SafeAreaView style={styles.container}>


                <View style={styles.calendarWrapper}>
                    <Weather dailyWeather={weatherData} gutterWidth={50}/> {/* sää ikonit luodaan Weather.js komponentin avulla*/}
                    <BigCalendar
                        style={{ flex: 1 }}
                        locale="fi"
                        events={events}
                        mode="week"
                        showTime
                        hourRowHeight={30}
                        start={0}
                        end={23}
                        date={new Date()}
                        weekStartsOn={1}
                        theme={customTheme}
                        eventCellStyle={{
                            backgroundColor: 'rgba(92, 202, 253, 1)',
                            borderRadius: 0,
                            paddingTop: 0,
                            paddingBottom: 0,

                        }}

                        // kun tapahtumaa painetaan niin tämä koodi suoritetaan
                        onPressEvent={(event) => {
                            setSelectedEvent(event);
                            setModalVisible(true);
                        }}
                    />
                </View>

                <Button
                    mode='contained'
                    title="Lisää tapahtuma"
                    buttonColor="lightblue"
                    textColor="black"
                    onPress={() => navigation.navigate('Lisää tapahtuma')}
                    icon="plus"
                    style={{ marginTop: 15 }}
                >
                    Lisää tapahtuma
                </Button>

                {/* modali eli tämä ilmestyy kun tapahtumaa klikataan */}
                <Modal
                    visible={modalVisible}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>{selectedEvent?.title}</Text>
                            <Text>Alkaa: {selectedEvent?.start.toLocaleString()}</Text>
                            <Text>Loppuu: {selectedEvent?.end.toLocaleString()}</Text>

                            <View style={{ flexDirection: 'row', marginTop: 15, justifyContent: 'space-between' }}>
                                <Button
                                    mode="contained"
                                    onPress={() => setModalVisible(false)}
                                    buttonColor="lightblue"
                                    textColor="black"
                                    style={{ flex: 1, marginRight: 5 }}
                                >
                                    Sulje
                                </Button>

                                <Button
                                    mode="contained"
                                    buttonColor="red"
                                    textColor="black"
                                    onPress={() => {
                                        // poista tapahtuma -logiikka tähän
                                        console.log(weatherData)
                                        setModalVisible(false);
                                    }}
                                    icon="trash-can-outline"
                                    style={{ flex: 1, marginLeft: 5 }}
                                >
                                    Poista
                                </Button>
                            </View>
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '80%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
    },
    background: {
        flex: 1,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    calendarWrapper: {
        //flex: 1,
        width: '90%',
        height: '70%',
        padding: 7,
        backgroundColor: 'white',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
});