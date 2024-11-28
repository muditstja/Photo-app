import { useState } from 'react';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Asset } from 'expo-media-library';

const API_URL = 'http://192.168.1.3:3001';
const BACKUP_STATUS_KEY = '@backup_status';

interface BackupRecord {
  originalId: string;
  serverPath: string;
  size: number;
  createdAt: string;
  uploadedAt: string;
  deletedFromDevice: boolean;
}

export const useBackupService = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadPhoto = async (photo: Asset) => {
    try {
      setIsUploading(true);
      
      const formData = new FormData();
      formData.append('photo', {
        uri: photo.uri,
        type: 'image/jpeg',
        name: photo.filename
      });
      formData.append('originalId', photo.id);
      formData.append('size', photo.fileSize?.toString() || '0');
      formData.append('createdAt', photo.creationTime);

      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const result = await response.json();
      await updateBackupStatus(photo.id, result.path);
      
      return result;
    } catch (error) {
      console.error('Error uploading photo:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const bulkUpload = async (photos: Asset[]) => {
    try {
      setIsUploading(true);
      const total = photos.length;
      let uploaded = 0;

      const formData = new FormData();
      const metadata = [];

      for (const photo of photos) {
        formData.append('photos', {
          uri: photo.uri,
          type: 'image/jpeg',
          name: photo.filename
        });
        metadata.push({
          originalId: photo.id,
          size: photo.fileSize,
          createdAt: photo.creationTime
        });
        uploaded++;
        setProgress((uploaded / total) * 100);
      }

      formData.append('metadata', JSON.stringify(metadata));

      const response = await fetch(`${API_URL}/upload/bulk`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const result = await response.json();
      
      // Update backup status for all uploaded photos
      await Promise.all(
        result.results.map(({ originalId, serverPath }) => 
          updateBackupStatus(originalId, serverPath)
        )
      );

      return result;
    } catch (error) {
      console.error('Error in bulk upload:', error);
      throw error;
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  const updateBackupStatus = async (photoId: string, serverPath: string) => {
    try {
      const status = await AsyncStorage.getItem(BACKUP_STATUS_KEY);
      const backupStatus = status ? JSON.parse(status) : {};
      backupStatus[photoId] = {
        serverPath,
        timestamp: new Date().toISOString()
      };
      await AsyncStorage.setItem(BACKUP_STATUS_KEY, JSON.stringify(backupStatus));
    } catch (error) {
      console.error('Error updating backup status:', error);
    }
  };

  const getBackupStatus = async (): Promise<Record<string, BackupRecord>> => {
    try {
      const response = await fetch(`${API_URL}/backup-status`);
      const records = await response.json();
      return records.reduce((acc, record) => {
        acc[record.original_id] = {
          originalId: record.original_id,
          serverPath: record.server_path,
          size: record.size,
          createdAt: record.created_at,
          uploadedAt: record.uploaded_at,
          deletedFromDevice: record.deleted_from_device
        };
        return acc;
      }, {});
    } catch (error) {
      console.error('Error getting backup status:', error);
      return {};
    }
  };

  const markPhotoAsDeleted = async (photoId: string) => {
    try {
      await fetch(`${API_URL}/mark-deleted`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ originalId: photoId }),
      });
    } catch (error) {
      console.error('Error marking photo as deleted:', error);
      throw error;
    }
  };

  return {
    uploadPhoto,
    bulkUpload,
    getBackupStatus,
    markPhotoAsDeleted,
    isUploading,
    progress,
  };
};