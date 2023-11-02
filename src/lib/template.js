const fs = require("fs");
module.exports = {
    html: function (title, body, control) {
        return `
  <!doctype html>
  <html>
  <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <a href="/api/v1/admin">가게추가하기</a> | <a href="/login">점주로그인</a>
    <h1><a href="/api/v1">WEB</a></h1>
    ${control}
    ${body}
  </body>
  </html>
  `;
    },
    admin: function () {
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Store</title>
</head>
<body>
    <style>
        form section {
          margin-top: 10px;
        }
        form button {
          margin-top: 10px;
        }
      </style>
    <h1>가게 정보 추가</h1>
       <form action="/api/v1/admin_process" method="post">
           <section>
               <label for="title">title</label>
               <input id="title" name="title" type="text" autocomplete="title" required autofocus>
           </section>
           <section>
               <label for="tags">tags</label>
               <input id="tags" name="tags" type="text" autocomplete="tags" required>
           </section>
           <section>
               <label for="address">address</label>
               <input id="address" name="address" type="text" autocomplete="address" required>
           </section>
           <section>
               <label for="site">site</label>
               <input id="site" name="site" type="text" autocomplete="site">
           </section>
           <section>
               <label for="instaUrl">instaUrl</label>
               <input id="instaUrl" name="instagram" type="text" autocomplete="instaUrl">
           </section>
           <section>
               <label for="operatorTime">operatorTime</label>
               <input id="operatorTime" name="operatorTime" type="text" autocomplete="operatorTime">
           </section>
           <section>
               <label for="phone">phone</label>
               <input id="phone" name="phone" type="text" autocomplete="phone">
           </section>
           <section>
               <label for="latitude">latitude</label>
               <input id="latitude" name="latitude" type="text" autocomplete="latitude" required>
           </section>
           <section>
               <label for="longitude">longitude</label>
               <input id="longitude" name="longitude" type="text" autocomplete="longitude" required>
           </section>
           <section>
               <label for="image">image</label>
               <input id="image" name="image" type="text" autocomplete="image">
           </section>
           <section>
               <label for="info">info</label>
               <input id="info" name="info" type="text" autocomplete="info">
           </section>
           <button type="submit">가게 추가</button>
    </form>
</body>
</html>
  `;
    },
    login: function () {
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <style>
        form section {
          margin-top: 10px;
        }
        form button {
          margin-top: 10px;
        }
      </style>
    <h1>Login</h1>
       <form action="/login_process" method="post">
           <section>
               <label for="id">ID</label>
               <input id="id" name="id" type="text" autocomplete="id" required autofocus>
           </section>
           <section>
               <label for="password">Password</label>
               <input id="password" name="password" type="password" autocomplete="password" required>
           </section>
           <button type="submit">Login</button>
    </form>
</body>
</html>`;
    },
    update: function (userData) {
        return `<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Document</title>
                </head>
                <body>
                    <h1>회원정보 수정</h1>
                    <form action="/update_process" method="post">
                        <div>
                            <label for="">ID</label>
                            <input type="text" name="id" value=${userData.id}>
                        </div>
                        <div>
                            <label for="">Name</label>
                            <input type="text" name="name" value=${userData.name}>
                        </div>
                        <div>
                            <label for="">Password</label>
                            <input type="password" name="password" value=${userData.password}>
                        </div>
                        <button>Submit</button>
                    </form>
                    <form action="/delete_process" method="post">
                        <input type="hidden" value=${userData.id} name="id">
                        <button>회원탈퇴</button>
                    </form>
                </body>
                </html>
                \``;
    }
}