import { create } from "zustand";
import { UserContext, GeneratedName } from "@/lib/types";
import { CARDS } from "@/lib/cards-config";

interface FlowState {
  // 当前卡片索引
  currentCardIndex: number;
  // 用户上下文
  context: Partial<UserContext>;
  // 生成的名字
  generatedNames: GeneratedName[];
  // 是否正在生成
  isGenerating: boolean;
  // 收藏的名字 ID
  favoriteIds: string[];

  // Actions
  setCurrentCardIndex: (index: number) => void;
  nextCard: () => void;
  prevCard: () => void;
  updateContext: (field: keyof UserContext, value: unknown) => void;
  setGeneratedNames: (names: GeneratedName[]) => void;
  setIsGenerating: (val: boolean) => void;
  toggleFavorite: (nameId: string) => void;
  resetFlow: () => void;

  // Computed
  currentGroup: () => number;
  progress: () => number;
  isLastCard: () => boolean;
}

const initialContext: Partial<UserContext> = {
  surname: "",
  gender: "boy",
  traits: [],
  wishes: [],
  style: 5,
  nameLength: "any",
  pronunciation: 5,
  hobbies: [],
  wuxing: [],
};

// 从 localStorage 加载收藏
function loadFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem("name-agent-favorites");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export const useFlowStore = create<FlowState>((set, get) => ({
  currentCardIndex: 0,
  context: { ...initialContext },
  generatedNames: [],
  isGenerating: false,
  favoriteIds: loadFavorites(),

  setCurrentCardIndex: (index) => set({ currentCardIndex: index }),

  nextCard: () => {
    const { currentCardIndex } = get();
    if (currentCardIndex < CARDS.length - 1) {
      set({ currentCardIndex: currentCardIndex + 1 });
    }
  },

  prevCard: () => {
    const { currentCardIndex } = get();
    if (currentCardIndex > 0) {
      set({ currentCardIndex: currentCardIndex - 1 });
    }
  },

  updateContext: (field, value) =>
    set((state) => ({
      context: { ...state.context, [field]: value },
    })),

  setGeneratedNames: (names) => set({ generatedNames: names }),

  setIsGenerating: (val) => set({ isGenerating: val }),

  toggleFavorite: (nameId) => {
    const { favoriteIds } = get();
    const next = favoriteIds.includes(nameId)
      ? favoriteIds.filter((id) => id !== nameId)
      : [...favoriteIds, nameId];
    localStorage.setItem("name-agent-favorites", JSON.stringify(next));
    set({ favoriteIds: next });
  },

  resetFlow: () =>
    set({
      currentCardIndex: 0,
      context: { ...initialContext },
      generatedNames: [],
      isGenerating: false,
    }),

  currentGroup: () => {
    const card = CARDS[get().currentCardIndex];
    return card?.group ?? 1;
  },

  progress: () => {
    return ((get().currentCardIndex + 1) / CARDS.length) * 100;
  },

  isLastCard: () => {
    return get().currentCardIndex === CARDS.length - 1;
  },
}));
