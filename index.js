const express = require('express');
const cors = require('cors');
const routes = require('./consultas');
const errorMiddleware = require('./errorMiddleware');
const jwt = require('json')

const app = express();

app.use(cors());
app.use(express.json());

app.use('/', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor encendido en el puerto ${PORT}`);
});

app.use(errorMiddleware);