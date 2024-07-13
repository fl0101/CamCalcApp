import { Pressable, StyleSheet, } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function IconCamera({ icon, onPress }) {
    return (
        <Pressable style={styles.iconButton} onPress={onPress}>
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
