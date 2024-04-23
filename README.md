## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
## API Documentation

Explore the API using our Postman collection: [BlindMatch API](https://blindmatch-team.postman.co/workspace/BlindMatch-Team-Workspace~57110133-c2b7-4dd3-8e08-e25da7532097/collection/31110816-ebe3adf4-9e76-4cda-b410-34b473e92b9e?action=share&creator=31110816).

### Endpoints

# Posts

#### Get Post by ID
```bash
GET /posts/:id
```

#### Add New Post
```bash
POST /post
```

#### Update Post
```bash
PATCH /posts/:id
```
# Users
#### Create User
```bash
POST /users
```

#### Get All Users
```bash
GET /users
```

#### Get User by ID
```bash
GET /users/:id
```

#### Update User
```bash
PATCH /users/:id
```

#### User Login
```bash
POST /auth/login
```
# Interests
#### Find Specific Interest
```bash
GET /interest/:id
```

#### List All Interests
```bash
GET /interest/
```

#### Create Interest
```bash
POST /interest
```

#### Update Interest
```bash
PATCH /interest/:id
```

#### Delete Interest
```bash
DELETE /interest/:id
```


## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Hobby/Interest Dataset
https://www.kaggle.com/datasets/muhadel/hobbies
