import React, { useState, useEffect } from 'react';
import {
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  View,
  ActivityIndicator,
} from 'react-native';
import { Asset, getAssetInfoAsync } from 'expo-media-library';

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
  const [convertedUris, setConvertedUris] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const convertUris = async () => {
      const newUris: { [key: string]: string } = {};
      for (const photo of photos) {
        if (photo.uri.startsWith('ph://')) {
          try {
            const assetInfo = await getAssetInfoAsync(photo.id);
            if (assetInfo.localUri) {
              newUris[photo.id] = assetInfo.localUri;
            } else {
              newUris[photo.id] = photo.uri; // fallback in case the localUri is not available
            }
          } catch (error) {
            console.error('Error converting URI:', error);
            newUris[photo.id] = photo.uri; // fallback
          }
        } else {
          newUris[photo.id] = photo.uri;
        }
      }
      setConvertedUris(newUris);
    };
    convertUris();
  }, [photos]);

  const renderItem = ({ item }: { item: Asset }) => {
    const uri = convertedUris[item.id];
    if (!uri) {
      return (
        <View style={[styles.photoContainer, styles.loadingContainer]}>
          <ActivityIndicator size="small" color="#000" />
        </View>
      );
    }

    return (
      <TouchableOpacity
        onPress={() => onPhotoPress(item.id)}
        onLongPress={() => onPhotoLongPress?.(item.id)}
        style={styles.photoContainer}
      >
        <Image source={{ uri }} style={styles.photo} />
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
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  photo: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
