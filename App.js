import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import CalculatorScreen from './app/calculator';

export default function App() {
  return (
    <View style={styles.container}>
      <CalculatorScreen />
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',

  },
  title: {
    color: '#fff',
  }
});
