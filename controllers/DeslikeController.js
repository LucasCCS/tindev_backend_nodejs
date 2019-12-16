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


        userData.dislikes.push(devData._id);
        await userData.save();

        return res.json(userData);
    }
}