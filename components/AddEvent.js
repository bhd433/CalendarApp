import { StyleSheet, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AddEvent() {
    return (
        <ImageBackground
            source={require('./bricks.png')}
            style={styles.background}
        >
            <SafeAreaView style={styles.container}>
                {/* sisältö */}
            </SafeAreaView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
    },
});