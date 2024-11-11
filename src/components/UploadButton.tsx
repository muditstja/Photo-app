import React from 'react';
import { TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface UploadButtonProps {
  isUploading: boolean;
}

export default function UploadButton({ isUploading }: UploadButtonProps) {
  return (
    <TouchableOpacity style={styles.button} disabled={isUploading}>
      {isUploading ? (
        <ActivityIndicator color="#fff" />
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
});