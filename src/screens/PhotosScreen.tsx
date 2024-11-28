import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, RefreshControl, Platform } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import PhotoGrid from '../components/PhotoGrid';
import BottomNav from '../components/BottomNav';
import BackupButton from '../components/BackupButton';
import * as MediaLibrary from 'expo-media-library';
import { useBackupService } from '../hooks/useBackupService';

type PhotosScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Photos'>;
};

export default function PhotosScreen({ navigation }: PhotosScreenProps) {
  const [photos, setPhotos] = useState<MediaLibrary.Asset[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]); // Array of selected photo IDs

  // Use backup service hook
  const { bulkUpload, isUploading, progress } = useBackupService();

  const fetchPhotos = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      console.error('Permission to access media library denied');
      setHasPermission(false);
      setIsLoading(false);
      return;
    }

    setHasPermission(true);

    try {
      const album = await MediaLibrary.getAssetsAsync({
        first: 50,
        mediaType: 'photo',
        sortBy: [['creationTime', false]]
      });

      if (album.assets && album.assets.length > 0) {
        const convertedPhotos = await Promise.all(
          album.assets.map(async (asset) => {
            if (Platform.OS === 'ios' && asset.uri.startsWith('ph://')) {
              try {
                const assetInfo = await MediaLibrary.getAssetInfoAsync(asset.id);
                if (assetInfo && assetInfo.localUri) {
                  return { ...asset, uri: assetInfo.localUri }; // Replace `ph://` with `file://`
                }
              } catch (error) {
                console.error('Error converting ph:// URI:', error);
              }
            }
            return asset; // Return original asset if no conversion is needed or fails
          })
        );

        setPhotos(convertedPhotos);
      }
    } catch (error) {
      console.error('Error fetching photos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const toggleSelection = (id: string) => {
    setSelectedPhotos((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter(photoId => photoId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  const handleUploadSelected = async () => {
    try {
      const selectedAssets = selectedPhotos.map((photoId) =>
        photos.find((photo) => photo.id === photoId)
      ).filter((photo) => photo !== undefined) as MediaLibrary.Asset[];

      await bulkUpload(selectedAssets);
    } catch (error) {
      console.error('Error uploading selected photos:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPhotos(); // Re-fetch photos when refreshing
    setRefreshing(false);
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1a73e8" />
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1a73e8" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <PhotoGrid
        photos={photos}
        onPhotoPress={(id) => navigation.navigate('PhotoDetail', { id })}
        selectedPhotos={selectedPhotos}
        toggleSelection={toggleSelection}
      />
      <BackupButton
        onPress={handleUploadSelected}
        isUploading={isUploading}
        progress={progress}
      />
      <BottomNav currentTab="photos" navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
