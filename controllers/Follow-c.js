const { sendFollowRequest, acceptRequest, deleteRequest, blockedRequest } = require("../service/follows.services")

const sendFollowRequestController = async (req, res) => {
    const { id: SenderId } = req.user;
    const { userId: ReceiverId } = req.params;

    if (+SenderId === +ReceiverId) {
        return res.status(400).json({ error: true, message: "You can't send a request to yourself" });
    }
    const request = await sendFollowRequest(SenderId, ReceiverId)
    return res.status(200).json({ error: false, message: "follow request send successfully", data: request });
}


const requestStatusController = async (req, res) => {
    const { id: ReceiverId } = req.user;
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
        console.error("Error:", error);
        res.status(500).json({ error: true, message: "Request Not Found" });
    }
}


const updateRequestStatusController = async (req, res) => {
    const { id: ReceiverId } = req.user;
    const { requestId: RequestID, status } = req.params;

    try {
        if (status === "accepted") {
            await acceptRequest(null, RequestID, ReceiverId)
        }

        if (status === "delete") {
            await deleteRequest(null, RequestID, ReceiverId)
        }

        if (status === "blocked") {
            await deleteRequest(null, RequestID, ReceiverId)
        }

        return res.status(200).json({ error: false, message: `Request ${status} successfully` });
    } catch (error) {
        res.status(404).json({ error: true, message: "Request Not Found" });
    }

}

module.exports = {
    sendFollowRequestController,
    requestStatusController,
    updateRequestStatusController
}