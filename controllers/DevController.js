const axios = require('axios');
const Dev = require('../models/Dev');
module.exports = {
    async index(req,res) {
        const { userid: userId } = req.headers;

        const userData = await Dev.findById(userId);

        if (!userData) {
            return res.status(400).json({error: 'Você não está autenticado.'});
        }
        
        const users = await Dev.find({
            $and: [
                { _id: { $ne: userId} },
                {_id: {$nin: userData.dislikes} },
                {_id: {$nin: userData.likes} }
            ]
        })

        return res.json(users);
    },
    async store(req,res) {
        const { username } = req.body;
        
        const userExists = await Dev.findOne({username:username});

        const response = await axios.get(
          `https://api.github.com/users/${username}`
        );

        const { avatar_url: avatar, name, bio } = response.data;

        if(userExists) {
            
            const devUpdateResponse = await Dev.findByIdAndUpdate(
              {
                _id: userExists._id
              },
              {
                $set: {
                  username,
                  name,
                  avatar,
                  bio
                }
              }
            );

            return res.json(devUpdateResponse);
        }

        const devResponse = await Dev.create({
            username,
            name,
            avatar,
            bio
        });

        return res.json(devResponse);
    }
}