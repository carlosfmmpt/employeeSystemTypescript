import { useState, useEffect } from 'react';
import axios from 'axios';

// Definir la interfaz para un empleado
interface Employee {
  _id: string;       // ID único del empleado
  name: string;      // Nombre del empleado
  position: string;  // Cargo del empleado
  salary: number;    // Salario del empleado
  photoUrl: string;  // URL de la foto del empleado
  onFinish?: () => void;
}

interface EmployeeFormProps {
  employee?: Employee;  // El empleado puede ser opcional si no se pasa para crear uno nuevo
  onFinish?: () => void;  // Función que se ejecutará al finalizar el formulario
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ employee, onFinish }) => {

  const [formData, setFormData] = useState({
    name: '',
    position: '',
    salary: 0,
    photoUrl: '',
  });
  const [image, setImage] = useState<File | null>(null);  // Nuevo estado para la imagen
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name,
        position: employee.position,
        salary: employee.salary,
        photoUrl: employee.photoUrl,
      });
      setIsEditing(true);
    } else {
      setFormData({
        name: '',
        position: '',
        salary: 0,
        photoUrl: '',
      });
      setIsEditing(false);
    }
  }, [employee]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = new FormData();
    form.append('name', formData.name);
    form.append('position', formData.position);
    form.append('salary', formData.salary.toString());
    if (image) {
      form.append('photo', image);  // Agregar la imagen si se seleccionó
    }
   // console.log('Form data:', formData);  // Ver los datos enviados
    try {
      if (isEditing) {
        // Actualizar el empleado
        await axios.put(`http://localhost:5000/api/employees/${employee._id}`, form)
      } else {
        // Crear un nuevo empleado
        await axios.post('http://localhost:5000/api/employees', form)


      }

      // Limpiar el formulario
      setFormData({
        name: '',
        position: '',
        salary: 0,
        photoUrl: '',
      });
      setImage(null);  // Resetear la imagen

      // Llamar a la función de finalizar si existe
      if (onFinish) onFinish();
    } catch (error) {
      console.error('Error al guardar el empleado:', error);
    }
  };

  return (
    
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-2 lg:px-8 bg-gray-200">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900">
          {isEditing ? 'Editar Empleado' : 'Crear Empleado'}
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-900">
              Nombre
            </label>
            <div className="mt-2">
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
              />
            </div>
          </div>

          {/* Posición */}
          <div>
            <label htmlFor="position" className="block text-sm font-medium text-gray-900">
              Posición
            </label>
            <div className="mt-2">
              <input
                id="position"
                name="position"
                type="text"
                value={formData.position}
                onChange={handleChange}
                required
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
              />
            </div>
          </div>

          {/* Salario */}
          <div>
            <label htmlFor="salary" className="block text-sm font-medium text-gray-900">
              Salario
            </label>
            <div className="mt-2">
              <input
                id="salary"
                name="salary"
                type="number"
                value={formData.salary}
                onChange={handleChange}
                required
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
              />
            </div>
          </div>

          {/* Foto */}
          <div>
            <label htmlFor="photo" className="block text-sm font-medium text-gray-900">
              Foto
            </label>
            <div className="mt-2">
              <input
                id="photo"
                name="photo"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required={!isEditing}  // La imagen es obligatoria solo si no estamos editando
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
              />
            </div>
          </div>

          {/* Vista previa de la imagen seleccionada */}
          {image && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-900">Imagen seleccionada:</h4>
              <img
                src={URL.createObjectURL(image)}
                alt="Vista previa"
                className="mt-2 w-24 h-24 object-cover rounded-md"
              />
            </div>
          )}

          {/* Botón de envío */}
          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-2 focus:outline-indigo-600"
            >
              {isEditing ? 'Actualizar Empleado' : 'Crear Empleado'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;
