import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  summary: null,
  riskAssessment: null,
  rootCause: null,
  capaRecommendation: null,
  suggestedResponse: null,
  extractedEntities: null,
  duplicateMatches: [],
  missingFields: [],
  confidenceScore: null,
  priorityPrediction: null,
  chatMessages: [],
  processing: false,
  progress: 0,
  progressMessage: "",
  error: null,
};

const aiSlice = createSlice({
  name: "ai",
  initialState,
  reducers: {
    setAiProcessing(state, action) {
      state.processing = action.payload;
    },
    setAiProgress(state, action) {
      state.progress = action.payload.progress;
      state.progressMessage = action.payload.message || "";
    },
    setAiAnalysis(state, action) {
      Object.assign(state, action.payload);
    },
    addChatMessage(state, action) {
      state.chatMessages.push(action.payload);
    },
    clearChatMessages(state) {
      state.chatMessages = [];
    },
    resetAiState(state) {
      Object.assign(state, initialState);
    },
    setAiError(state, action) {
      state.error = action.payload;
    },
  },
});

export const {
  setAiProcessing,
  setAiProgress,
  setAiAnalysis,
  addChatMessage,
  clearChatMessages,
  resetAiState,
  setAiError,
} = aiSlice.actions;

export default aiSlice.reducer;
