import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

interface CacheConfig {
  maxSize?: number; // Maximum cache size in bytes
  maxAge?: number; // Maximum age of cached items in milliseconds
  debugMode?: boolean; // Enable debug logging
}

interface CachedImage {
  uri: string;
  localUri: string;
  timestamp: number;
  size: number;
}

class ImageCache {
  private static instance: ImageCache;
  private cacheConfig: CacheConfig = {
    maxSize: 100 * 1024 * 1024, // 100MB default
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days default
    debugMode: false
  };
  private cacheDir: string;
  private cacheKey = '@image_cache_index';
  private cacheIndex: { [key: string]: CachedImage } = {};

  private constructor() {
    this.cacheDir = `${FileSystem.cacheDirectory}images/`;
    this.loadCacheIndex();
  }

  public static getInstance(): ImageCache {
    if (!ImageCache.instance) {
      ImageCache.instance = new ImageCache();
    }
    return ImageCache.instance;
  }

  public configure(config: CacheConfig): void {
    this.cacheConfig = { ...this.cacheConfig, ...config };
  }

  private log(message: string): void {
    if (this.cacheConfig.debugMode) {
      console.log(`[ImageCache] ${message}`);
    }
  }

  private async loadCacheIndex(): Promise<void> {
    try {
      const index = await AsyncStorage.getItem(this.cacheKey);
      if (index) {
        this.cacheIndex = JSON.parse(index);
        this.log('Cache index loaded');
        this.cleanCache(); // Clean on load
      }
    } catch (error) {
      this.log(`Error loading cache index: ${error}`);
    }
  }

  private async saveCacheIndex(): Promise<void> {
    try {
      await AsyncStorage.setItem(this.cacheKey, JSON.stringify(this.cacheIndex));
      this.log('Cache index saved');
    } catch (error) {
      this.log(`Error saving cache index: ${error}`);
    }
  }

  private async ensureCacheDirectory(): Promise<void> {
    const dirInfo = await FileSystem.getInfoAsync(this.cacheDir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(this.cacheDir, { intermediates: true });
      this.log('Cache directory created');
    }
  }

  private async cleanCache(): Promise<void> {
    const now = Date.now();
    let totalSize = 0;
    const expired: string[] = [];

    // Calculate total size and find expired items
    Object.entries(this.cacheIndex).forEach(([key, image]) => {
      if (now - image.timestamp > this.cacheConfig.maxAge!) {
        expired.push(key);
      } else {
        totalSize += image.size;
      }
    });

    // Remove expired items
    for (const key of expired) {
      await this.removeFromCache(key);
    }

    // Remove oldest items if cache is too large
    if (totalSize > this.cacheConfig.maxSize!) {
      const items = Object.entries(this.cacheIndex)
        .sort(([, a], [, b]) => a.timestamp - b.timestamp);

      for (const [key] of items) {
        if (totalSize <= this.cacheConfig.maxSize!) break;
        const image = this.cacheIndex[key];
        totalSize -= image.size;
        await this.removeFromCache(key);
      }
    }

    this.saveCacheIndex();
  }

  private async removeFromCache(key: string): Promise<void> {
    try {
      const image = this.cacheIndex[key];
      if (image) {
        await FileSystem.deleteAsync(image.localUri, { idempotent: true });
        delete this.cacheIndex[key];
        this.log(`Removed from cache: ${key}`);
      }
    } catch (error) {
      this.log(`Error removing from cache: ${error}`);
    }
  }

  public async getCachedImageUri(uri: string): Promise<string> {
    await this.ensureCacheDirectory();

    // Check if image is already cached
    const cached = this.cacheIndex[uri];
    if (cached) {
      const fileInfo = await FileSystem.getInfoAsync(cached.localUri);
      if (fileInfo.exists) {
        this.log(`Cache hit: ${uri}`);
        return cached.localUri;
      }
      // If file doesn't exist, remove from index
      delete this.cacheIndex[uri];
    }

    // Download and cache image
    try {
      const filename = uri.split('/').pop() || Date.now().toString();
      const localUri = `${this.cacheDir}${filename}`;

      this.log(`Downloading: ${uri}`);
      await FileSystem.downloadAsync(uri, localUri);

      const fileInfo = await FileSystem.getInfoAsync(localUri, { size: true });
      if (!fileInfo.exists) {
        throw new Error('Failed to download image');
      }

      this.cacheIndex[uri] = {
        uri,
        localUri,
        timestamp: Date.now(),
        size: (fileInfo as FileSystem.FileInfo & { size: number }).size || 0
      };

      await this.saveCacheIndex();
      this.log(`Cached: ${uri}`);
      return localUri;
    } catch (error) {
      this.log(`Error caching image: ${error}`);
      return uri; // Fallback to original URI
    }
  }

  public async clearCache(): Promise<void> {
    try {
      await FileSystem.deleteAsync(this.cacheDir, { idempotent: true });
      await AsyncStorage.removeItem(this.cacheKey);
      this.cacheIndex = {};
      this.log('Cache cleared');
    } catch (error) {
      this.log(`Error clearing cache: ${error}`);
    }
  }

  public async getCacheSize(): Promise<number> {
    let totalSize = 0;
    for (const image of Object.values(this.cacheIndex)) {
      const fileInfo = await FileSystem.getInfoAsync(image.localUri, { size: true });
      if (fileInfo.exists && (fileInfo as FileSystem.FileInfo & { size: number }).size) {
        totalSize += (fileInfo as FileSystem.FileInfo & { size: number }).size;
      }
    }
    return totalSize;
  }
}

export const imageCache = ImageCache.getInstance();