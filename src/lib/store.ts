import { create } from "zustand";

interface BookmarkStore {
  bookmarks: string[];
  setBookmarks: (bookmarks: string[]) => void;
  addBookmark: (postId: string) => void;
  removeBookmark: (postId: string) => void;
}

// Create the store
export const useBookmarkStore = create<BookmarkStore>((set) => ({
  bookmarks: [],
  setBookmarks: (bookmarks) => {
    console.log("Store: Setting bookmarks", bookmarks);
    set({ bookmarks });
  },

  addBookmark: (postId) => {
    console.log("Store: Adding bookmark", postId);
    set((state) => ({
      bookmarks: [...new Set([...state.bookmarks, postId])], // Avoid duplicates
    }));
  },
  
  removeBookmark: (postId) => {
    console.log("Store: Removing bookmark", postId);
    set((state) => ({
      bookmarks: state.bookmarks.filter((id) => id !== postId),
    }));
  },
}));
