import React from 'react';
import { TouchableOpacity, StyleSheet, ActivityIndicator, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface BackupButtonProps {
  isUploading: boolean;
  progress: number;
  onPress: () => void;
}

export default function BackupButton({ isUploading, progress, onPress }: BackupButtonProps) {
  return (
    <TouchableOpacity 
      style={styles.button} 
      onPress={onPress}
      disabled={isUploading}
    >
      {isUploading ? (
        <View style={styles.progressContainer}>
          <ActivityIndicator color="#fff" size="small" />
          <Text style={styles.progressText}>{Math.round(progress)}%</Text>
        </View>
      ) : (
        <Ionicons name="cloud-upload" size={24} color="#fff" />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    right: 20,
    bottom: 80,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1a73e8',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressText: {
    color: '#fff',
    fontSize: 10,
    marginTop: 2,
  },
});