const multer = require('multer');
const { extname } = require('path');
const { v4 } = require('uuid');
const imageId = v4()

// * Upload user avatar
const userAvatarStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/u/");
    },
    async filename(req, file, cb) {
        req.body = { ...req.body, avatar: `u/${imageId}${extname(file.originalname)}` };
        cb(null, `${imageId}${extname(file.originalname)}`);
    }
});

const userAvatarUpdate = multer({
    storage: userAvatarStorage,
    limits: { fileSize: 1024 * 1024 * 5 },
    fileFilter(req, file, cb) {
        const ext = extname(file.originalname);
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') return cb(new Error('avatar must be valid image format'));
        cb(null, true);
    }
}).single("avatar");


// * Upload user post 
const postUploadStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/p/');
    },
    async filename(req, file, cb) {
        const filename = `${imageId}${file.originalname}`;
        req.body = { ...req.body, image: `p/${filename}` };
        cb(null, filename);
    }
});

const postImageUpload = multer({
    storage: postUploadStorage,
    limits: { fileSize: 1024 * 1024 * 2 },
    fileFilter(req, file, cb) {
        const ext = extname(file.originalname);
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') return cb(new Error('Post must be valid image format'));
        cb(null, true);
    }
}).single("post");

module.exports = { userAvatarUpdate, postImageUpload };

