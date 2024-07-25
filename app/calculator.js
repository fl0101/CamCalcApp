import React, { useEffect, useState, useRef } from "react";
import { View, TouchableOpacity, StyleSheet, Text, Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Camera, CameraType } from 'expo-camera/legacy';
import * as tf from '@tensorflow/tfjs';
import * as cocossd from '@tensorflow-models/coco-ssd';
import IconCamera from '../components/iconCamera';

export default function CalculatorScreen() {
    const [display, setDisplay] = useState('');
    const [result, setResult] = useState('');
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const cameraRef = useRef(null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);

    /**
     * Handle button press
     * @param {string} value - The value of the button pressed
     */

    // Load state when mounting the component.
    useEffect(() => {
        loadCalculatorState();
        requestCameraPermission(); // quando startar solicita a permissão de câmera
    }, []);

    // Save state whenever 'display' or 'result' changes.
    useEffect(() => {
        saveCalculatorState();
    }, [display, result]);

    //add
    const requestCameraPermission = async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasCameraPermission(status === 'granted');
    };

    // Function to load the saved state
    const loadCalculatorState = async () => {
        try {
            const savedDisplay = await AsyncStorage.getItem('calculatorDisplay');
            const savedResult = await AsyncStorage.getItem('calculatorResult');
            if (savedDisplay !== null) setDisplay(savedDisplay);
            if (savedResult !== null) setResult(savedResult);
        } catch (error) {
            console.error('Erro ao carregar estado da calculadora:', error);
        }
    };

    // Function to save the current state
    const saveCalculatorState = async () => {
        try {
            await AsyncStorage.setItem('calculatorDisplay', display);
            await AsyncStorage.setItem('calculatorResult', result);
        } catch (error) {
            console.error('Erro ao salver estado da calculador:', error);
        }
    };

    const handlePress = async (value) => {
        if (value === 'C') {
            setDisplay(''); // Clear the display
            setResult(''); // Clear the results
        } else if (value === '⌫') {
            setDisplay(display.slice(0, -1)); // Delete a value on the screen
        } else if (value === '=') {
            try {
                let expression = display
                    .replace('÷', '/')
                    .replace('×', '*')
                    .replace(',', '.');

                // Handle square root
                expression = expression.replace(/√(\d+(\.\d+)?)/g, 'Math.sqrt($1)');
                
                // Handle percentage
                expression = expression.replace(/(\d+(\.\d+)?)%/g, '($1/100)');

                const resultValue = eval(expression).toString();
                const historyEntry = `${display} = ${resultValue}`;

                setResult(resultValue);

                // Update the history in AsyncStorage.
                try {
                    const historyData = await AsyncStorage.getItem('calculationHistory');
                    let history = historyData ? JSON.parse(historyData) : [];
                    history.push(historyEntry);
                    await AsyncStorage.setItem('calculationHistory', JSON.stringify(history));

                } catch (error) {
                    console.log('Erro ao salvar histórico: ', error);
                }

            } catch {
                setResult('Erro'); // Set result to 'Error' if evaluation fails
            }
        } else {
            setDisplay(display + value);
        }
    };

    //add
    const handleCameraIconPress = async () => {
        if (hasCameraPermission === null) {
            await requestCameraPermission();
        } 
        if (hasCameraPermission === false) {
            Alert.alert("Permissão para usar a câmera negada");
            return;
        }
        setIsCameraOpen(true);
    };

    const handleCapture = async () => {
        if (cameraRef.current) {
            const photo = await cameraRef.current.takePictureAsync();
            setIsCameraOpen(false);
            processImage(photo.uri);
        }
    };

    const processImage = async (imageUri) => {
        await tf.ready();
        const model = await cocossd.load();
        const image = new Image();
        image.src = imageUri;
        const predictions = await model.detect(image);

        predictions.forEach(prediction => {
            if (prediction.class === 'number' || prediction.class === 'currency') {
                const number = extractNumberFromPrediction(prediction);
                setDisplay(display + number);
            } 
        });
    };

    const extractNumberFromPrediction = (prediction) => {
        // Extratir o número da previsão do modelo. Implementação fictícia.
        return "10";
    }

    /* Calculator buttons */
    const buttons = [
        ['C', '÷', '%', '⌫'],
        ['7', '8', '9', '×'],
        ['4', '5', '6', '-'],
        ['1', '2', '3', '+'],
        ['√', '0', ',', '=']
    ];

    /**
     * Check if the button is an operator
     * @param {string} button - The button value
     * @returns {boolean} - True if the button is an operator, false otherwise
     */
    const isOperator = (button) => ['+', '-', '×', '÷', '⌫', ',', 'C', '%', '√'].includes(button);

    return (
        <View style={styles.container}>
            {isCameraOpen ? (
                <Camera style={styles.camera} type={CameraType.back} ref={cameraRef}>
                    <View style={styles.cameraContainer}>
                        <TouchableOpacity style={styles.cameraButton} onPress={handleCapture}>
                            <Text style={styles.cameraButtonText}>Capturar</Text>
                        </TouchableOpacity>
                    </View>
                </Camera>
            ) : (
                <>
                    <IconCamera style={styles.cameraIcon} icon="photo-camera" onPress={handleCameraIconPress} />
                    
                    <View style={styles.displayContainer}>
                        <Text style={styles.displayText}>{display}</Text>
                        <Text style={styles.resultText}>{result}</Text>
                    </View>

                    <View style={styles.buttonsContainer}>
                        {buttons.map((row, rowIndex) => (
                            <View key={rowIndex} style={styles.row}>
                                {row.map((button) => (
                                    <TouchableOpacity
                                        key={button}
                                        style={[styles.button, button === '=' && styles.equalButton]}
                                        onPress={() => handlePress(button)}
                                    >
                                        <Text style={[styles.buttonText, isOperator(button) && styles.operatorText]}>
                                            {button}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        ))}
                    </View>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    camera: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    cameraContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    cameraButton: {
        marginBottom: 20,
        backgroundColor: '#EDEDED',
        padding: 15,
        borderRadius: 10,
    },
    cameraButtonText: {
        fontSize: 18,
        color: '#000',
    },
    cameraIcon: {
        alignSelf: 'flex-end',
        margin: 10,
    },
    displayContainer: {
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        paddingTop: 170,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    displayText: {
        fontSize: 35,
        color: '#fff',
        textAlign: 'right',
        lineHeight: 66,
    },
    resultText: {
        fontSize: 23,
        color: '#aaa',
        textAlign: 'right',
    },
    buttonsContainer: {
        flex: 5,
        backgroundColor: 'black',
        padding: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        width: 75,
        height: 70,
        borderRadius: 20,
        backgroundColor: '#111112',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
    },
    equalButton: {
        backgroundColor: '#FFA500',
    },
    buttonText: {
        fontSize: 23,
        color: '#fff',
    },
    operatorText: {
        color: '#FFA500',
    },
});