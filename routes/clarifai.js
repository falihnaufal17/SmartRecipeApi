module.exports = (app) => {
    var router = require("express").Router();

    // URL of image to use. Change this to your image.
    const IMAGE_URL = "https://samples.clarifai.com/metro-north.jpg";

    const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");

    const stub = ClarifaiStub.grpc();

    // This will be used by every Clarifai endpoint call
    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Key " + "03a1536584404599bb8a6fd75100f70e");

    stub.PostModelOutputs(
        {
            user_app_id: {
                "user_id": "clarifai",
                "app_id": "main"
            },
            model_id: "food-item-recognition",
            // version_id: "1d5fd481e0cf4826aa72ec3ff049e044",  // This is optional. Defaults to the latest model version
            inputs: [
                { data: { image: { url: IMAGE_URL } } }
            ]
        },
        metadata,
        (err, response) => {
            if (err) {
                throw new Error(err);
            }

            if (response.status.code !== 10000) {
                throw new Error("Post model outputs failed, status: " + response.status.description);
            }

            // Since we have one input, one output will exist here.
            const output = response.outputs[0];

            console.log("Predicted concepts:");
            for (const concept of output.data.concepts) {
                console.log(concept.name + " " + concept.value);
            }
        }
    );

    app.use("/api/clarifai", router);
}
