const multer = require('multer');
const path = require('path');


const Storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'profilePhotos/')
    },
    filename: function (req, file, cb) {
        // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        // cb(null, Date.now() + "_" + file.originalname.toLowerCase().replace(/\s+/g, '_'))
        cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
    }
})


const uploader = multer({
    storage: Storage,
    fileFilter: (req, file, cb) => {
        console.log('file uploaded');
        const supportedFile = /png|jpg|jpeg/;
        const extension = path.extname(file.originalname);

        if (supportedFile.test(extension)) {
            cb(null, true)
        }
        else {
            cb(new Error('Only png/jpg/jpeg allowed'))
        }
    },
    limits: {
        fileSize: 1000000,
    }
})


module.exports = uploader;