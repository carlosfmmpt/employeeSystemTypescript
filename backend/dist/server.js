"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const employeeRoutes_1 = __importDefault(require("./routes/employeeRoutes"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = 'mongodb://localhost:27017/employeeDB';
app.use((0, cors_1.default)());
app.use(express_1.default.json());
mongoose_1.default.connect(MONGODB_URI)
    .then(() => console.log('Conectado a MongoDB Employee'))
    .catch((error) => console.error('Error al conectar con MongoDB:', error));
app.use(express_1.default.static(path_1.default.join(__dirname, '../uploads')));
app.use('/api/employees', employeeRoutes_1.default);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
