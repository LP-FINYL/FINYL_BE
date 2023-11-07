
const format = require('util').format;

// Process the file upload and upload to Google Cloud Storage.
function upload(file) {

}

module.exports = upload




// const {format} = require("util");
// const {Storage} = require("@google-cloud/storage");
// // Instantiate a storage client with credentials
// const storage = new Storage({keyFilename: "./controller/config/GoogleStorageKey.json"});
// const bucket = storage.bucket("finyl");
// const util = require("util");
// const Multer = require("multer");
// const maxSize = 10 * 1024 * 1024;
// let processFile = Multer({
//     storage: Multer.memoryStorage(),
//     limits: { fileSize: maxSize },
// }).single("file");
//
// let processFileMiddleware = util.promisify(processFile);
// module.exports = processFileMiddleware;
//
// function uuidv4() {
//     return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
//         (
//             c ^
//             (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
//         ).toString(16)
//     );
// }
//
// // async function upload(file){
// //     try {
// //         const uploadFile = file
// //         // Create a new blob in the bucket and upload the file data.
// //         const blob = bucket.file(uploadFile.originalname);
// //         const blobStream = blob.createWriteStream({
// //             resumable: false,
// //         });
// //
// //         blobStream.on("error", (err) => {
// //             return err.message
// //         });
// //
// //         blobStream.on("finish", async (data) => {
// //             // Create URL for directly file access via HTTP.
// //             const publicUrl = format(
// //                 `https://storage.googleapis.com/${bucket.name}/${blob.name}`
// //             );
// //
// //             try {
// //                 // Make the file public
// //                 await bucket.file(uploadFile.originalname).makePublic();
// //             } catch {
// //                 return publicUrl
// //             }
// //
// //             return publicUrl
// //         });
// //
// //         blobStream.end(uploadFile.buffer);
// //     } catch (err) {
// //         return err
// //     }
// // }
// //
// // module.exports = upload
//
// function upload(file) {
//
//     const postid = uuidv4();
//
//     // Perform the file upload
//     bucket.upload(file, {
//         destination: `finyl/${postid}.jpeg`,
//     }, function (err, uploadedFile) {
//         if (err) {
//             console.error(`Error uploading file: ${err}`);
//         } else {
//             console.log(`Store Image uploaded to ${bucket.name}.`);
//
//             // Making the file public to the internet
//             uploadedFile.makePublic(function (err) {
//                 if (err) {
//                     console.error(`Error making file public: ${err}`);
//                 } else {
//                     console.log(`File ${uploadedFile.name} is now public.`);
//                     const publicUrl = uploadedFile.publicUrl();
//                     // You can use the publicUrl here or return it as needed.
//                     console.log(`Public URL: ${publicUrl}`);
//                 }
//             });
//         }
//     });
// }
//
// module.exports = {
//     upload
//     // download,
// }