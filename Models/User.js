const {default:mongoose , Schema} = require("../Database/db.js");

const util = require('util') ; 

const jwt = require('jsonwebtoken')
const jwtSign = util.promisify(jwt.sign) ; 
const jwtVerify = util.promisify(jwt.verify) ; 

const jwtSecret = process.env.jwtSecret ;


const bcrypt = require('bcrypt') ; 
const saltRound = 10 ; 

const userSchema = new Schema({
    
    //     username: String, required,unique
    // password : String, required,
    // firstName: String,required, min length 3, max length 15
    // age: Number, optional, min 13

    username :{
        type : String ,
        unique : true , 
        required :true  , 
    } ,
    password : {
        type :String , 
        required:true , 
    },

    firstName : {
        type :String , 
        required:true , 
        minlength : 3 , 
        maxlength : 15 
    },

    age : {
        type : Number ,
        required:false , 
        validate:[
            (val)=> (!isNaN(Number(val)))&&typeof(Number(val))=='number'&&val>=13
            ,
            '!Invalid : Age must be No less than 13 and a numeric value'
        ]
    }
})


userSchema.methods.createJwtToken = async function(){

    const userDoc = this ; 

    return await jwt.sign(
        {username:userDoc.username ,firstName : userDoc.firstName , _id:userDoc._id }
        ,jwtSecret
        ,{expiresIn:'30d' , issuer:'owner' , audience:'users' }
        ) ;

}

userSchema.methods.hashPassword = async function(){
    const userDoc = this ; 
    const hashedPass = await bcrypt.hash(this.password , saltRound) ;
    userDoc.password = hashedPass ; 
}

userSchema.methods.checkPassword = async function(plainTextPassword){
const userDoc = this ; 
    const result = await bcrypt.compare(plainTextPassword,this.password) ; 
    return (result) ; 
}

const userModel = mongoose.model('users',userSchema)


module.exports = userModel