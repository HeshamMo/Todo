const { default: mongoose, Schema } = require("../Database/db.js");


const TodoSchema = new Schema({
    //     userId: the ObjectId of the user,  (33333#)
    // title: String, required, min 5, max 20, indexed
    // status: String, optional, default is “to-do”
    // tags:[String], optional, max length for each tag is 10
    // createdAt: timeStamp,
    // updatedAt: timeStamp

    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },

    title: {
        type: Schema.Types.String,
        required: true,
        minlength: 5,
        maxlength: 20,
        index: true
    },

    status: {
        type: Schema.Types.String,
        required: false,
        default: 'to-do'
    },

    tags: {
        type: [Schema.Types.String],
        default: [],
        validate: [
            (arr) => {
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i].length > 10) {
                        return false;
                    }
                }
                return true;
            },
            'Length must cannot be more than 10 '
        ]
    },

    createdAt: {
        type: Schema.Types.Date,
        default: Date.now()
    },

    updatedAt: {
        type: Schema.Types.Date,
        default: Date.now()
    }


})



const todoModel = new mongoose.model('todos', TodoSchema);


module.exports = todoModel;