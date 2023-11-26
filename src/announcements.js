import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  viewedBreakdown: false
}

export const announcementsSlice = createSlice({
  name: 'announcements',
  initialState: initialState,
  reducers: {
    markBreakdownViewed: (state) => {
      state.viewedBreakdown = true
    }
  },
})


export const { markBreakdownViewed } = announcementsSlice.actions
export default announcementsSlice.reducer