import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SidebarState {
  userSidebarOpen: boolean;
  adminSidebarOpen: boolean;
  toggleUserSidebar: () => void;
  toggleAdminSidebar: () => void;
  setUserSidebarOpen: (open: boolean) => void;
  setAdminSidebarOpen: (open: boolean) => void;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      userSidebarOpen: true,
      adminSidebarOpen: true,
      toggleUserSidebar: () => set((state) => ({ userSidebarOpen: !state.userSidebarOpen })),
      toggleAdminSidebar: () => set((state) => ({ adminSidebarOpen: !state.adminSidebarOpen })),
      setUserSidebarOpen: (open) => set({ userSidebarOpen: open }),
      setAdminSidebarOpen: (open) => set({ adminSidebarOpen: open }),
    }),
    {
      name: 'lumiere-sidebar-storage',
    }
  )
);

