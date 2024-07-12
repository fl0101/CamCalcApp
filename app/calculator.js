import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CalculatorScreen() {

    const [display, setDisplay] = useState('');
    const [result, setResult] = useState('');

    /**
     * Handle button press
     * @param {string} value - The value of the button pressed
     */
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

                setResult(eval(expression).toString()); // Evaluate the expression
                

                try {
                    const resultValue = eval(expression).toString();
                    await AsyncStorage.setItem('calculationResult', resultValue);
                    setResult(resultValue);
                } catch (erros) {
                    setResult('');
                }

            } catch {
                setResult('Erro'); // Set result to 'Error' if evaluation fails
            }
        } else {
            setDisplay(display + value);
        }
    };

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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
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
        flex: 3,
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