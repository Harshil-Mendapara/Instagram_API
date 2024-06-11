const { Follow } = require("./../models");

const sendFollowRequest = async (SenderId, ReceiverId) => {
    try {
        const findRequest = await Follow.findOne({ where: { sender_id: SenderId, receiver_id: ReceiverId } });

        if (findRequest) throw Error("You both are already in connection");

        await Follow.create({
            status: "requested",
            sender_id: SenderId,
            receiver_id: ReceiverId
        })
    } catch (error) {
        if (error.index === "FollowersFollowings_receiver_id_fkey")
            throw Error("Invalid user for the request");
        throw Error(error);
    }
};

const acceptRequest = async (RequestId, SenderId, ReceiverId) => {
    if (!((RequestId || SenderId) && ReceiverId)) {
        return res.status(400).json({ error: true, message: "Invalid request found" });
    }

    const Request = await Follow.findOne({
        where: {
            status: "requested",
            ...(RequestId && {id: RequestId}),
            ...(SenderId && {sender_id : SenderId}),
            receiver_id : ReceiverId,
        }
    })
    if(!Request){
        throw Error("Request Not Found")
    }
    Request.status = "accepted"
    await Request.save()
}

const deleteRequest = async (RequestId, SenderId, ReceiverId) => {
    if (!((RequestId || SenderId) && ReceiverId)) {
        return res.status(400).json({ error: true, message: "Invalid request found" });
    }

    const Request = await Follow.findOne({
        where: {
            status: "requested",
            ...(RequestId && {id: RequestId}),
            ...(SenderId && {sender_id : SenderId}),
            receiver_id : ReceiverId,
        }
    })
    if(!Request){
        throw Error("Request Not Found")
    }
    Request.status = "delete"
    await Request.save()
}

const blockedRequest = async (RequestId, SenderId, ReceiverId) => {
    if (!((RequestId || SenderId) && ReceiverId)) {
        return res.status(400).json({ error: true, message: "Invalid request found" });
    }

    const Request = await Follow.findOne({
        where: {
            status: "requested",
            ...(RequestId && {id: RequestId}),
            ...(SenderId && {sender_id : SenderId}),
            receiver_id : ReceiverId,
        }
    })
    if(!Request){
        throw Error("Request Not Found")
    }
    Request.status = "blocked"
    await Request.save()
}

module.exports = {
    sendFollowRequest,
    acceptRequest,
    deleteRequest,
    blockedRequest
}