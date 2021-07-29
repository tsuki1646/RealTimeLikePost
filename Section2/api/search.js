const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const UserModel = require('../models/UserModel');

router.get('/:searchText', authMiddleware, async(req, res) =>{    
    try{
        const {searchText} = req.params;

        if(searchText.length === 0) return;

        //let userPattern = new RegExp(`^${searchText}`);

        const results = await UserModel.find({
            //name:{$regex: searchText, $option:'i'}
            name:new RegExp(searchText, 'i')
        });
        //res.json(results);
        return res.status( 200 ).json( results );

    }catch ( error ) {
        console.log( error );
        return res.status( 500 ).send(`Server error`);
    }
});

module.exports=router;