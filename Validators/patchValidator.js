const { body, validationResult } = require('express-validator')

const PatchValidator = [(req, res, next) => {

    console.log("validate here")
    next()
},
body('firstName').trim().isLength({ min: 3 , max:15})
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

module.exports = PatchValidator;