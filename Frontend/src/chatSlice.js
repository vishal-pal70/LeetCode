import {  createSlice } from '@reduxjs/toolkit';


const initialState = {
  messages: [
    { role: 'model', parts: [{ text: "Hi, How are you" }] },
    { role: 'user', parts: [{ text: "I am Good" }] }
  ],
};

const chatSlice = createSlice({
    name: 'ai',
    initialState,
    reducers: {
        addMessage(state, action) {
        state.messages.push(action.payload);
        },
        clearMessages(state) {
        state.messages = [];
        }
    },
})

export const { addMessage, clearMessages } = chatSlice.actions;
export default chatSlice.reducer;