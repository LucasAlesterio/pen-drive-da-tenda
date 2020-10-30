const express = require('express');
const userController = require('./controller/user');

const routes = express.Router();
routes.get('/addUser',userController.addUser);
routes.get('/login',userController.login);
module.exports = routes;