const Dev = require('../models/Dev');
module.exports = {
    async store(req,res) {
        const { userid: userId } = req.headers;
        const { devId } = req.params;

        const userData = await Dev.findById(userId);
        const devData = await Dev.findById(devId);

        if(!devData) {
            return res.status(400).json({error: 'Usuário não encontrado.'});
        }

        if(devData.likes.includes(userData._id)) {
            const userSocket = req.connectedUsers[userId];
            const devSocket = req.connectedUsers[devId];

            if(userSocket) {
                req.io.to(userSocket).emit('match', devData)
            }

            if (devSocket) {
                req.io.to(devSocket).emit('match', userData)
            }

        }

       userData.likes.push(devData._id);
       await userData.save();

        return res.json(userData);
    }
};