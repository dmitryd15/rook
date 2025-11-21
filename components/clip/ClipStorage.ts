import AsyncStorage from '@react-native-async-storage/async-storage';

export type ClipObject = {
  id: string;
  title: string;
  history: string;
  images: string[]; // URIs
  labs: string[]; // URIs
  createdAt: string; // ISO
  linkedPatient?: {
    id?: string;
    ip?: string;
    name?: string;
  } | null;
};

const STORAGE_KEY = 'clip_repository_storage';

export const ClipStorage = {
  async getAllClips(): Promise<ClipObject[]> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as ClipObject[];
      // sort by createdAt desc
      return parsed.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (e) {
      console.error('ClipStorage.getAllClips', e);
      return [];
    }
  },

  async saveClip(clip: ClipObject): Promise<void> {
    try {
      const list = await ClipStorage.getAllClips();
      list.unshift(clip);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.error('ClipStorage.saveClip', e);
      throw e;
    }
  },

  async updateClip(id: string, updatedClip: Partial<ClipObject>): Promise<void> {
    try {
      const list = await ClipStorage.getAllClips();
      const idx = list.findIndex(c => c.id === id);
      if (idx === -1) return;
      const merged = { ...list[idx], ...updatedClip } as ClipObject;
      list[idx] = merged;
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.error('ClipStorage.updateClip', e);
      throw e;
    }
  },

  async deleteClip(id: string): Promise<void> {
    try {
      const list = await ClipStorage.getAllClips();
      const filtered = list.filter(c => c.id !== id);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (e) {
      console.error('ClipStorage.deleteClip', e);
      throw e;
    }
  },

  async clearAllClips(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('ClipStorage.clearAllClips', e);
      throw e;
    }
  }
};
