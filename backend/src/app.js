const express = require('express');
const classroomRoutes = require('../src/routes/classroom.routes');
const cors = require('cors');

const app = express();

app.use(express.json());

app.use(cors());

app.use(classroomRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});