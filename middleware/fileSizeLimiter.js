const MB = 512; // 512 MB
const FILE_SIZE_LIMIT = MB * 1024 * 1024;

const fileSizeLimiter = (req, res, next) => {
    const files = req.files;

    const filesOverLimit = [];

    Object.keys(files).forEach((key) => {
        if (files[key].size > FILE_SIZE_LIMIT) {
            filesOverLimit.push(files[key].name);
        }
    });

    if (filesOverLimit.length > 0) {
        return res.status(400).json({
            status: "fail",
            message: `File size limit of ${MB}mb exceeded for ${filesOverLimit.join(", ")}`,
        });
    }

    next();
}

module.exports = fileSizeLimiter;