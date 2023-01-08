const path = require("path");

const fileExtLimiter = (allowedExtArray) => {
    return (req, res, next) => {
        if (allowedExtArray[0] === "*") {
            return next();
        }
        const files = req.files;
        const fileExtensions = [];
        Object.keys(files).forEach((key) => {
            fileExtensions.push(path.extname(files[key].name));
        });

        const allowed = fileExtensions.every((ext) => allowedExtArray.includes(ext));
        if (!allowed) {
            return res.status(400).json({
                status: "fail",
                message: `File extension not allowed. Allowed extensions: ${allowedExtArray.join(", ")}`,
            });
        }

        next();
    };
}

module.exports = fileExtLimiter;