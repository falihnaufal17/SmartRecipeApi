const IMAGE_URL = "https://akcdn.detik.net.id/visual/2015/01/07/415e39c5-1927-42b5-ae6e-6134e4aa074e_169.jpg?w=650";
const { default: axios } = require("axios");
const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");

exports.detector = (req, res) => {
  // // URL of image to use. Change this to your image.

  const stub = ClarifaiStub.grpc();

  // // This will be used by every Clarifai endpoint call
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

      axios.get(`https://api.spoonacular.com/recipes/complexSearch?apiKey=3798ef43760f4a10982037daf9a35c40&query=${output.data.concepts[0].name}`)
        .then((spoonacularResponse) => {
          const data = spoonacularResponse.data.results;
          console.log("response Spoon", spoonacularResponse.data)
          return res.status(200).send({
            message: 'Image food detected',
            data
          })
        }).catch(spoonacularResponseErr => {
          return res.status(500).send({
            message: spoonacularResponseErr.response.data,
            data: []
          })
        })
    }
  );
}