const router = require('express').Router();

const usersRouter = require('./user.routes');
const followRouter = require('./follow.routes');
const PostRouter = require('./post.routes');

router.use('/users', usersRouter);
router.use('/follows', followRouter);
router.use('/posts', PostRouter);

module.exports = router;