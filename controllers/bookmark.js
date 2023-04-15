const db = require("../models");
const Bookmark = db.bookmarks;

exports.create = async (req, res) => {
    if (!req.body.userId || req.body.userId.length === 0) {
        res.status(400).send({
            message: "User ID harus diisi!"
        });
        return;
    }

    if (!req.body.title || req.body.title.length === 0) {
        res.status(400).send({
            message: "Judul harus diisi!"
        });
        return;
    }


    // Create a Bookmark
    const payload = {
        userId: req.body.userId,
        title: req.body.title,
    };

    // Save Bookmark in the database
    try {
        const data = await Bookmark.create(payload);

        res.send(data);
    } catch (error) {
        res.status(500).send({
            message: error.message || "Some error occurred while creating the Bookmark."
        });
    }
};