const Cloud = require('@google-cloud/storage')
const { readNamespacedSecret } = require('../k8s');

const { Storage } = Cloud

const storage = new Storage({
    keyFilename: readNamespacedSecret,
    projectId: readNamespacedSecret.project_id,
})

const secret = process.env.secret