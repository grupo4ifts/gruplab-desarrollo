const express = require('express');
const classroomRoutes = require('./routes/classroom.routes');
const memberRoutes = require('./routes/member.routes');  
const cors = require('cors');
const app = express();

app.use(express.json());

app.use(cors());
app.use(memberRoutes);  
git 
app.use(classroomRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});