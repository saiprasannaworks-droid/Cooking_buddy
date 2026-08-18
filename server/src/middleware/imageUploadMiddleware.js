import multer from "multer";

// =====================================
// Multer Memory Storage
// =====================================

const storage = multer.memoryStorage();

// =====================================
// Allowed Image Types
// =====================================

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only JPG, JPEG, PNG and WEBP images are allowed."
      ),
      false
    );
  }
};

// =====================================
// Multer Configuration
// =====================================

const imageUpload = multer({
  storage,

  fileFilter,

  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});

export default imageUpload;

/*
|--------------------------------------------------------------------------
| Features Used
|--------------------------------------------------------------------------
| ✓ Multer Memory Storage
| ✓ Image MIME Type Validation
| ✓ File Size Limitation (5 MB)
| ✓ Reusable Upload Middleware
|--------------------------------------------------------------------------
*/