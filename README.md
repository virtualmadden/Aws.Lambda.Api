# Serverless CRUD Rest Api
A simple illustration of how to setup a RESTful Api using the Serverless infastructure.  This service allows you to perform CRUD operations on a car database featuring DynamoDB and AWS Lambdas.

## Lambdas
- create.js
    - Create a new car.
- list.js
    - List all cars.
- get.js
    - Get a specific car by id.
- update.js
    - Update a specific car by id.
- delete.js
    - Delete a specific car by id.

## Setup
```powershell
npm install -g serverless
```

## Deploy
```powershell
serverless deploy
```
```powershell
Serverless: Packaging service...
Serverless: Excluding development dependencies...
Serverless: Uploading CloudFormation file to S3...
Serverless: Uploading artifacts...
Serverless: Uploading service .zip file to S3 (3.98 KB)...
Serverless: Validating template...
Serverless: Updating Stack...
Serverless: Checking Stack update progress...
Serverless: Stack update finished...

Service Information
service: serverless-cars-api
stage: beta
region: us-west-2
stack: serverless-cars-api-beta
api keys:
  None
endpoints:
  POST - https://**********.execute-api.us-west-2.amazonaws.com/beta/cars
  GET - https://**********.execute-api.us-west-2.amazonaws.com/beta/cars
  GET - https://**********.execute-api.us-west-2.amazonaws.com/beta/cars/{id}
  PUT - https://**********.execute-api.us-west-2.amazonaws.com/beta/cars/{id}
  DELETE - https://**********.execute-api.us-west-2.amazonaws.com/beta/cars/{id}
functions:
  create: serverless-cars-api-beta-create
  list: serverless-cars-api-beta-list
  get: serverless-cars-api-beta-get
  update: serverless-cars-api-beta-update
  delete: serverless-cars-api-beta-delete
```

## Examples
### Create
```powershell
Invoke-RestMethod -Method "POST" -Uri "https://**********.execute-api.us-west-2.amazonaws.com/beta/cars" -Body '{"released": 1908, "model": "Model T", "make": "Ford"}'
```

```powershell
id                                   make model   released
--                                   ---- -----   --------
da58c6c0-475a-11e8-8bf2-5fdd6618ed83 Ford Model T     1908
```

### List
```powershell
Invoke-RestMethod -Uri "https://**********.execute-api.us-west-2.amazonaws.com/beta/cars"
```

```powershell
model   id                                   make released
-----   --                                   ---- --------
Model T da58c6c0-475a-11e8-8bf2-5fdd6618ed83 Ford     1908
```

### Get
```powershell
Invoke-RestMethod -Uri "https://**********.execute-api.us-west-2.amazonaws.com/beta/cars/da58c6c0-475a-11e8-8bf2-5fdd6618ed83"
```

```powershell
model   id                                   make released
-----   --                                   ---- --------
Model T da58c6c0-475a-11e8-8bf2-5fdd6618ed83 Ford     1908
```

### Update
```powershell
Invoke-RestMethod -Method "PUT" -Uri "https://**********.execute-api.us-west-2.amazonaws.com/beta/cars/da58c6c0-475a-11e8-8bf2-5fdd6618ed83" -Body '{"released": 2018, "model": "Mustang", "make": "Ford"}'
```

```powershell
model   id                                   make released
-----   --                                   ---- --------
Mustang da58c6c0-475a-11e8-8bf2-5fdd6618ed83 Ford     2018
```

### Delete
```powershell
Invoke-RestMethod -Method "DELETE" -Uri "https://**********.execute-api.us-west-2.amazonaws.com/beta/cars/da58c6c0-475a-11e8-8bf2-5fdd6618ed83"
```

```powershell

```