const express = require('express');
const controller = require('../controllers/tradeController'); // 

const router = express.Router();

//Get //trades: send all trades to the user
router.get('/', controller.index);

//Get //trades/new: send html for creating a new trade
router.get('/new', controller.new);

//POST /trades: create a new trade
router.post('/', controller.create);

//GET /trades/view: send a html page depending on set
router.get('/view/:id', controller.view);

//Get /trades/view/:id/edit: send an html page to edit trade
router.get('/view/:id/edit', controller.edit);

//Get //trades: send details of trade
router.get('/:id', controller.show);

//PUT //trades/view/:id: Return edit values to server
router.put('/view/:id', controller.update);

//DELETE /trades/view/:id: delete the trade identified by id
router.delete('/view/:id', controller.delete);

module.exports = router;