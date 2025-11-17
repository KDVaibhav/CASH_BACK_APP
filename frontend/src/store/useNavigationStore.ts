import { create } from "zustand";

interface Breadcrumb {
  label: string;
}

interface NavState {
  currentPage: string;
  breadcrumbs: Breadcrumb[];
  navigate: (page: string, bc: Breadcrumb[]) => void;
}

export const useNavigationStore = create<NavState>((set) => ({
  currentPage: "Home",
  breadcrumbs: [{ label: "Home" }],
  navigate: (page, bc) => set({ currentPage: page, breadcrumbs: bc }),
}));
