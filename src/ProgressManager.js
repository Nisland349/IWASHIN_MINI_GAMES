// ProgressManager.js - 進捗保存（localStorage）
const STORAGE_KEY = 'iwashin_progress';

class ProgressManagerClass {
  constructor() {
    this._load();
  }

  _load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const data = raw ? JSON.parse(raw) : {};
      this.clearedChapters = new Set(data.clearedChapters || []);
    } catch {
      this.clearedChapters = new Set();
    }
  }

  _save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        clearedChapters: [...this.clearedChapters],
      }));
    } catch {}
  }

  isUnlocked(chapter) {
    return chapter === 1 || this.clearedChapters.has(chapter - 1);
  }

  isCleared(chapter) {
    return this.clearedChapters.has(chapter);
  }

  clearChapter(chapter) {
    this.clearedChapters.add(chapter);
    this._save();
  }

  reset() {
    this.clearedChapters.clear();
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  }
}

export const ProgressManager = new ProgressManagerClass();
