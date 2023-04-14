const db = require("../models");
const Bookmark = db.bookmarks;

exports.create = async (req, res) => {
    if (!req.body.rating || req.body.rating.length === 0) {
        res.status(400).send({
            message: "Rating harus diisi!"
        });
        return;
    }

    if (!req.body.review || req.body.review.length === 0) {
        res.status(400).send({
            message: "Review harus diisi!"
        });
        return;
    }

    // Create a Bookmark
    const payload = {
        rating: req.body.rating,
        review: req.body.review,
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