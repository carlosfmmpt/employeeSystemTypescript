import { Request, Response } from 'express';
import Employee from '../models/employee';
import path from 'path';
import fs from 'fs';
import multer from 'multer';

// Configuración de multer para almacenar las imágenes en una carpeta 'uploads/'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));  // Carpeta donde se guardarán las imágenes
  },
  filename: (req, file, cb) => {
    const fileName = `${Date.now()}_${file.originalname}`;
    cb(null, fileName);  // El nombre del archivo será una combinación de timestamp y el nombre original
  },
});

const upload = multer({ storage });  // Configurar multer con el almacenamiento

// Obtener todos los empleados
export const getEmployees = async (req: Request, res: Response) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: 'Error getting employees', error: err });
  }
};

// Crear empleado
export const createEmployee = async (req: Request, res: Response) => {
  // Usar el middleware de multer para manejar la subida de archivos
  upload.single('photo')(req, res, async (err: any) => {
    if (err) {
      return res.status(400).json({ message: 'Error uploading file', error: err });
    }
    // console.log("Body data:", req.body);  // Log de los datos del formulario
    // console.log("File data:", req.file);  // Log del archivo cargado

    const { name, position, salary } = req.body;
    const photoUrl = req.file ? req.file.filename : '';  // Si se sube una imagen, se guarda el nombre del archivo

    try {
      const newEmployee = new Employee({ name, position, salary, photoUrl });
      await newEmployee.save();
      res.status(201).json(newEmployee);
    } catch (err) {
      res.status(400).json({ message: 'Error creating employee', error: err });
    }
  });
};

// Actualizar empleado
export const updateEmployee = async (req: Request, res: Response) => {
  const { id } = req.params;

  // Usar el middleware de multer para manejar la subida de archivos
  upload.single('photo')(req, res, async (err: any) => {
    if (err) {
      return res.status(400).json({ message: 'Error uploading file', error: err });
    }

    const { name, position, salary } = req.body;
    const photoUrl = req.file ? req.file.filename : '';  // Si se sube una nueva imagen, se guarda el nombre del archivo

    try {
      const employee = await Employee.findById(id);
      if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
      }

      // Si se subió una nueva imagen, eliminamos la imagen anterior
      if (photoUrl && employee.photoUrl) {
        fs.unlink(path.join(__dirname, '../../uploads', employee.photoUrl), (err) => {
          if (err) {
            console.error('Error deleting old image:', err);
          }
        });
      }

      const updatedEmployee = await Employee.findByIdAndUpdate(
        id,
        { name, position, salary, photoUrl: photoUrl || employee.photoUrl },
        { new: true }
      );

      res.json(updatedEmployee);
    } catch (err) {
      res.status(400).json({ message: 'Error updating employee', error: err });
    }
  });
};

export const deleteEmployee = async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  const employee = await Employee.findByIdAndDelete(id);

  if (employee && employee.photoUrl) {
    fs.unlink(path.join(__dirname, '../../uploads', employee.photoUrl), (err) => {
      if (err) {
        console.error('Error deleting image:', err);
      }
    });
  }
  res.json({ message: 'Employee deleted' });

};

