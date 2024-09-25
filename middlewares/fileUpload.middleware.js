const multer = require('multer');
const { extname } = require('path');
const { v4 } = require('uuid')
const fs = require('fs');

const ensureDirectoryExistence = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};
ensureDirectoryExistence('public/u');
ensureDirectoryExistence('public/p');


// * Upload user avatar
const userAvatarStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/");
    },
    async filename(req, file, cb) {
        const imageId = v4();
        const filename = `u/${imageId}${extname(file.originalname)}`;
        req.body.avatar = `${filename}`;
        cb(null, filename);
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
        cb(null, 'public/');
    },
    async filename(req, file, cb) {
        const imageId = v4();
        const filename = `p/${imageId}${extname(file.originalname)}`;
        req.body.image = `${filename}`;
        cb(null, filename);
    }
});

const postImageUpload = multer({
    storage: postUploadStorage,
    limits: { fileSize: 1024 * 1024 * 5 },
    fileFilter(req, file, cb) {
        const ext = extname(file.originalname);
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') return cb(new Error('Post must be valid image format'));
        cb(null, true);
    }
}).single('image')


module.exports = { userAvatarUpdate, postImageUpload };

