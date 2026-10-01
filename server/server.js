const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '8mb' }));
app.use('/api/v1/reportes', require('./routes/reportes.routes'));

app.listen(3000, () => console.log('API en http://localhost:3000'));