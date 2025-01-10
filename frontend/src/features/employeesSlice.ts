import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/employees';


interface Employee {
  _id: string;
  name: string;
  position: string;
  salary: number;
  photoUrl: string;
}

interface EmployeesState {
  employees: Employee[];
  loading: boolean;
  error: string | null; // Agregado para manejar posibles errores
}

const initialState: EmployeesState = {
  employees: [],
  loading: false,
  error: null,
};

// Crear un thunk asincrónico para obtener los empleados
export const fetchEmployees = createAsyncThunk('employees/fetchEmployees', async () => {
    const response = await axios.get(API_URL); // Llamada a la función API
    return response.data; // Retorna los empleados obtenidos
  }
);

// Crear un nuevo empleado
export const addEmployee = createAsyncThunk('employees/addEmployee', async (employee: Employee) => {
  const response = await axios.post(API_URL, employee); // Llamada a la función API
  return response.data; // Retorna los empleados obtenidos
}
);

// Actualizar un empleado
export const editEmployee = createAsyncThunk('employees/editEmployee', async (employee: Employee) => {
  if (!employee._id) {
    throw new Error("Employee id is required for update");
  }
  const response = await axios.put(`${API_URL}/${employee._id}`, employee); // Usamos la constante API_URL aquí
  return response.data; // Retorna el empleado actualizado
});

// Eliminar un empleado
export const removeEmployee = createAsyncThunk('employees/removeEmployee', async (id: string) => {
  await axios.delete(`${API_URL}/${id}`); // Usamos la constante API_URL aquí
  return id; // Retornamos el id para eliminarlo del estado
});


export const employeesSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Obtener empleados
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch employees';
      })
      // Crear un empleado
      .addCase(addEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employees.push(action.payload);
      })
      .addCase(addEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create employee';
      })
      // Actualizar un empleado
      .addCase(editEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editEmployee.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.employees.findIndex((emp) => emp._id === action.payload._id);
        if (index !== -1) {
          state.employees[index] = action.payload;
        }
      })
      .addCase(editEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update employee';
      })
      // Eliminar un empleado
      .addCase(removeEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = state.employees.filter((emp) => emp._id !== action.payload);
      })
      .addCase(removeEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete employee';
      });
  },
});

export default employeesSlice.reducer;
