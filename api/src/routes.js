const express = require('express');
const userController = require('./controller/userController');
const linkController = require('./controller/linkController');

const routes = express.Router();
routes.post('/addUser',userController.addUser);
routes.post('/login',userController.login);
routes.post('/dataUser',userController.dataUser);
routes.post('/updateFriend',userController.updateFriend);
routes.post('/updatePassword',userController.updatePassword);
routes.post('/updateProfile',userController.updateProfile);
routes.get('/listFriends',userController.listFriends);
routes.post('/findUser',userController.findUser);
routes.get('/refreshToken',userController.refreshToken);

routes.post('/addLink',linkController.addLink);
routes.post('/deleteLink',linkController.deleteLink);
routes.post('/dataLink',linkController.dataLink);
routes.post('/updateLink',linkController.updateLink);
routes.post('/updateFavorite',linkController.updateFavorite);
routes.post('/rating',linkController.rating);
routes.post('/searchLink',linkController.searchLink);
routes.get('/timeLine',linkController.timeline);
routes.get('/types',linkController.types);

module.exports = routes;