var express = require('express');
var router = express.Router();
var template = require('../lib/template.js');
const {getClient} = require('../controller/mongodb')
const shortid = require('shortid');
const {upload} = require("../controller/upload");


// router.get('/', function (request, response) {
//     var feedback = '';
//     var title = 'Welcome';
//     var description = 'Hello, Node.js';
//     var html = template.html(title,
//         `
//       <div style="color:green">${feedback}</div>
//       <h2>${title}</h2>${description}
//       `,
//         ``
//     );
//     response.send(html);
// });

router.get('/', function (req, res) {
    res.status(200)
});

async function addStore(id, title, tags, address, site, instaUrl, operatorTime, phone, latitude, longitude, image, info, callback) {

    try {
        const client = await getClient()
        const db = client.db("finyl"); // database
        const stores = db.collection('store'); // collection

        const storeData = stores.insertMany([{
            id: id,
            title: title,
            tags: tags,
            address: address,
            site: site,
            operatorTime: operatorTime,
            phone: Number(phone),
            latitude: Number(latitude),
            longitude: Number(longitude),
            image: image,
            info: info
        }]);
        console.log(`데이터 저장 성공.\n`);
        return callback(null, storeData)
    } catch (err) {
        console.error(`데이터 저장 실패 ${err}\n`);
        return callback(err, null)
    }

}



router.post('/adminCreate', function (req, res) {

    const body = req.body
    const id = shortid.generate()
    const title = req.body.title
    const tags = req.body.tags
    const address = req.body.address
    const site = req.body.site
    const instaUrl = req.body.instaUrl
    const operatorTime = req.body.operatorTime
    const phone = req.body.phone
    const latitude = req.body.latitude
    const longitude = req.body.longitude
    const image = req.body.image
    const info = req.body.info

    if (getClient) {
        addStore(id, title, tags, address, site, instaUrl, operatorTime, phone, latitude, longitude, image, info, (err, result) => {
            if (err) {
                console.log('가게정보 저장 실패');
                res.send(err);
            } else if (result) {
                console.log('가게 정보 저장 성공');
                res.send(result)
            }
        });
    } else {
        console.log('데이터베이스 연결 안됨.');
    }
});


async function updateStore(id, title, tags, address, site, instaUrl, operatorTime, phone, latitude, longitude, image, info, callback) {
    try {
        const client = await getClient()
        const db = client.db("finyl"); // database
        const stores = db.collection('store'); // collection

        const filter = {id: id};

        const updateDoc = {
            $set: {
                title: title,
                tags: tags,
                address: address,
                site: site,
                instaUrl: instaUrl,
                operatorTime: operatorTime,
                phone: Number(phone),
                latitude: Number(latitude),
                longitude: Number(longitude),
                image: image,
                info: info
            }
        };

            const updateResult = stores.findOneAndUpdate(
                filter,
                updateDoc
            );
            console.log(updateResult)
            console.log(`데이터 업데이트 성공.\n`);
            return callback(null, updateResult);
        } catch (err) {
        console.error(`데이터 업데이트 실패 ${err}\n`);
        return callback(err, null);
    }
}

router.post('/adminUpdate', function (req, res) {
    const body = req.body;
    console.log(req.body)
    const id = req.body.id; // 기존 데이터의 ID를 받아옵니다.

    // 나머지 데이터는 기존 데이터를 업데이트할 때 사용할 새로운 값들입니다.
    const title = req.body.title;
    const tags = req.body.tags;
    const address = req.body.address;
    const site = req.body.site;
    const instaUrl = req.body.instaUrl;
    const operatorTime = req.body.operatorTime;
    const phone = req.body.phone;
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;
    const image = req.body.image;
    const info = req.body.info;

    if (getClient) {
        updateStore(id, title, tags, address, site, instaUrl, operatorTime, phone, latitude, longitude, image, info, (err, result) => {
            if (err) {
                console.log('가게정보 업데이트 실패');
                res.send(err);
            } else if (result) {
                console.log('가게 정보 업데이트 성공');
                res.send(result);
            }
        });
    } else {
        console.log('데이터베이스 연결 안됨.');
    }
});


async function deleteData(id, callback) {

    const client = await getClient()
    const db = client.db("finyl"); // database
    const stores = db.collection('store'); // collection

    const deleteDoc = { id:id };

    try {
        const deleteManyResult = await stores.deleteMany(deleteDoc);
        console.log("Delete OK :", deleteManyResult)
        return callback(null, deleteManyResult)
    } catch (err) {
        console.log("Delete Failed", err)
        return callback(err, null)
    }
}


/* /drop post */
router.post('/adminDelete', (req, res) => {

    console.log('회원탈퇴할 ID : ' + id , "Get Delete Process");

    var body = req.body;
    var id = body.id;

    if (getClient) {
        deleteData(id, (err, result) => {
            if (err) {
                console.log('가게 정보 삭제 실패');
                res.send(err);
            } else if (result) {
                console.log('가게 정보 삭제 성공');
                res.send(result);
            }
        });
    } else {
        console.log('데이터베이스 연결 안됨.');
    }
})


async function StoreEntireInfoQuery(callback) {
    try {
        const client = await getClient()
        const db = client.db("finyl"); // database
        const stores = await db.collection('store'); // collection
        const results = await stores
            .find({}).toArray()
        return callback(null, results, client);
    } catch (err) {
        console.log(err);
        return callback(err, null);
    }
}




// 요청 시 ID 기준으로 위도 경도 ID 값 전달
router.get('/adminStoreEntireInfo', function (req, res) {


    if (getClient) {
        StoreEntireInfoQuery((err, result) => {
            if (err) {
                console.log('가게 전체 정보 조회 실패');
                res.send(err);
            } else if (result) {
                console.log('가게 전체 정보 조회 성공');
                res.send(result)
            }
        });
    } else {
        console.log('데이터베이스 연결 안됨.');
    }
});


async function ImageUploader(callback) {
    try {
        const client = await getClient()
        const db = client.db("finyl"); // database
        const stores = await db.collection('store'); // collection
        const results = await stores
            .find({}).toArray()
        return callback(null, results, client);
    } catch (err) {
        console.log(err);
        return callback(err, null);
    }
}

// 요청 시 ID 기준으로 위도 경도 ID 값 전달
router.post('/imageUpload', function (req, res) {
    try {
        if (req.file) {
            console.log("File found, trying to upload...");
            const publicUrl = upload()
            res.status(200).send(publicUrl);
        } else throw "error with img";
    } catch (err) {
        res.status(500).send(err);
    }
});






module.exports = router;