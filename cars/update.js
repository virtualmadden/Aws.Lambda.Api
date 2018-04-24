const aws = require("aws-sdk");

const dynamoClient = new aws.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
    try {
        let request = JSON.parse(event.body);
    
        const params = {
            TableName: process.env.DYNAMODB_TABLE,
            Key: {
                id: event.pathParameters.id,
              },
              ExpressionAttributeNames: {
                "#make": "make",
              },
              ExpressionAttributeValues: {
                ":make": request.make,
                ":model": request.model,
                ":released": request.released
              },
            UpdateExpression: "SET #make = :make, model = :model, released = :released",
            ReturnValues: "ALL_NEW"
        };

        dynamoClient.update(params, (error, result) => {
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
                    statusCode: 200,
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(result.Attributes)
                };
                
                callback(null, response);
            }
        });
    } catch (error) {
        callback(error);
    }   
};