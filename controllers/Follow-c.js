const { sendFollowRequest, acceptRequest, deleteRequest, blockedRequest } = require("../service/follows.services")
const validator = require("../utils/validator.");
const Joi = require("joi");


const sendFollowRequestController = {
    validaton: validator({
        params: Joi.object({
            userId: Joi.number().required(),
        }),
    }),

    handler: async (req, res) => {
        const { userId: SenderId } = req.user;
        const { userId: ReceiverId } = req.params;

        try {
            if (+SenderId === +ReceiverId) {
                return res.status(400).json({ error: true, message: "You can't send a request to yourself" });
            }

            await sendFollowRequest(SenderId, ReceiverId)
            return res.status(200).json({ error: false, message: "follow request send successfully" });
        } catch (error) {
            return res.status(500).json({
                error: true,
                message: 'Internal Server Error',
                errorMessage: error.message
            });
        }
    }
}


const requestStatusController = {
    validaton: validator({
        params: Joi.object({
            status: Joi.string().required(),
            userId: Joi.number().required(),
        }),
    }),

    handler: async (req, res) => {
        const { userId: ReceiverId } = req.user;
        const { userId: SenderId, status } = req.params;

        if (+SenderId === +ReceiverId) {
            return res.status(400).json({ error: true, message: "You can't perform any action to yourself" });
        }

        try {
            if (status === "accepted") {
                await acceptRequest(null, SenderId, ReceiverId)
            }

            if (status === "delete") {
                await deleteRequest(null, SenderId, ReceiverId)
            }

            if (status === "blocked") {
                await blockedRequest(null, SenderId, ReceiverId)
            }

            return res.status(200).json({ error: false, message: `Request ${status} successfully` });
        } catch (error) {
            return res.status(500).json({
                error: true,
                message: 'Internal Server Error',
                errorMessage: error.message
            });
        }
    }
}

module.exports = {
    sendFollowRequestController,
    requestStatusController,
}