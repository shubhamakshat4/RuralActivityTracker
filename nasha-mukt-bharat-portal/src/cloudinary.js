import axios from "axios";

const CLOUD_NAME = "dqpl9p16k";
const UPLOAD_PRESET = "uypbxldy";



export const uploadImage = async (file, onProgress) => {

  if (file.size > 50 * 1024 * 1024)
    throw new Error("Image exceeds 50MB");

  const formData = new FormData();

  formData.append("file", file);

  formData.append("upload_preset", UPLOAD_PRESET);

  formData.append("folder", "nasha_mukt/photos");

  formData.append("quality", "auto");

  formData.append("fetch_format", "auto");



  const res = await axios.post(

    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,

    formData,

    {

      onUploadProgress: (e) => {

        const percent = Math.round(
          (e.loaded * 100) / e.total
        );

        if (onProgress) onProgress(percent);

      }

    }

  );



  return res.data.secure_url;

};





export const uploadVideo = async (file, onProgress) => {

  if (file.size > 100 * 1024 * 1024)
    throw new Error("Video exceeds 100MB");



  const formData = new FormData();

  formData.append("file", file);

  formData.append("upload_preset", UPLOAD_PRESET);

  formData.append("folder", "nasha_mukt/videos");



  /* auto compression */

  formData.append("quality", "auto");



  const res = await axios.post(

    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`,

    formData,

    {

      onUploadProgress: (e) => {

        const percent = Math.round(
          (e.loaded * 100) / e.total
        );

        if (onProgress) onProgress(percent);

      }

    }

  );



  return res.data.secure_url;

};
