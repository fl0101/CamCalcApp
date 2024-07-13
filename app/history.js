import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import IconButton from '../components/iconButton'

export default function HistoryScreen() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    // Loads the history from AsyncStorage when mounting the component.
    useEffect(() => {
        loadHistory();
    }, []);

    // Async function to load the calculation history from AsyncStorage.
    const loadHistory = async () => {
        try {
            const historyData = await AsyncStorage.getItem('calculationHistory');
            if (historyData !== null) {
                setHistory(JSON.parse(historyData));
            }

        } catch (error) {
            console.error('Erro ao carregar histórico:', error);
        } finally {
            setLoading(false);
        }
    };

    // Async function to clear the history from AsyncStorage and local state.
    const clearHistory = async () => {
        try {
            await AsyncStorage.removeItem('calculationHistory');
            setHistory([]);
        } catch (error) {
            console.error('Erro ao limpar histórico:', error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <IconButton style={styles.clearButton} icon="delete" onPress={clearHistory} />
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#fff" />
            ) :

            history.length === 0 ? (
                <Text style={styles.emptyText}>Não há dados</Text>
            ) : (
                <FlatList
                    data={history}
                    renderItem={({ item }) => <Text style={styles.historyItem}>{item}</Text>}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={styles.flatListContainer}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: 'black',
        padding: 20,
        alignSelf: 'center',
        marginVertical: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: 20,
    },
    emptyText: {
        fontSize: 18,
        fontStyle: 'italic',
        marginBottom: 10,
        color: 'white',
        textAlign: 'center',
    },
    flatListContainer: {
        flex: 1,
        padding: 5,
    },
    historyItem: {
        fontSize: 18,
        color: 'white',
        textAlign: 'right',
        marginBottom: 5,
        padding: 5,
    },
});

