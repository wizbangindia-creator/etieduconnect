# Auth Testing Playbook — ETI EduConnect

## Admin credentials
- Email: connect@etieduconnect.com
- Password: EduConnect@2026
- Role: admin

## Step 1: MongoDB Verification
```
mongosh
use test_database
db.users.find({role: "admin"}).pretty()
```
Verify bcrypt hash starts with `$2b$`, unique index on users.email.

## Step 2: API Testing (Bearer token flow)
```
curl -X POST http://localhost:8001/api/auth/login -H "Content-Type: application/json" -d '{"email":"connect@etieduconnect.com","password":"EduConnect@2026"}'
# returns { access_token, user }
TOKEN=... 
curl http://localhost:8001/api/auth/me -H "Authorization: Bearer $TOKEN"
```
Login returns user + access_token and also sets httpOnly cookies. /me works via Bearer header or cookie.
