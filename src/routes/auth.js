var express = require('express');
var router = express.Router();
const {getClient} = require('../controller/mongodb')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const secret = require('../controller/config/config')
const secretKey = secret.secret

// 회원가입 라우트
router.post('/register', async (req, res) => {
    const { id, password } = req.body;

    try {
        if (!id) {
            console.log("아이디 미입력")
            return res.json({ success: false, message: '아이디를 입력해주세요.' });
        }

        if (!password) {
            console.log("패스워드 미입력")
            return res.json({ success: false, message: '패스워드를 입력해주세요.' });
        }

        // MongoDB에서 유저 정보 찾기
        const client = await getClient()
        const db = client.db('finyl');
        const accounts = db.collection('account');
        const existingUser = await accounts.findOne({ id: id });

        if (existingUser) {
            // 중복 아이디가 이미 존재하는 경우
            console.log("중복 아이디")
            return res.json({ success: false, message: '이미 존재하는 아이디입니다.' });
        }

        // 패스워드 해싱
        const hashedPassword = await bcrypt.hash(password, 10);

        // MongoDB에 유저 정보 저장
        await accounts.insertOne({ id, password: hashedPassword });

        console.log("회원가입 성공")
        res.json({ success: true, message: '회원가입 성공!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: '서버 오류입니다.' });
    }
});


// 로그인 라우트
router.post('/login', async (req, res) => {
    const { id, password } = req.body;

    try {
        const client = await getClient()
        const db = client.db('finyl'); // 여기에 실제 데이터베이스 이름을 넣어주세요
        const accounts = db.collection('account');

        const user = await accounts.findOne({ id });

        if (user) {
            // 패스워드 비교
            const isPasswordValid = await bcrypt.compare(password, user.password);
            const payload = { id: user.id,  scope: "admin" };

            if (isPasswordValid) {
                // JWT 토큰 생성
                const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
                console.log("로그인 성공")
                res.json({ success: true, message: '로그인 성공!', token : token});
            } else {
                console.log("유저 정보가 일치하지 않습니다")
                res.json({ success: false, message: '유저 정보가 일치하지 않습니다.' });
            }
        } else {
            console.log("유저 정보가 일치하지 않습니다")
            res.json({ success: false, message: '유저 정보가 일치하지 않습니다.' });
        }
    } catch (error) {
        console.error('로그인 중 에러 발생:', error);
        res.status(500).json({ success: false, message: '서버 오류입니다.' });
    }
});

// 로그아웃 라우트
router.post('/logout', (req, res) => {
    res.json({ success: true, message: '로그아웃 성공' });
});




module.exports = router;
