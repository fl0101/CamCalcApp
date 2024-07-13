import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import CalculatorScreen from './app/calculator';
import HistoryScreen from './app/history';

export default function App() {
  const [activeScreen, setActiveScreen] = useState('Calculator');

  // Function to switch between screens.
  const switchScreen = (screen) => {
    setActiveScreen(screen);
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeScreen === 'Calculator' && styles.activeTab]}
          onPress={() => switchScreen('Calculator')}
        >
          <Text style={styles.tabText}>Calculadora</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeScreen === 'History' && styles.activeTab]}
          onPress={() => switchScreen('History')}
        >
          <Text style={styles.tabText}>Histórico</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        {activeScreen === 'Calculator' ? <CalculatorScreen /> : <HistoryScreen />}
      </View>

      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    height: 100,
    paddingTop: 45,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 7,
    borderRadius: 5,
  },
  activeTab: {
    backgroundColor: '#111112',
  },
  tabText: {
    color: '#fff',
    fontSize: 18,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
});