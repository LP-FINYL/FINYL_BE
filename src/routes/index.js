var express = require('express');
var router = express.Router();
var template = require('../lib/template.js');
const {getClient} = require('../controller/mongodb')
const shortid = require('shortid');
const {Kafka, Partitioners} = require('kafkajs')
const kafka = new Kafka({
    clientId: 'finyl',
    brokers: ['localhost:9092'],
    //brokers: ['finyl-kafka-controller-0.finyl-kafka-controller-headless:9092','finyl-kafka-controller-1.finyl-kafka-controller-headless:9092','finyl-kafka-controller-2.finyl-kafka-controller-headless:9092'],
    // sasl: {
    //     mechanism: 'plain',
    //     // username: process.env.kafka_username,
    //     // password: process.env.kafka_password,
    //     username: "finyl-admin",
    //     password: "finyl-password"
    // }
})


router.get('/', function (req, res) {
    res.status(200).send('OK')
});


// async function consumer(callback) {
//     const consumer = kafka.consumer({groupId: 'finyl-locaiton-group'});
//     await consumer.connect()
//     console.log('Connected to Kafka')
//
//     await consumer.subscribe({topic: 'finyl-location', fromBeginning: true});
//
//     await consumer.run({
//         eachMessage: async ({topic, partition, message}) => {
//             const messageString = message.value.toString();
//             const result = JSON.parse(messageString);
//             callback(null, messageString)
//         }
//     });
// }
//
// async function PushQuery(parsedNElatitude, parsedNElongitude, parsedSWlatitude, parsedSWlongitude, callback) {
//     try {
//
//         const producer = kafka.producer({createPartitioner: Partitioners.LegacyPartitioner})
//
//         var sendMessage = async () => {
//             await producer.connect()
//             await producer.send({
//                 topic: 'finyl-location',
//                 messages: [
//                     {
//                         value: JSON.stringify({
//                             parsedNElatitude: parsedNElatitude,
//                             parsedNElongitude: parsedNElongitude,
//                             parsedSWlatitude: parsedSWlatitude,
//                             parsedSWlongitude: parsedSWlongitude
//                         }),
//                     },
//                 ],
//             })
//
//             await producer.disconnect()
//             console.log('카프카 데이터 전송 후 연결 종료')
//         }
//
//         sendMessage();
//
//         await callback(null, 'ok')
//
//     } catch (err) {
//         console.error(err);
//         callback(err, null);
//     }
// }
//
// router.get('/events', async (req, res) => {
//     const {SWlatitude, SWlongitude, NElatitude, NElongitude} = req.query;
//     const parsedNElatitude = Number(NElatitude);
//     const parsedNElongitude = Number(NElongitude);
//     const parsedSWlatitude = Number(SWlatitude);
//     const parsedSWlongitude = Number(SWlongitude);
//
//     try {
//         // Push data to Kafka
//         await PushQuery(parsedNElatitude, parsedNElongitude, parsedSWlatitude, parsedSWlongitude, (err, result) => {
//             if (err) {
//                 console.log(err)
//             } else {
//                 console.log(result)
//             }
//         });
//     } catch (pushError) {
//         console.error('Kafka 데이터 전송 실패', pushError);
//         res.status(500).send(pushError.message);
//         return;
//     }
//
//     try {
//         // Consume data from Kafka
//         const result = await consumer((err, result) => {
//            if(err) {
//                console.log(err)
//                res.send(err)
//            }  else if (result) {
//                // Process the result and send the appropriate response
//                res.status(200).send(result);
//            }
//         });
//     } catch (consumeError) {
//         console.error('Kafka 데이터 컨슘 실패', consumeError);
//         res.status(500).send(consumeError.message);
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
                    {title: {$regex: new RegExp(keyword, "i")}},
                    {address: {$regex: new RegExp(address, "i")}},
                    {tags: {$regex: new RegExp(tags, "i")}},
                    {
                        $and: [
                            {title: {$regex: new RegExp(keyword, "i")}},
                            {address: {$regex: new RegExp(address, "i")}},
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


async function locationDirectionsQuery(SWlatitude, SWlongitude, NElatitude, NElongitude, tags, callback) {
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

        if (tags) {
            const coordinates = {id: 1, title: 1, latitude: 1, longitude: 1, info: 1, tags: 1, image: 1};

            const result = await stores.find({
                $and: [
                    {
                        latitude: { $gte: parseFloat(SWlatitude), $lte: parseFloat(NElatitude) },
                    },
                    {
                        longitude: { $gte: parseFloat(SWlongitude), $lte: parseFloat(NElongitude) },
                    },
                    {
                        tags: { $in: tags }
                    }
                ]
            }).project(coordinates).toArray();

            // const result = await stores.find({
            //     tags: { $in: tags }
            // }).project(coordinates).toArray()


            return callback(null, result);
        }

        return callback(null, result);
    } catch (err) {
        console.log(err);
        return callback(err, null);
    }
}


router.get('/locationDirections', function (req, res) {


    if (getClient) {
        const {SWlatitude, SWlongitude, NElatitude, NElongitude} = req.query;

        const tagsParam = req.query.tags;
        //
        const tags = req.query.tags ? req.query.tags.split(',') : [];

        const parsedNElatitude = Number(NElatitude);
        const parsedNElongitude = Number(NElongitude);
        const parsedSWlatitude = Number(SWlatitude);
        const parsedSWlongitude = Number(SWlongitude);

        locationDirectionsQuery(parsedSWlatitude, parsedSWlongitude, parsedNElatitude, parsedNElongitude, tags, (err, result) => {
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