import React from 'react'
import { Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function IconCamera({ icon, onPress, style }) {
    return (
        <Pressable style={[styles.iconButton, style]} onPress={onPress}>
            <MaterialIcons name={icon} size={34} color="#fff" />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    iconButton: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
    },
});
