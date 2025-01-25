
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Parent, Student } from '../../types/profiles';

interface ProfileState {
  parent: Parent | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  parent: null,
  loading: false,
  error: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setParentProfile: (state, action: PayloadAction<Parent>) => {
      state.parent = action.payload;
    },
    addStudent: (state, action: PayloadAction<Student>) => {
      if (state.parent) {
        state.parent.students.push(action.payload);
      }
    },
    updateStudent: (state, action: PayloadAction<Student>) => {
      if (state.parent) {
        const index = state.parent.students.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.parent.students[index] = action.payload;
        }
      }
    },
  },
});

export const { setParentProfile, addStudent, updateStudent } = profileSlice.actions;
export default profileSlice.reducer;