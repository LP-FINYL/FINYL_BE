var express = require('express');
var router = express.Router();
var template = require('../lib/template.js');
const {getClient} = require('../controller/mongodb')
const shortid = require('shortid');

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
    res.status(200).send('OK')
});


// async function locationQuery(keyword, callback) {
//     try {
//         if (keyword) {
//             const client = await getClient()
//             const db = client.db("finyl"); // database
//             const stores = db.collection('store'); // collection
//             const coordinates = {id: 1, latitude: 1, longitude: 1};
//             const results = await stores
//                 .find({title: {$regex: new RegExp(keyword, "i")}})
//                 .project(coordinates)
//                 .toArray();
//             return callback(null, results);
//         } else {
//             const client = await getClient()
//             const db = client.db("finyl"); // database
//             const stores = db.collection('store'); // collection
//             const coordinates = {id: 1, latitude: 1, longitude: 1};
//             const results = await stores
//                 .find()
//                 .project(coordinates)
//                 .toArray();
//             return callback(null, results);
//         }
//
//     } catch (err) {
//         console.log(err);
//         return callback(err, null);
//     }
// }
//
//
// // 요청 시 위도 경도 ID 값 전달
// router.get('/location', function (req, res) {
//
//
//     if (getClient) {
//         const keyword = req.query.keyword
//         locationQuery(keyword, (err, result) => {
//             if (err) {
//                 console.log('가게 위치 조회 실패');
//                 res.send(err);
//             } else if (result) {
//                 console.log('가게 위치 조회 성공');
//                 res.status(200).send(result)
//             }
//         });
//     } else {
//         console.log('데이터베이스 연결 안됨.');
//     }
// });


async function storeInfoQuery(id, callback) {
    try {

        const client = await getClient()
        const db = client.db("finyl"); // database
        const stores = db.collection('store'); // collection

        const result = await stores.findOne({id: id});

        if (result) {
            // Convert the result object to contain only the desired properties
            const resultObject = {
                id: result.id,
                title: result.title,
                tags: result.tags,
                address: result.address,
                site: result.site,
                instaUrl: result.instaUrl,
                operatorTime: result.operatorTime,
                phone: result.phone,
                latitude: result.latitude,
                longitude: result.longitude,
                image: result.image,
                info: result.info
            };

            callback(null, resultObject);
        } else {
            callback("Store not found", null);
        }
    } catch (err) {
        console.error(err);
        callback(err, null);
    }
}


router.get('/storeInfo', function (req, res) {

    const id = req.query.id

    if (getClient) {
        storeInfoQuery(id, (err, result) => {
            if (err) {
                console.log('가게 전체 데이터 조회 실패');
                res.send(err);
            } else if (result !== null) {
                console.log('가게 전체 데이터 조회 성공');
                res.status(200).send(result)
            }
        });
    } else {
        console.log('데이터베이스 연결 안됨.');
    }
});


async function searchQuery(keyword, address, tags, callback) {
    try {
        const client = await getClient()
        const db = client.db("finyl"); // database
        const stores = db.collection('store'); // collection
        const coordinates = {id: 1, latitude: 1, longitude: 1, title: 1, image: 1, tags: 1, address: 1};

        const results = await stores
            .find({
                $and: [
                    { title: { $regex: new RegExp(keyword, "i") } },
                    { address: { $regex: new RegExp(address, "i") } },
                    { tags: { $regex: new RegExp(tags, "i") } },
                    {
                        $and: [
                            { title: { $regex: new RegExp(keyword, "i") } },
                            { address: { $regex: new RegExp(address, "i") } },
                        ],
                    },
                ],
            })
            .project(coordinates)
            .toArray();

        callback(null, results)


    } catch (err) {
        console.log(err);
        return callback(err, null);
    }
}

router.get('/search', function (req, res) {


    if (getClient) {
        const keyword = req.query.keyword
        const address = req.query.address
        const tags = req.query.tags
        searchQuery(keyword, address, tags, (err, result) => {
            if (err) {
                console.log('가게 위치 검색 실패');
                res.send(err);
            } else if (result) {
                console.log('가게 위치 검색 성공');
                res.status(200).send(result)
            }
        });
    } else {
        console.log('데이터베이스 연결 안됨.');
    }
});


async function locationDirectionsQuery(SWlatitude, SWlongitude, NElatitude, NElongitude, callback) {
    try {
        const client = await getClient();
        const db = client.db("finyl"); // 데이터베이스
        const stores = db.collection('store'); // 컬렉션
        /*
        longitude = 경도 = 가로
        latitude = 위도 = 세로
        * */

        const coordinates = {id: 1, title: 1, latitude: 1, longitude: 1, info: 1, tags: 1, image: 1};

        const result = await stores.find({
            latitude: {$gte: parseFloat(SWlatitude), $lte: parseFloat(NElatitude)},
            longitude: {$gte: parseFloat(SWlongitude), $lte: parseFloat(NElongitude)},
        }).project(coordinates).toArray();

        return callback(null, result);
    } catch (err) {
        console.log(err);
        return callback(err, null);
    }
}


router.get('/locationDirections', function (req, res) {


    if (getClient) {
        const {SWlatitude, SWlongitude, NElatitude, NElongitude} = req.query;

        const parsedNElatitude = Number(NElatitude);
        const parsedNElongitude = Number(NElongitude);
        const parsedSWlatitude = Number(SWlatitude);
        const parsedSWlongitude = Number(SWlongitude);

        locationDirectionsQuery(parsedSWlatitude, parsedSWlongitude, parsedNElatitude, parsedNElongitude, (err, result) => {
            if (err) {
                console.log('가게 위치 조회 실패');
                res.send(err);
            } else if (result) {
                console.log('가게 위치 조회 성공');
                res.status(200).send(result)
            }
        });
    } else {
        console.log('데이터베이스 연결 안됨.');
    }
});


module.exports = router;