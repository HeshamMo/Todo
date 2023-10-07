const { body, validationResult } = require('express-validator')

const loginValidator = [(req, res, next) => {

    console.log("validate here")
    next()
},
body('username').trim().isLength({ min: 3 , max:15})
    ,

body('password').trim().isLength({ min: 3  , max:15})
    ,

(req, res, next) => {
    console.log("req res next here ")

    const result = validationResult(req);

    if (!result.isEmpty()) {
        return res.json({ result })
    }
    else {
        next() ; 
    }
}];

module.exports = loginValidator;