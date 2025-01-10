"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEmployee = exports.updateEmployee = exports.createEmployee = exports.getEmployees = void 0;
const employee_1 = __importDefault(require("../models/employee"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const multer_1 = __importDefault(require("multer"));
// Configuración de multer para almacenar las imágenes en una carpeta 'uploads/'
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path_1.default.join(__dirname, '../../uploads')); // Carpeta donde se guardarán las imágenes
    },
    filename: (req, file, cb) => {
        const fileName = `${Date.now()}_${file.originalname}`;
        cb(null, fileName); // El nombre del archivo será una combinación de timestamp y el nombre original
    },
});
const upload = (0, multer_1.default)({ storage }); // Configurar multer con el almacenamiento
// Obtener todos los empleados
const getEmployees = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const employees = yield employee_1.default.find();
        res.json(employees);
    }
    catch (err) {
        res.status(500).json({ message: 'Error getting employees', error: err });
    }
});
exports.getEmployees = getEmployees;
// Crear empleado
const createEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Usar el middleware de multer para manejar la subida de archivos
    upload.single('photo')(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return res.status(400).json({ message: 'Error uploading file', error: err });
        }
        // console.log("Body data:", req.body);  // Log de los datos del formulario
        // console.log("File data:", req.file);  // Log del archivo cargado
        const { name, position, salary } = req.body;
        const photoUrl = req.file ? req.file.filename : ''; // Si se sube una imagen, se guarda el nombre del archivo
        try {
            const newEmployee = new employee_1.default({ name, position, salary, photoUrl });
            yield newEmployee.save();
            res.status(201).json(newEmployee);
        }
        catch (err) {
            res.status(400).json({ message: 'Error creating employee', error: err });
        }
    }));
});
exports.createEmployee = createEmployee;
// Actualizar empleado
const updateEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    // Usar el middleware de multer para manejar la subida de archivos
    upload.single('photo')(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return res.status(400).json({ message: 'Error uploading file', error: err });
        }
        const { name, position, salary } = req.body;
        const photoUrl = req.file ? req.file.filename : ''; // Si se sube una nueva imagen, se guarda el nombre del archivo
        try {
            const employee = yield employee_1.default.findById(id);
            if (!employee) {
                return res.status(404).json({ message: 'Employee not found' });
            }
            // Si se subió una nueva imagen, eliminamos la imagen anterior
            if (photoUrl && employee.photoUrl) {
                fs_1.default.unlink(path_1.default.join(__dirname, '../../uploads', employee.photoUrl), (err) => {
                    if (err) {
                        console.error('Error deleting old image:', err);
                    }
                });
            }
            const updatedEmployee = yield employee_1.default.findByIdAndUpdate(id, { name, position, salary, photoUrl: photoUrl || employee.photoUrl }, { new: true });
            res.json(updatedEmployee);
        }
        catch (err) {
            res.status(400).json({ message: 'Error updating employee', error: err });
        }
    }));
});
exports.updateEmployee = updateEmployee;
const deleteEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const employee = yield employee_1.default.findByIdAndDelete(id);
    if (employee && employee.photoUrl) {
        fs_1.default.unlink(path_1.default.join(__dirname, '../../uploads', employee.photoUrl), (err) => {
            if (err) {
                console.error('Error deleting image:', err);
            }
        });
    }
    res.json({ message: 'Employee deleted' });
});
exports.deleteEmployee = deleteEmployee;
