import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Presentation } from "../../types/presentation";
import type { Slide } from "../../types/slide";

export interface PresentationState {
  presentation: Presentation | null;
  activeSlideId: string | null;
  selectedObjectIds: string[];
  canUndo: boolean;
  canRedo: boolean;
  isPreviewMode: boolean;
}

const initialState: PresentationState = {
  presentation: null,
  activeSlideId: null,
  selectedObjectIds: [],
  canUndo: false,
  canRedo: false,
  isPreviewMode: false,
};

const presentationSlice = createSlice({
    name: 'presentation',
    initialState,
    reducers: {
        setPresentation: (state, action: PayloadAction<Presentation>) => {
            state.presentation = action.payload;
            state.activeSlideId = action.payload.slides[0]?.id || null;
            state.selectedObjectIds = [];
        },
        setActiveSlide: (state, action: PayloadAction<string>) => {
            state.activeSlideId = action.payload;
            state.selectedObjectIds = [];
        },
        toggleSelectObject: (state, action: PayloadAction<string>) => {
            const index = state.selectedObjectIds.indexOf(action.payload);
            if (index === -1) {
                state.selectedObjectIds.push(action.payload);
            } else {
                state.selectedObjectIds.splice(index, 1);
            }
        },
        clearSelection: (state) => {
            state.selectedObjectIds = [];
        },
        setCanUndo: (state, action: PayloadAction<boolean>) => {
            state.canUndo = action.payload;
        },
        setCanRedo: (state, action: PayloadAction<boolean>) => {
            state.canRedo = action.payload;
        },
        setPreviewMode: (state, action: PayloadAction<boolean>) => {
            state.isPreviewMode = action.payload;
        },
    },
});

export const {
  setPresentation,
  setActiveSlide,
  toggleSelectObject,
  clearSelection,
  setCanUndo,
  setCanRedo,
  setPreviewMode,
} = presentationSlice.actions;

export default presentationSlice.reducer;

