import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployees, removeEmployee } from '../features/employeesSlice';
import { AppDispatch, RootState } from '../store';  // Importamos el tipo AppDispatch
import EmployeeForm from './EmployeeForm';

// Definimos el tipo Employee (si no se ha hecho ya)
interface Employee {
  _id: string;
  name: string;
  position: string;
  salary: number;
  photoUrl: string;
}


const EmployeeList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { employees, loading, error } = useSelector((state: RootState) => state.employees);

  const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null);

  useEffect(() => {
    dispatch(fetchEmployees());  // Cargar los empleados
  }, [dispatch]);

  const handleEdit = (employee: Employee) => {
    setEmployeeToEdit(employee);
  };

  const handleDelete = (id: string) => {
    dispatch(removeEmployee(id));
  };

  const handleCancelEdit = () => {
    setEmployeeToEdit(null);
  };

  const handleFinish = () => {
    setEmployeeToEdit(null);  // Limpiar el empleado en edición
    dispatch(fetchEmployees());  // Refrescar la lista de empleados
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-8 py-12 lg:px-20 bg-gray-200">
      {employeeToEdit ? (
        <div className="flex max-w-xs flex-1 flex-col justify-center px-8  lg:px-20 bg-gray-200">
          
          <EmployeeForm employee={employeeToEdit} onFinish={handleFinish} />
          <button onClick={handleCancelEdit} className="bg-gray-300 text-black py-2 px-4 rounded-lg mt-4">Cancelar Edición</button>
        </div>
      ) : (
        <div>
         
          <EmployeeForm onFinish={handleFinish} />
        </div>
      )}

      <h2 className="text-2xl font-semibold mt-8">Lista de Empleados</h2>
      <ul  className="mt-4 divide-y divide-gray-100 px-6">
        {employees.map((employee) => (
          <li key={employee._id} className="flex justify-between gap-x-4 py-4">
            <div className="flex items-center gap-x-4">
              <img
                alt={employee.name}
                src={`http://localhost:5000/${employee.photoUrl}`}
                className="w-12 h-12 rounded-full bg-gray-50"
              />
              <div>
                <p className="text-sm font-semibold text-gray-900">{employee.name}</p>
                <p className="mt-1 text-xs text-gray-500">{employee.position}</p>
                <p className="mt-1 text-xs text-gray-500">{employee.salary}</p>
              </div>
            </div>
         
            <div className="flex items-center gap-x-4">
              <button
                onClick={() => handleEdit(employee)}
                className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-200"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(employee._id!)}
                className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-200"
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};


export default EmployeeList;
