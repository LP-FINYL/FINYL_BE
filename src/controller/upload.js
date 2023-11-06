const { format } = require("util");
const { Storage } = require("@google-cloud/storage");
const util = require("util");
const Multer = require("multer");
const maxSize = 10 * 1024 * 1024;
// Instantiate a storage client with credentials
const storage = new Storage({ keyFilename: "./controller/config/GoogleStorageKey.json" });
const bucket = storage.bucket("finyl");

let processFile = Multer({
    storage: Multer.memoryStorage(),
    limits: { fileSize: maxSize },
}).single("file");

let processFileMiddleware = util.promisify(processFile);

bucket.upload(
    `./controller/file.jpg`,
    {
        destination: `finyl/file-upload.jpeg`,
    },
    function (err, file) {
        if (err) {
            console.error(`Error uploading image file.jpg: ${err}`)
        } else {
            console.log(`Image image_to_upload.jpeg uploaded to ${bucket}.`)

            // Making file public to the internet
            file.makePublic(async function (err) {
                if (err) {
                    console.error(`Error making file public: ${err}`)
                } else {
                    console.log(`File ${file.name} is now public.`)
                    const publicUrl = file.publicUrl()
                    console.log(`Public URL for ${file.name}: ${publicUrl}`)
                    return publicUrl
                }
            })

        }
    }
)

module.exports = {
    processFileMiddleware,
    // getListFiles,
    // download,
};