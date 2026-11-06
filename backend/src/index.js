const express = require('express');
const classroomRoutes = require('./routes/classroom.routes');
const groupRoutes = require('./routes/group.routes');
const cors = require('cors');
const app = express();

app.use(express.json());

app.use(cors());

app.use(classroomRoutes);
app.use(groupRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});