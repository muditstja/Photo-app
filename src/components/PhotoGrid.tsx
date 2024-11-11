import React from 'react';
import {
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { Asset } from 'expo-media-library';

interface PhotoGridProps {
  photos: Asset[];
  onPhotoPress: (id: string) => void;
  onPhotoLongPress?: (id: string) => void;
  refreshControl?: React.ReactElement;
  onEndReached?: () => void;
}

const numColumns = 3;
const screenWidth = Dimensions.get('window').width;
const tileSize = screenWidth / numColumns;

export default function PhotoGrid({
  photos,
  onPhotoPress,
  onPhotoLongPress,
  refreshControl,
  onEndReached,
}: PhotoGridProps) {
  const renderItem = ({ item }: { item: Asset }) => (
    <TouchableOpacity
      onPress={() => onPhotoPress(item.id)}
      onLongPress={() => onPhotoLongPress?.(item.id)}
      style={styles.photoContainer}
    >
      <Image
        source={{ uri: item.uri }}
        style={styles.photo}
      />
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={photos}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={numColumns}
      contentContainerStyle={styles.container}
      refreshControl={refreshControl}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
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
});