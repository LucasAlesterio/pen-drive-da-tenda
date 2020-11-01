const express = require('express');
const userController = require('./controller/userController');

const routes = express.Router();
routes.post('/addUser',userController.addUser);
routes.post('/login',userController.login);
routes.get('/dataUser',userController.dataUser);
module.exports = routes;