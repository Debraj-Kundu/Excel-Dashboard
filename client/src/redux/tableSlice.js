import { createSlice } from "@reduxjs/toolkit";

const tableSlice = createSlice({
  name: "tableData",
  initialState: {
    past: [],
    present: [],
    future: [],
    beforeEdit: [],
  },
  reducers: {
    initialize: (state, action) => {
      state.present = action.payload;
      state.past.push(state.present);
      state.future = [];
      console.log("Redux state - ", state.present);
    },

    updateCell: (state, action) => {
      const { rowId, colId, newData } = action.payload;
      // console.log("redux - ", rowId, colId, newData);
      const newPresent = state.present.map((row) =>
        row.map((cell) =>
          cell.rowId === rowId && cell.colId === colId
            ? { ...cell, data: newData }
            : cell
        )
      );
      // console.log(newPresent);
      state.past.push(state.present);
      state.present = newPresent;
      state.future = [];
    },
    undo: (state) => {
      if (state.past.length > 0) {
        const previousState = state.past.pop();
        state.future.unshift(state.present);
        state.present = previousState;
      }
    },
    redo: (state) => {
      if (state.future.length > 0) {
        const nextState = state.future.shift();
        state.past.push(state.present);
        state.present = nextState;
      }
    },
    captureStateBeforeEdit: (state) => {
      state.beforeEdit = state.present;
    },
    revertBeforeEdit: (state) => {
      state.present = state.beforeEdit;
    },
  },
});

export const {
  initialize,
  updateCell,
  undo,
  redo,
  captureStateBeforeEdit,
  revertBeforeEdit,
} = tableSlice.actions;

export default tableSlice.reducer;
