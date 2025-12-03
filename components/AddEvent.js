import { TextInput, Button } from 'react-native-paper';
import { useState } from 'react';
import { ImageBackground, StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SQLite from 'expo-sqlite';
import { Picker } from '@react-native-picker/picker';
import dayjs from 'dayjs';

const db = SQLite.openDatabaseSync('calendardb');

export default function AddEvent({ navigation, route }) {


    const [title, setTitle] = useState(''); // nimi
    const [description, setDescription] = useState(''); // kuvaus
    const [color, setColor] = useState('#5CCAFC'); // oletusväri sininen
    const [selectedDay, setSelectedDay] = useState(''); // pvä
    const [hourStart, setHourStart] = useState('09:00'); // alku
    const [hourEnd, setHourEnd] = useState('10:00'); // loppu


    const today = dayjs().day();
    const weekDays = ['Ma', 'Ti', 'Ke', 'To', 'Pe', 'La', 'Su'];
    const remainingDays = weekDays
        .map((day, index) => ({ label: day, index: index + 1 }))
        .filter(d => d.index >= (today === 0 ? 1 : today));


    // database lisäys funktio
    const add = async () => {
        if (!title || !selectedDay) {
            alert('Anna tapahtuman nimi ja päivä!');
            return;
        }

        const dateStr = dayjs().day(selectedDay).format('YYYY-MM-DD'); // viikonpäivän päivä
        const startDate = dayjs(dateStr + 'T' + hourStart).toISOString();
        const endDate = dayjs(dateStr + 'T' + hourEnd).toISOString();

        try {
            await db.runAsync(
                'INSERT INTO events (title, start, end, description, color) VALUES (?, ?, ?, ?, ?)',
                [title, startDate, endDate, description, color]
            );
            await route.params.updateEvents(); // database päivitys
            navigation.goBack(); // palaa kalenteriin
        } catch (error) {
            console.error('Tapahtuman lisääminen ei onnistunut', error);
        }
    };



    return (
        <ImageBackground source={require('./bricks.png')} style={styles.background} >
            <SafeAreaView style={styles.container}>
                <View style={styles.card}>
                    <TextInput label="Nimi" value={title} onChangeText={setTitle} style={styles.input} />
                    <TextInput
                        label="Kuvaus"
                        value={description}
                        onChangeText={setDescription}
                        style={styles.input}
                    />
                    <Text style={styles.label}>Valitse päivä:</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={selectedDay}
                            onValueChange={setSelectedDay}
                            style={styles.pickerText}
                        >
                            {remainingDays.map(d => (
                                <Picker.Item key={d.index} label={d.label} value={d.index} />
                            ))}
                        </Picker>
                    </View>
                    <TextInput
                        label="Aloitusaika (HH:MM)"
                        value={hourStart}
                        onChangeText={setHourStart}
                        style={styles.input}
                    />
                    <TextInput
                        label="Loppuaika (HH:MM)"
                        value={hourEnd}
                        onChangeText={setHourEnd}
                        style={styles.input}
                    />
                    <Text style={styles.label}>Valitse väri:</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={color}
                            onValueChange={setColor}
                            style={styles.pickerText}
                        >
                            <Picker.Item label="Sininen" value="#5CCAFC" />
                            <Picker.Item label="Punainen" value="#e9344fff" />
                            <Picker.Item label="Vihreä" value="#90EE90" />
                        </Picker>
                    </View>
                    <Button
                        mode="contained"
                        onPress={add}
                        style={{ marginTop: 20 }}
                        icon="plus"
                    >
                        Lisää tapahtuma
                    </Button>
                </View>
            </SafeAreaView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: { flex: 1 },
    container: { flex: 1, padding: 20, backgroundColor: 'transparent' },
    card: {
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
    },
    input: { marginTop: 10, backgroundColor: 'transparent' },
    label: { marginTop: 15, fontWeight: '500', color: '#000' },
    pickerContainer: {
        backgroundColor: '#f5f5f5',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        marginTop: 5,
        paddingHorizontal: 5,
    },
    pickerText: { color: '#000' },
    button: { marginTop: 20 },
});