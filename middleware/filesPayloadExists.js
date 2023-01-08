const filesPayloadExists = (req, res, next) => {
    if (req.files === null) {
        return res.status(400).json({ status: "fail", message: "No file uploaded" });
    }

    next();
};

module.exports = filesPayloadExists;