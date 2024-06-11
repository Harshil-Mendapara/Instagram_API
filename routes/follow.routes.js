const express = require('express')
const { sendFollowRequestController, requestStatusController, updateRequestStatusController } = require('../controllers/Follow-c');
const userAuthMiddleware = require('../middlewares/userAuth.middleware');
const app = express()

// * Send Follow request
app.post("/create/:userId", userAuthMiddleware, sendFollowRequestController)

// * follow request status
app.put("/:status(accepted|delete|blocked)/:userId", userAuthMiddleware, requestStatusController)

app.patch("/request/:status(accepted|delete|blocked)/:requestId", userAuthMiddleware, updateRequestStatusController)


module.exports = app