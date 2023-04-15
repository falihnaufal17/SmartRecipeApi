const db = require("../models");
const Rating = db.ratings;

exports.create = async (req, res) => {
    if (!req.body.userId || req.body.userId.length === 0) {
        res.status(400).send({
            message: "User ID harus diisi!"
        });
        return;
    }

    if (!req.body.rate || req.body.rate.length === 0) {
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

    // Create a Rating
    const payload = {
        userId: req.body.userID,
        rate: req.body.rate,
        review: req.body.review
    }

    // Save Rating in the database
    try {
        const data = await Rating.create(payload);

        res.send(data);
    } catch (error) {
        res.status(500).send({
            message: error.message || "Some error occurred while creating the Bookmark."
        });
    }
};