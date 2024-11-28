import React, { useState } from 'react';
import {
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  View,
} from 'react-native';
import { Asset } from 'expo-media-library';

interface PhotoGridProps {
  photos: Asset[];
  onPhotoPress: (id: string) => void;
  onPhotoLongPress?: (id: string) => void;
  selectedPhotos: string[]; // Array of selected photo IDs
  toggleSelection: (id: string) => void; // Function to toggle selection
}

const numColumns = 3;
const screenWidth = Dimensions.get('window').width;
const tileSize = screenWidth / numColumns;

export default function PhotoGrid({
  photos,
  onPhotoPress,
  onPhotoLongPress,
  selectedPhotos,
  toggleSelection,
}: PhotoGridProps) {
  const renderItem = ({ item }: { item: Asset }) => {
    const isSelected = selectedPhotos?.includes(item.id);

    return (
      <TouchableOpacity
        onPress={() => toggleSelection(item.id)}
        onLongPress={() => onPhotoLongPress?.(item.id)}
        style={[styles.photoContainer, isSelected ? styles.selected : null]}
      >
        <Image
          source={{ uri: item.uri }}
          style={styles.photo}
        />
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={photos}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={numColumns}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  photoContainer: {
    width: tileSize,
    height: tileSize,
    padding: 1,
  },
  photo: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  selected: {
    borderColor: 'blue',
    borderWidth: 2,
  },
});
