import axios from 'axios';

const API_URL = 'http://localhost:5000/api/employees';

// Obtener todos los empleados
export const getEmployees = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
};

// Crear un nuevo empleado
export const createEmployee = async (employee: {
  name: string;
  position: string;
  salary: number;
  photoUrl: string;
}) => {
  try {
    const response = await axios.post(API_URL, employee);
    return response.data;
  } catch (error) {
    console.error('Error creating employee:', error);
    throw error;
  }
};

// Actualizar un empleado
export const updateEmployee = async (id: string, employee: {
  name: string;
  position: string;
  salary: number;
  photoUrl: string;
}) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, employee);
    return response.data;
  } catch (error) {
    console.error('Error updating employee:', error);
    throw error;
  }
};

// Eliminar un empleado
export const deleteEmployee = async (id: string) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error('Error deleting employee:', error);
    throw error;
  }
};
