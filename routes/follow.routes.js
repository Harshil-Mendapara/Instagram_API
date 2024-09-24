const express = require('express')
const app = express();
const { sendFollowRequestController, requestStatusController, updateRequestStatusController } = require('../controllers/Follow-c');
const userAuthMiddleware = require('../middlewares/userAuth.middleware');

// * Send Follow request
app.post("/create/:userId", userAuthMiddleware, sendFollowRequestController)

// * follow request status
app.put("/:status(accepted|delete|blocked)/:userId", userAuthMiddleware, requestStatusController)

// * updte request status
app.patch("/request/:requestId", userAuthMiddleware, updateRequestStatusController)



module.exports = app