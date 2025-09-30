const multer = require('multer');
const path = require('path');
const fs = require('fs');

// إعداد التخزين
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // إنشاء مجلد uploads إذا لم يكن موجود
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir); // المجلد اللي هيخزن الصور
    },
    filename: (req, file, cb) => {
        // اسم الصورة هيكون unique باستخدام التاريخ
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

module.exports = upload;
