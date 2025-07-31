import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  codeByLanguage: {
    'cpp': '#include <iostream>\nusing namespace std;\n\nint main() {\n  cout << "Hello C++";\n  return 0;\n}',
    'java': 'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello Java");\n  }\n}',
    'javascript': 'console.log("Hello JavaScript");',
  },
  currentLanguage: 'cpp',
};

const codeSlice = createSlice({
  name: 'code',
  initialState,
  reducers: {
    setCode: (state, action) => {
      const { language, code } = action.payload;
      state.codeByLanguage[language] = code;
    },
    changeLanguage: (state, action) => {
      state.currentLanguage = action.payload;
    },
  },
});

export const { setCode, changeLanguage } = codeSlice.actions;
export default codeSlice.reducer;
