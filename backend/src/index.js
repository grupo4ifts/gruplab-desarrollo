const express = require('express');
const classroomRoutes = require('./routes/classroom.routes');
const memberRoutes = require('./routes/member.routes');
const groupRoutes = require('./routes/group.routes');
const boardRoutes = require('./routes/board.routes')
const taskRoutes = require('./routes/task.routes')
const commentRoutes = require('./routes/commnet.routes')
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

app.use(memberRoutes);
app.use(classroomRoutes);
app.use(groupRoutes);
app.use(boardRoutes);
app.use(taskRoutes);
app.use(commentRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});