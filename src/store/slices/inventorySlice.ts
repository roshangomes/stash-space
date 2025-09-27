import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Equipment {
  id: string;
  name: string;
  category: string;
  description: string;
  dailyRate: number;
  availability: 'available' | 'rented' | 'maintenance';
  images: string[];
  specifications: Record<string, string>;
  createdAt: string;
}

interface InventoryState {
  equipment: Equipment[];
  isLoading: boolean;
  searchTerm: string;
  categoryFilter: string;
}

const initialState: InventoryState = {
  equipment: [],
  isLoading: false,
  searchTerm: '',
  categoryFilter: 'all',
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    setEquipment: (state, action: PayloadAction<Equipment[]>) => {
      state.equipment = action.payload;
    },
    addEquipment: (state, action: PayloadAction<Equipment>) => {
      state.equipment.push(action.payload);
    },
    updateEquipment: (state, action: PayloadAction<Equipment>) => {
      const index = state.equipment.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.equipment[index] = action.payload;
      }
    },
    deleteEquipment: (state, action: PayloadAction<string>) => {
      state.equipment = state.equipment.filter(item => item.id !== action.payload);
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setCategoryFilter: (state, action: PayloadAction<string>) => {
      state.categoryFilter = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setEquipment,
  addEquipment,
  updateEquipment,
  deleteEquipment,
  setSearchTerm,
  setCategoryFilter,
  setLoading,
} = inventorySlice.actions;

export default inventorySlice.reducer;