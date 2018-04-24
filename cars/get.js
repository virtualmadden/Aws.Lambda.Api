const aws = require("aws-sdk");

const dynamoClient = new aws.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
    try {
        const params = {
            TableName: process.env.DYNAMODB_TABLE,
            Key: {
                id: event.pathParameters.id
            }
        };

        dynamoClient.get(params, (error, result) => {
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
                let response = null;
                
                if(result.Item) {
                    response = {
                        statusCode: 200,
                        body: JSON.stringify(result.Item),
                    };
                } else {
                    response = {
                        statusCode: 404
                    };
                }

                callback(null, response);
            }            
        });
    } catch (error) {
        callback(error);
    }   
};