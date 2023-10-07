const express = require('express');
const Router = express.Router();

const User = require('../Models/User.js')

const Todo = require('../Models/Todo.js')

Router.use(express.json())

const authorizationMiddleware = require('../middlewares/authorizationMiddleware.js');


//     userId: the ObjectId of the user,  (33333#)
// title: String, required, min 5, max 20, indexed
// status: String, optional, default is “to-do”
// tags:[String], optional, max length for each tag is 10
// createdAt: timeStamp,
// updatedAt: timeStamp


Router.post('', [
    authorizationMiddleware,
    async (req, res, next) => {

        try {

            const payLoad = req.body.tokenPayLoad;
            const todo = new Todo({
                title: req.body.title,
                status: req.body.status,
                tags: req.body.tags,
                userId: payLoad._id
            })

            const result = await todo.save();
            res.json({ success: true, result })
        }
        catch (err) {
            next(err);
        }
    }
])

Router.get('/:userid', [
    authorizationMiddleware
    ,
    async (req, res, next) => {

        try {

            const payLoad = req.body.tokenPayLoad;
            const tokenUserId = payLoad._id;
            const queryParamUserId = req.params.userid;

            if (tokenUserId != queryParamUserId) {

                res.status(401).json({ success: false, message: "Failed wrong user Id" })
                return;
            }

            const result = await Todo.find({ userId: tokenUserId }).populate('userId');
            res.json({ result })
        }
        catch (err) {
            next(err);
        }
    }
])


Router.patch('/:todoId',
    [
        authorizationMiddleware,

        async (req, res, next) => {
            try {


                const todoId = req.params.todoId;

                const result = await Todo.
                    findByIdAndUpdate(todoId, {
                        title: req.body.title, status: req.body.status,
                        tags: req.body.tags, updatedAt: Date.now()
                    }, { returnDocument: 'after' })

                res.json({ success: true, result })
            }
            catch (err) {
                next(err);
            }
        }
    ])

Router.delete('/:todoId',
    [
        authorizationMiddleware,

        async (req, res, next) => {
            try {


                const todoId = req.params.todoId;

                const result = await Todo.deleteOne({ _id: todoId })

                res.json({ success: true, result })
            }
            catch (err) {
                next(err);
            }
        }
    ])


Router.get('', [
    authorizationMiddleware
    ,
    async (req, res, next) => {

        try {

            const payLoad = req.body.tokenPayLoad;
            const tokenUserId = payLoad._id;

            const limit = 10 | req.query.limit
            const skip = 0 | req.query.skip

            const result = await Todo.find({ userId: tokenUserId }).skip(skip).limit(limit);
            res.json({ result })
        }
        catch (err) {
            next(err);
        }
    }
])

Router.use((err, req, res, next) => {
    res.json({ succes: false, error: err })
})

module.exports = Router; 