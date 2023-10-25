require("dotenv").config({ path: "../../.env" });
const apiReturns = require("../Helpers/apiReturns.helper");
const { initializeApp } = require("firebase/app");
const { firebaseConfig } = require("../Configs/firebase.config");
const {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} = require("firebase/storage");
const FIREBASEPROJECTID = process.env.FIREBASEPROJECTID;

initializeApp(firebaseConfig);

const storage = getStorage();

const uploadImage = async (rawData) => {
  try {
    const data = rawData.file;
    if (!data) {
      return apiReturns.validation("No files found");
    }
    const dateTime = new Date().toLocaleString("en-US", {
      timeZone: "Asia/ho_chi_minh",
    });
    const storageRef = ref(
      storage,
      `images/${data.originalname + "       " + dateTime}`
    );
    const metaData = {
      contentType: data.mimetype,
      cacheControl: "public, max-age=31536000",
    };
    // Upload the file in the bucket storage
    const snapshot = await uploadBytesResumable(
      storageRef,
      data.buffer,
      metaData
    );
    const downloadURL = await getDownloadURL(snapshot.ref);
    return apiReturns.success(200, "File successfully uploaded.", downloadURL);
  } catch (error) {
    console.log(error.message);
    return apiReturns.error(400, error.message);
  }
};

module.exports = { uploadImage };
