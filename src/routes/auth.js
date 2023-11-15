var express = require('express');
var router = express.Router();
const {getClient} = require('../controller/mongodb')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const secret = require('../controller/config/config')
const secretKey = secret.secret

// 회원가입 라우트
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        // 패스워드 해싱
        const hashedPassword = await bcrypt.hash(password, 10);

        // MongoDB에 유저 정보 저장
        const client = await getClient()
        const db = client.db('finyl'); // 여기에 실제 데이터베이스 이름을 넣어주세요
        const accounts = db.collection('account');
        await accounts.insertOne({ username, password: hashedPassword });
        const existingUser = await accounts.findOne({ username });

        if (existingUser) {
            // 중복 아이디가 이미 존재하는 경우
            return res.json({ success: false, message: '이미 존재하는 아이디입니다.' });
        }

        res.json({ success: true, message: '회원가입 성공!' });
    } catch (error) {
        res.status(500).json({ success: false, message: '서버 오류입니다.' });
    }
});

// 로그인 라우트
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const client = await getClient()
        const db = client.db('finyl'); // 여기에 실제 데이터베이스 이름을 넣어주세요
        const accounts = db.collection('account');

        const user = await accounts.findOne({ username });

        console.log(username)

        if (user) {
            // 패스워드 비교
            const isPasswordValid = await bcrypt.compare(password, user.password);
            const payload = { username: user.username,  scope: "admin" };

            if (isPasswordValid) {
                // JWT 토큰 생성
                const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
                res.json({ success: true, message: '로그인 성공!', token });
            } else {
                res.json({ success: false, message: '유저 정보가 일치하지 않습니다.' });
            }
        } else {
            res.json({ success: false, message: '유저 정보가 일치하지 않습니다.' });
        }
    } catch (error) {
        console.error('로그인 중 에러 발생:', error);
        res.status(500).json({ success: false, message: '서버 오류입니다.' });
    }
});

// 보호된 라우트 - JWT 검증
// router.get('/protected', async (req, res) => {
//     if (getClient) {
//         const token = req.headers.authorization;
//         await verifyToken(token, (err, result) => {
//             if (err) {
//                 console.log('토큰 검증 실패');
//                 res.send(err)
//             } else if (result) {
//                 console.log('토큰 검증 성공');
//                 res.send(result);
//             }
//         });
//     }
// });


module.exports = router;
