import { useState, useEffect } from 'react';
import * as MediaLibrary from 'expo-media-library';

export const usePhotoLibrary = () => {
  const [photos, setPhotos] = useState<MediaLibrary.Asset[]>([]);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const requestPermission = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    setHasPermission(status === 'granted');
    return status === 'granted';
  };

  const loadPhotos = async (pageSize = 50) => {
    try {
      setIsLoading(true);
      const { assets } = await MediaLibrary.getAssetsAsync({
        first: pageSize,
        mediaType: ['photo'],
        sortBy: ['creationTime'],
      });
      setPhotos(assets);
    } catch (error) {
      console.error('Error loading photos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMorePhotos = async (pageSize = 50) => {
    if (photos.length === 0) return;
    
    try {
      const { assets } = await MediaLibrary.getAssetsAsync({
        first: pageSize,
        after: photos[photos.length - 1].id,
        mediaType: ['photo'],
        sortBy: ['creationTime'],
      });
      setPhotos(prev => [...prev, ...assets]);
    } catch (error) {
      console.error('Error loading more photos:', error);
    }
  };

  return {
    photos,
    hasPermission,
    isLoading,
    requestPermission,
    loadPhotos,
    loadMorePhotos,
  };
};