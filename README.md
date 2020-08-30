## Video server

In this api you will be able to create, update, delete users, and deal with rooms.

### How to run

```
docker-compose build
docker-compose up
```

You will find database in port **27017**

The serve in in **http://localhost:3000**

### Authentication

In some routes you will need to authenticate via Bearer Token. In order to get this token, you have to register user and login the user in the routes bellow.

**POST - users/register**

  ```json
  {
    "username": "victoriaovilas",
    "password": "pass",
    "mobile_token": "optional"
  }
  ```
  
 **POST - /login**

  ```json
  {
    "username": "victoriaovilas",
    "password": "pass",
  }
  ```
  
  The response should be a token like this: 
  ```
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InZpY3RvcmlhdmlsYXM0IiwiaWF0IjoxNTk4Nzg2OTEwfQ.Jw8OgBX66efRkP0mzSBawgvto-JgyCdSfBCIvjlUEbE
  ```

The routes that need authorization are: 
- **PATCH users/:username/update**
- **DELETE users/:username/delete**
- **PATCH users/:username/join/:guid**
- **PATCH users/:username/leave/:guid**


### Routes

**GET - users/:username**

Get a specific user.

  
**GET - users/**

Return all users in database.

**PATCH - users/:username/update**

Update informations from user, as a password.

```json
{
  "password": "newpass"
}
```

**DELETE - users/:username**

Delete a specific user.

**PATCH - users/:username/join/:guid**

Join a specific room

**PATCH - users/:username/leave/:guid**

Leave a specific room

**PATCH - users/:username/rooms**

Search users in a room

**POST - rooms/**

Create a room

```json
{
	"capacity": 5,
	"name": "Os",
	"guid": "43242",
	"host_user": "victoria",
	"participants": [
		"victoria",
    "pedro"
	]
}	
```

**PATCH - rooms/:guid/updateHost**

Change host_user.

```json
{
	"host_user": "pedro",
}	
```

**GET - rooms/:guid**

Find a specific room


  
