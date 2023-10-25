const { uploadImage } = require("../Services/upload.service");

exports.uploadImageController = async (req, res, next) => {
  try {
    const response = await uploadImage(req);
    return res.status(response.code).send(response);
  } catch (error) {
    console.error(error.message);
    return res.status(400).send(error.message);
  }
};
