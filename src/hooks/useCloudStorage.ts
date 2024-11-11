import { useState } from 'react';
import { ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage';
import { storage } from '../config/firebase';
import * as FileSystem from 'expo-file-system';

export const useCloudStorage = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const uploadPhoto = async (uri: string, filename: string) => {
    try {
      setIsUploading(true);
      setUploadProgress(0);

      const response = await fetch(uri);
      const blob = await response.blob();
      
      const storageRef = ref(storage, `photos/${filename}`);
      await uploadBytes(storageRef, blob);
      
      const downloadURL = await getDownloadURL(storageRef);
      setUploadProgress(100);
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading photo:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const getCloudPhotos = async () => {
    try {
      const storageRef = ref(storage, 'photos');
      const result = await listAll(storageRef);
      
      const urls = await Promise.all(
        result.items.map(async (itemRef) => {
          const url = await getDownloadURL(itemRef);
          return {
            url,
            name: itemRef.name,
            fullPath: itemRef.fullPath,
          };
        })
      );
      
      return urls;
    } catch (error) {
      console.error('Error getting cloud photos:', error);
      throw error;
    }
  };

  return {
    uploadPhoto,
    getCloudPhotos,
    uploadProgress,
    isUploading,
  };
};