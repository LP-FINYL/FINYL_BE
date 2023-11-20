// // passport.js
// const { secret } = require("../controller/config/config");
// const LocalStrategy = require('passport-local').Strategy;
// const { getClient } = require("../controller/mongodb");
// var JwtStrategy = require('passport-jwt').Strategy,
//     ExtractJwt = require('passport-jwt').ExtractJwt;
// const passport = require('passport');
// const bcrypt = require("bcrypt");
//
// // JWT 설정 옵션
// var opts = {};
// opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

//
// passport.serializeUser(function(user, done) {
//     // 사용자 객체에서 식별자로 변환
//     done(null, user.id);
// });
//
// passport.deserializeUser(async function(id, done) {
//     try {
//         const client = await getClient();
//         const db = client.db('finyl');
//         const accounts = db.collection('account');
//
//         accounts.findOne({ id: id }, function(err, user) {
//             done(err, user);
//         });
//     } catch (err) {
//         console.error(err);
//         done(err, null);
//     }
// });
//
// // JWT 전략 설정
// // passport.use(new JwtStrategy(opts, async function(jwt_payload, done) {
// //     try {
// //         const client = await getClient();
// //         const db = client.db('finyl');
// //         const accounts = db.collection('account');
// //         const user = await accounts.findOne({ id: jwt_payload.id });
// //
// //         if (user) {
// //             return done(null, user);
// //         } else {
// //             return done(null, false);
// //             // 또는 새로운 계정을 생성할 수도 있음
// //         }
// //     } catch (err) {
// //         console.error(err);
// //         return done(err, false);
// //     }
// // }));
//
// passport.use(new LocalStrategy({
//     usernameField: 'id',
//     passwordField: 'password'
// }, async function (id, password, done) {
//     try {
//         const client = await getClient();
//         const db = client.db('finyl');
//         const accounts = db.collection('account');
//
//         const user = await accounts.findOne({ id });
//
//         if (!user) {
//             return done(null, false, { message: '유저 정보가 일치하지 않습니다.' });
//         }
//
//         const isPasswordValid = await bcrypt.compare(password, user.password);
//
//         if (!isPasswordValid) {
//             return done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
//         }
//
//         return done(null, user);
//     } catch (error) {
//         return done(error);
//     } finally {
//         const client = await getClient();
//         client.close()
//     }
// }));
//
// // 쿠키에서 JWT 추출
// var cookieExtractor = function(req) {
//     var token = null;
//     if (req && req.cookies) {
//         token = req.cookies['jwt'];
//     }
//     return token;
// };
//
// // JWT 추출 방법을 쿠키로 변경
// opts.jwtFromRequest = cookieExtractor;
//
// // 다른 파일에서 사용할 수 있도록 패스포트를 내보냄
// module.exports = passport;
