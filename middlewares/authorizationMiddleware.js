const jwt = require('jsonwebtoken') ;
const util = require('util') ;
const jwtSecret = '965a14s7gf2d6d8sa4s11278sa1##$no11..a@@ii990'

const verifyJwtToken = util.promisify(jwt.verify) ; 

const verifyToken = async (req, res , next)=>{
    const token = req.headers.authorization ; 
    if (!token){
        res.status(401).json({success:false , message :"Unothorized user !!"})
        return 
    }
    else {
        
        try{
            const payLoad = await verifyJwtToken(token , jwtSecret) ; 
            req.body.tokenPayLoad = payLoad ; 
            next() ; 
            return ;
        }
        catch(err){
            next(err) ; 
        }
    }

}


module.exports = verifyToken ;