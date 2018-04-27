const aws = require("aws-sdk");
const uuid = require('uuid');

const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: null
};

const dynamoClient = new aws.DynamoDB.DocumentClient();

const createCar = async (request) => {
    params.Item = {
            id: uuid.v1(),
            make: request.make,
            model: request.model,
            released: request.released                
        };
    
    return new Promise((resolve, reject) => {
        dynamoClient.put(params, (error) => {
            if (error) {
                let response = {
                    statusCode: error.statusCode || 501,
                    headers: { 
                        "Content-Type": "application/json"
                    },
                    body: {
                        "error": error.message
                    }
                };
                reject(response);
            } else {
                let response = {
                    statusCode: 201,
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(params.Item)
                };
                resolve(response);
            }
        });
    });
};

exports.handler = async (event, context, callback) => {
    try {
        let request = event.body;
        
        let response = await createCar(request);
        
        callback(null, response);
    } catch (error) {
        callback(error);
    }   
};