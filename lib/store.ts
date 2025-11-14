// lib/store.ts - Centralized state management with Zustand
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PackingItem {
  item_name: string;
  description: string;
  category: string;
  checked?: boolean;
}

interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
  suggestions?: string[];
}

interface ModalState {
  showSignUpModal: boolean;
  signUpModalTrigger: "soft" | "hard" | null;
  showProModal: boolean;
  showEmailModal: boolean;
  showPDFModal: boolean;
  showEmailListModal: boolean;
  showShareModal: boolean;
  showAffiliateModal: boolean;
}

interface AppState {
  // Packing list state
  packingItems: PackingItem[] | null;
  setPackingItems: (items: PackingItem[] | null) => void;
  toggleItemChecked: (index: number) => void;
  groupByCategory: boolean;
  setGroupByCategory: (value: boolean) => void;
  expandedCategories: Set<string>;
  toggleCategory: (category: string) => void;

  // Conversation state
  conversationMode: boolean;
  setConversationMode: (mode: boolean) => void;
  messages: ConversationMessage[];
  addMessage: (message: ConversationMessage) => void;
  clearMessages: () => void;
  isTyping: boolean;
  setIsTyping: (typing: boolean) => void;
  isGenerating: boolean;
  setIsGenerating: (generating: boolean) => void;

  // User input
  userInput: string;
  setUserInput: (input: string) => void;

  // Modal states
  modals: ModalState;
  setModal: (modal: keyof ModalState, value: boolean) => void;
  setSignUpModalTrigger: (trigger: "soft" | "hard" | null) => void;

  // User stats
  listsCreatedCount: number;
  incrementListsCreated: () => void;
  timeSavedMinutes: number;
  addTimeSaved: (minutes: number) => void;
  remainingLists: number | null;
  setRemainingLists: (count: number | null) => void;

  // UI state
  showRemainingBanner: boolean;
  setShowRemainingBanner: (show: boolean) => void;
  emailCaptured: boolean;
  setEmailCaptured: (captured: boolean) => void;
  shareLink: string;
  setShareLink: (link: string) => void;

  // Reset functions
  resetList: () => void;
  resetAll: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Packing list state and actions
      packingItems: null,
      setPackingItems: (items) => set({ packingItems: items }),
      toggleItemChecked: (index) => {
        const items = get().packingItems;
        if (!items) return;
        const updated = [...items];
        updated[index].checked = !updated[index].checked;
        set({ packingItems: updated });
      },
      groupByCategory: true,
      setGroupByCategory: (value) => set({ groupByCategory: value }),
      expandedCategories: new Set<string>(),
      toggleCategory: (category) => {
        const expanded = new Set(get().expandedCategories);
        if (expanded.has(category)) {
          expanded.delete(category);
        } else {
          expanded.add(category);
        }
        set({ expandedCategories: expanded });
      },

      // Conversation state and actions
      conversationMode: false,
      setConversationMode: (mode) => set({ conversationMode: mode }),
      messages: [],
      addMessage: (message) =>
        set((state) => ({ messages: [...state.messages, message] })),
      clearMessages: () => set({ messages: [] }),
      isTyping: false,
      setIsTyping: (typing) => set({ isTyping: typing }),
      isGenerating: false,
      setIsGenerating: (generating) => set({ isGenerating: generating }),

      // User input
      userInput: "",
      setUserInput: (input) => set({ userInput: input }),

      // Modal states
      modals: {
        showSignUpModal: false,
        signUpModalTrigger: null,
        showProModal: false,
        showEmailModal: false,
        showPDFModal: false,
        showEmailListModal: false,
        showShareModal: false,
        showAffiliateModal: false,
      },
      setModal: (modal, value) =>
        set((state) => ({
          modals: { ...state.modals, [modal]: value },
        })),
      setSignUpModalTrigger: (trigger) =>
        set((state) => ({
          modals: { ...state.modals, signUpModalTrigger: trigger },
        })),

      // User stats (persisted for conversion optimization)
      listsCreatedCount: 0,
      incrementListsCreated: () =>
        set((state) => ({ listsCreatedCount: state.listsCreatedCount + 1 })),
      timeSavedMinutes: 0,
      addTimeSaved: (minutes) =>
        set((state) => ({
          timeSavedMinutes: state.timeSavedMinutes + minutes,
        })),
      remainingLists: null,
      setRemainingLists: (count) => set({ remainingLists: count }),

      // UI state
      showRemainingBanner: false,
      setShowRemainingBanner: (show) => set({ showRemainingBanner: show }),
      emailCaptured: false,
      setEmailCaptured: (captured) => set({ emailCaptured: captured }),
      shareLink: "",
      setShareLink: (link) => set({ shareLink: link }),

      // Reset functions
      resetList: () =>
        set({
          packingItems: null,
          expandedCategories: new Set(),
          conversationMode: false,
          messages: [],
          userInput: "",
        }),
      resetAll: () =>
        set({
          packingItems: null,
          groupByCategory: true,
          expandedCategories: new Set(),
          conversationMode: false,
          messages: [],
          isTyping: false,
          isGenerating: false,
          userInput: "",
          modals: {
            showSignUpModal: false,
            signUpModalTrigger: null,
            showProModal: false,
            showEmailModal: false,
            showPDFModal: false,
            showEmailListModal: false,
            showShareModal: false,
            showAffiliateModal: false,
          },
          showRemainingBanner: false,
          shareLink: "",
        }),
    }),
    {
      name: "packmind-storage",
      // Only persist user stats and preferences, not temporary UI state
      partialize: (state) => ({
        listsCreatedCount: state.listsCreatedCount,
        timeSavedMinutes: state.timeSavedMinutes,
        groupByCategory: state.groupByCategory,
        emailCaptured: state.emailCaptured,
      }),
    }
  )
);
