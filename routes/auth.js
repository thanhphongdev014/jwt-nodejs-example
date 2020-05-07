const router = require('express').Router();
const User = require('../model/User');
const {registerValidation, loginValidation} = require('../validation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// REGISTER 
router.post('/register', async (req,res) => {
    //VALIDATION
    const {error} = registerValidation(req.body);
    if(error) res.status(400).send(error.details[0].message);

    // CHECK EXIST EMAIL
    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send('email exist');

    //HASH PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    
    //ADD USER
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    });

    try{
        const savedUser = await user.save();
        res.send({user: user._id});
    }catch(err){
        res.status(400).send(err);
    }
})

//LOGIN
router.post('/login',async (req,res) => {
    //VALIDATION
    const {error} = loginValidation(req.body);
    if(error) res.status(400).send(error.details[0].message);

    // CHECK EXIST EMAIL
    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('Email is incorrect');

    //CHECK PASSWORD

    const validPass = await bcrypt.compare(req.body.password,user.password);
    if(!validPass) return res.status(400).send('passord is incorrect');

    //CREATE TOKEN
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token',token).send(token);
    //res.send('logged in');

});


module.exports = router;