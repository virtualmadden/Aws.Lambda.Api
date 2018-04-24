const aws = require("aws-sdk");
const uuid = require('uuid');

const dynamoClient = new aws.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
    try {
        let request = JSON.parse(event.body);
    
        const params = {
            TableName: process.env.DYNAMODB_TABLE,
            Item: {
                id: uuid.v1(),
                make: request.make,
                model: request.model,
                released: request.released                
            }
        };

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
                
                callback(null, response);
            } else {
                let response = {
                    statusCode: 201,
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(params.Item)
                };
                
                callback(null, response);
            }
        });
    } catch (error) {
        callback(error);
    }   
};