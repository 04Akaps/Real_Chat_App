Winston 및 Socket을 활용하여 소켓 통신을 만들어 채팅 웹을 만들어봄 계획입니다.

```
host = "http://localhost:5000";
loginRoute = `${host}/api/auth/login`;
registerRoute = `${host}/api/auth/register`;
logoutRoute = `${host}/api/auth/logout`;
allUsersRoute = `${host}/api/auth/allusers`;
sendMessageRoute = `${host}/api/messages/addmsg`;
recieveMessageRoute = `${host}/api/messages/getmsg`;
setAvatarRoute = `${host}/api/auth/setavatar`;
```

템플릿 정도는 무료로 가져왔으며 서버 구성을 목적에 두었기 떄문에 서버 작업을 위주로 진행하겠습니다.

- 문서 정리는 후에 하겠습니다.
