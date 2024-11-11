import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import PhotoGrid from '../components/PhotoGrid';
import BottomNav from '../components/BottomNav';
import { usePhotoLibrary } from '../hooks/usePhotoLibrary';
import { useCloudStorage } from '../hooks/useCloudStorage';
import UploadButton from '../components/UploadButton';

type PhotosScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Photos'>;
};

export default function PhotosScreen({ navigation }: PhotosScreenProps) {
  const {
    photos,
    hasPermission,
    isLoading,
    requestPermission,
    loadPhotos,
    loadMorePhotos,
  } = usePhotoLibrary();

  const { uploadPhoto, isUploading } = useCloudStorage();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    (async () => {
      const granted = await requestPermission();
      if (granted) {
        await loadPhotos();
      }
    })();
  }, []);

  const handleUpload = async (photoId: string) => {
    const photo = photos.find(p => p.id === photoId);
    if (!photo) return;

    try {
      const filename = `${Date.now()}-${photo.filename}`;
      await uploadPhoto(photo.uri, filename);
    } catch (error) {
      console.error('Error uploading:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPhotos();
    setRefreshing(false);
  };

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
        onPhotoLongPress={handleUpload}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={loadMorePhotos}
      />
      <UploadButton isUploading={isUploading} />
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