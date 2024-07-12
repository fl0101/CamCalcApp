import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HistoryScreen() {
    const [history, setHistory] = useState([]);

    // Carrega o histórico do AsyncStorage ao montar o componente
    useEffect(() => {
        loadHistory();
    }, []);

    // Função assíncrona para carregar o histórico de cálculos do AsyncStorage
    const loadHistory = async () => {
        try {
            const historyData = await AsyncStorage.getItem('history');
            if (historyData !== null) {
                setHistory(JSON.parse(historyData));
            }
        } catch (error) {
            console.error('Error loading history:', error);
        }
    };

    // Função assíncrona para limpar o histórico do AsyncStorage e o estado local
    const clearHistory = async () => {
        try {
            await AsyncStorage.removeItem('history');
            setHistory([]);
        } catch (error) {
            console.error('Error clearing history:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Histórico</Text>
            {history.length === 0 ? (
                <Text style={styles.emptyText}>Não há dados</Text>
            ) : (
                <FlatList
                    data={history}
                    renderItem={({ item }) => <Text style={styles.historyItem}>{item}</Text>}
                    keyExtractor={(item, index) => index.toString()}
                />
            )}
            <TouchableOpacity style={styles.clearButton} onPress={clearHistory}>
                <Text style={styles.clearButtonText}>Limpar histórico</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    emptyText: {
        fontSize: 18,
        fontStyle: 'italic',
        marginBottom: 10,
    },
    historyItem: {
        fontSize: 16,
        marginBottom: 5,
    },
    clearButton: {
        backgroundColor: '#ff6347',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    clearButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});