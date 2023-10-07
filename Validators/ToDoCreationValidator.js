const { body, validationResult } = require('express-validator')

const registerationValidators = [(req, res, next) => {

    console.log("validate here")
    next()
},
body('title').trim().isLength({ min: 5 , max:20})
    ,

body('tags').isArray().custom((input)=>input.length>=1)
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

module.exports = registerationValidators;