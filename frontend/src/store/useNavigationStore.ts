import { create } from "zustand";

interface Breadcrumb {
  label: string;
  path: string;
}

interface NavState {
  currentPage: string;
  breadcrumbs: Breadcrumb[];
  navigate: (page: string, bc: Breadcrumb[]) => void;
}

export const useNavigationStore = create<NavState>((set) => ({
  currentPage: "Home",
  breadcrumbs: [{ label: "Home", path: "/" }],
  navigate: (page, bc) => set({ currentPage: page, breadcrumbs: bc }),
}));
