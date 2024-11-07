// var cloudinary = require("cloudinary").v2;
import { v2 } from 'cloudinary';

// const cloud_name = process.env.CLOUD_NAME;
// const api_key = process.env.API_KEY;
// const api_secret = process.env.API_SECRET;

v2.config({
  cloud_name: 'dkrts2wv9',
  api_key: '346566731948151',
  api_secret: 't8XdHOHzH0hd63k9w503NPHlClk',
});

export const uploadImage = (image: any) => {
  //imgage = > base64
  return new Promise((resolve, reject) => {
    v2.uploader.upload(
      image,
      {
        overwrite: true,
        invalidate: true,
        resource_type: 'auto',
      },
      (error, result) => {
        if (result && result.secure_url) {
          console.log(result.secure_url);
          return resolve(result.secure_url);
        }
        console.log(error.message);
        return reject({ message: error.message });
      },
    );
  });
};

// export const imager = (image: any) => {
//   //imgage = > base64
//   return new Promise((resolve, reject) => {
//     v2.uploader.upload(
//       image,
//       {
//         overwrite: true,
//         invalidate: true,
//         resource_type: 'auto',
//       },
//       (error, result) => {
//         if (result && result.secure_url) {
//           console.log(result.secure_url);
//           return resolve(result.secure_url);
//         }
//         console.log(error.message);
//         return reject({ message: error.message });
//       },
//     );
//   });
// };

export const uploadMultipleImages = (images: any[]) => {
  return new Promise((resolve, reject) => {
    const uploads = images.map((base: any) => uploadImage(base));
    Promise.all(uploads)
      .then((values) => resolve(values))
      .catch((err) => reject(err));
  });
};
