// var express = require('express');
// var router = express.Router();
// var template = require('../lib/template.js');
// var session = require('express-session');
// const {client, connectDB} = require('../controller/mongodb')
// const db = client.db("test123"); // database
// const users = db.collection('users'); // collection
//
//
// router.get('/', function (request, response) {
//     var feedback = '';
//     var title = 'Welcome';
//     var description = 'Hello, Node.js';
//     var html = template.html(title,
//         `
//       <div style="color:green">${feedback}</div>
//       <h2>${title}</h2>${description}
//       `,
//         `<a href="/create">create</a>`
//     );
//     response.send(html);
// });
//
//
// async function addUser(id, name, password, callback) {
//     try {
//         const usersData = await users.insertMany([{
//             id: id, name: name, password: password
//         }]);
//         console.log(`${usersData.insertedCount} documents successfully inserted.\n`);
//         return callback(null, 'success')
//     } catch (err) {
//         console.error(`Something went wrong trying to insert the new documents: ${err}\n`);
//         return callback(null, null)
//     }
//
// }
//
// router.get('/signup', function (request, response) {
//     var signup = template.signup()
//     response.send(signup);
// });
//
// router.post('/signup_process', (request, response) => {
//
//     var body = request.body;
//     var id = body.id;
//     var name = body.name;
//     var password = body.password;
//
//     if (connectDB) {
//         addUser(id, name, password, (err, result) => {
//             if (err) {
//                 console.log('회원가입 중 오류 발생');
//                 response.send('<h1>회원가입 중 오류 발생</h1>');
//             } else if (result) {
//                 console.log('회원가입 성공');
//                 response.redirect('/');
//             }
//         });
//     } else {
//         console.log('데이터베이스 연결 안됨.');
//         response.send('<h1>Database unconnected</h1>');
//     }
// });
//
//
// async function authUser(id, password, callback) {
//
//     const findUserQuery = {
//         id: id,
//         password: password
//     };
//
//     try {
//         const findOneResult = await users.findOne(findUserQuery);
//         if (findOneResult === null) {
//             console.log("일치하는 데이터 찾지 못함\n");
//             return callback(null, null)
//         } else if (findOneResult.id === id && findOneResult.password === password) {
//             console.log(`일치하는 데이터 발견`);
//             return callback(null, 'success')
//         }
//     } catch (err) {
//         console.error(`데이터베이스 검색 중 오류 발생: ${err}\n`);
//         return callback(null, err)
//     }
// }
//
//
// router.get('/login', function (request, response) {
//     var login = template.login()
//     response.send(login);
// });
//
// router.post('/login_process', (request, response) => {
//     console.log('# POST /login');
//
//     var body = request.body;
//     var id = body.id;
//     var password = body.password;
//
//     console.log(id, password);
//
//     if (connectDB) {
//         authUser(id, password, (err, docs) => {
//             if (err) {
//                 console.log('에러발생');
//                 response.end();
//             }
//
//             if (docs) {
//                 console.log(docs);
//                 console.log('로그인 성공');
//                 request.session.user = {
//                     id: id,
//                     authoirze: true
//                 }
//
//                 response.redirect('/');
//             } else {
//                 console.log('로그인 실패');
//                 response.redirect('/login');
//             }
//         });
//     }
//
//
// });
//
// /* ID로 데이터 받아오는 함수 */
// async function getUser(id, callback) {
//
//     console.log('Get user()');
//
//     const findQuery = {
//         id: id
//     }
//
//     try {
//         const userData = await users.findOne(findQuery);
//         return callback(null, userData);
//     } catch (err) {
//         console.error(`Something went wrong trying to find the documents: ${err}\n`);
//         return callback(err, null)
//     }
//
// }
//
// /* Update 함수 */
// async function updateUser(id, name, password) {
//
//     const filter = { id : id }
//
//     const updateDoc = { $set: { id:id, name: name, password: password } };
//
//     try {
//         const updateResult = users.findOneAndUpdate(
//             filter,
//             updateDoc
//         );
//     } catch (err) {
//         console.error(`Something went wrong trying to update one document: ${err}\n`);
//     }
// }
//
//
// /* modify Routing */
// router.get('/update', (request, response) => {
//     console.log('# GET /update');
//
//     var id = request.session.user.id;
//
//     if (id) {
//         console.log('로그인 된 ID : ' + id);
//
//         getUser(id, (err, userData) => {
//             if (err) {
//                 console.log('데이터 검색 중 오류 발생');
//                 return;
//             }
//             if (userData) {
//                 var update = template.update(userData)
//                 response.send(update);
//                 response.end();
//             }
//         });
//     } else {
//         response.send('<h1>로그인이 되어있지 않습니다.</h1><a href="/login">로그인</a>');
//     }
// });
//
//
// router.post('/update_process', (request, response) => {
//
//     console.log('# POST /update_process');
//
//     var body = request.body;
//     var name = body.name;
//     var id = body.id;
//     var password = body.password;
//
//     if (connectDB) {
//         console.log('회원 정보 수정');
//         updateUser(id, name, password);
//         response.redirect('/')
//     }
// });
//
// async function deleteUser(id, callback) {
//
//     const deleteDoc = { id:id };
//
//
//
//     try {
//         const deleteManyResult = await users.deleteMany(deleteDoc);
//         console.log("Delete OK :", deleteManyResult)
//     } catch (err) {
//         console.log("Delete Failed", err)
//     }
// }
//
//
// /* /drop post */
// router.post('/delete_process', (request, response) => {
//
//     console.log('회원탈퇴할 ID : ' + id , "Get Delete Process");
//
//     var body = request.body;
//     var id = body.id;
//
//     if (connectDB) {
//         console.log('회원 정보 삭제');
//         deleteUser(id);
//         response.redirect('/')
//     }
// })
//
//
//
// module.exports = router;