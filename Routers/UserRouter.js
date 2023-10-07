const express = require('express');
const Router = express.Router();

Router.use(express.json());

const registerationValidators = require('../Validators/RegitrationValidator.js')
const loginValidator = require('../Validators/Loginvalidator.js')
const PatchValidator = require('../Validators/patchValidator.js')

const AuthorizationMiddleware = require('../middlewares/authorizationMiddleware')

const User = require('../Models/User.js')

Router.post('/login',

    loginValidator
    ,
    async (req, res, next) => {


        try {

            const user = await User.findOne({ username: req.body.username });
            if (!user) {
                res.json({ success: false, message: " -- username is wrong" })
                return;
            }
            else {
                const IsAuthorized = await user.checkPassword(req.body.password);
                if (!IsAuthorized) {

                    res.json({ success: false, message: " -- pass is wrong" })
                }
            }

            const token = await user.createJwtToken();
            res.json({ success: true, message: "Weclone user ", doc: user, token })

        }
        catch (err) {

            return next(err);

        }
        // save him >> if success (make  token) , else {return fail }

    }
)


Router.post('/register',

    registerationValidators
    ,
    async (req, res, next) => {

        // all validation are ok 

        // make an object of the user by userModel 

        const user = new User({
            username: req.body.username,
            firstName: req.body.firstName,
            password: req.body.password,
            age: req.body.age,
            newGG:req.body.newGG
        })

        try {
            // save user with hashed pass
            await user.hashPassword();

            const result = await user.save();

            const token = await user.createJwtToken();

            res.json({ success: true, doc: result._doc, token: token })
        }
        catch (err) {

            return next(err);

        }
        // save him >> if success (make  token) , else {return fail }

    }
)


Router.get('',
    [
        AuthorizationMiddleware,

        async (req, res, next) => {
            try {

                const users = await User.find({}, { username: 1 ,firstName:1});

                res.json({ users })
            }
            catch (err) {
                next(err);
            }

        }
    ]
)

Router.delete('', [
    AuthorizationMiddleware,
    async (req, res, next) => {

        try {

            const payload = req.body.tokenPayLoad;
            const _id = payload._id;

            const result = await User.deleteOne({ _id: _id });

            res.send({ success: true, result });
        }

        catch (err) {
            next(err);
        }
    }
])


Router.patch('',[
    AuthorizationMiddleware ,
    PatchValidator,

    async (req,res,next)=>{
        try{
            const payload = req.body.tokenPayLoad;
            const _id = payload._id;

            const result = await User.findByIdAndUpdate(_id,{firstName:req.body.firstName},{returnDocument:'after'})

            res.json({success:true , new:result})
        }
        catch(err){
            next(err); 
        }
    }
])





Router.use((err, req, res, next) => {
    res.json({ succes: false, error: err })
})



module.exports = Router; 