const express = require('express')
const app = express();
const { sendFollowRequestController, requestStatusController } = require('../controllers/Follow-c');
const userAuthMiddleware = require('../middlewares/userAuth.middleware');


// * Send Follow request
app.post("/create/:userId", userAuthMiddleware, sendFollowRequestController.validaton, sendFollowRequestController.handler)

// * updte request status
app.put("/:status(accepted|delete|blocked)/:userId", userAuthMiddleware, requestStatusController.validaton, requestStatusController.handler)




module.exports = app