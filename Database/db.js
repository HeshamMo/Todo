const mongoose = require('mongoose') ; 
mongoose.connect(process.env.ConnectionString,{connectTimeoutMS:1000})
.then(msg=>{console.log(`connected Successfuly : ${msg}`)})
.catch(err=>{`An Occured MonogDb connection Failed : ${err}`})


module.exports = mongoose