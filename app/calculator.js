import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";

export default function CalculatorScreen () {
    
    const [display, setDisplay] = useState('');
    const [result, setResult] = useState('');

    /**
     * Handle button press
     * @param {string} value - The value of the button pressed
     */
    const handlePress = (value) => {
        if (value === 'C') {
            setDisplay(''); // Clear the display
            setResult(''); // Clear the results
        } else if (value === '⌫') {
            setDisplay(display.slice(0, -1)); // Delete a value on the screen
        } else if (value === '=') {
            try {
                let expression = display.replace('+', '/').replace('×', '*').replace(',', '.').replace('%', '/100');
                if (expression.includes('√')) { // ?
                    expression = expression.replace(/√/g, 'Math.sqrt');
                }
                setResult(eval(expression).toString()); // ?
            } catch { 
                setResult('');
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
     * @param {string} button - The button valur
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
        backgroundColor: '#0a0a0a',
    },
    displayContainer: {
        flex: 1,
        backgroundColor: '#0a0a0a',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        padding: 20,
        paddingTop: 100,
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
        backgroundColor: '#0a0a0a',
        padding: 20,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 18,
    },
    button: {
        width: 75,
        height: 75,
        borderRadius: 18,
        backgroundColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
    },
    equalButton: {
        backgroundColor: '#FFA500',
    },
    buttonText: {
        fontSize: 20,
        color: '#fff',
    },
    operatorText: {
        color: '#FFA500',
    },
});