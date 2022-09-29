import create from "zustand";

interface GlobalState {
  loadingCount: number;
  addLoading: () => void;
  removeLoading: () => void;
}

const useGlobalStore = create<GlobalState>()((set) => ({
  loadingCount: 1,
  addLoading: () => {
    set((state) => ({ loadingCount: state.loadingCount + 1 }));
  },
  removeLoading: () => {
    set((state) => ({ loadingCount: state.loadingCount - 1 }));
  },
}));

export default useGlobalStore;
