// Socket.io Controllers File.
const model = require("../models");

var socketClients = [];


exports.actions = function(socket) {
    socket.on("storeClient", user => {
        socketClients.push({
            client: user,
            id: socket.id
        });
    });

    // Notify:
    socket.on("notify", user => {
        socketClients.map(i => i.client === user? socket.broadcast.to(i.id).emit('newNotice') : i);
    });

    // Group chat:
    socket.on("joinGroup", group => {
        socket.join(group);
    });

    socket.on("leaveGroup", group => {
        socket.leave(group);
    });

    socket.on("groupMsg", data => {
        socket.to(data.group).emit("newMsg", {user: data.user, text: data.text});
    });

    // Disconnect:
    socket.on('disconnect', () => {
        for (i = 0; i < socketClients.length; ++i) {
            if (socketClients[i].id === socket.id) {
                socketClients.splice(i, 1);
                break;
            }
        }
    });
}
