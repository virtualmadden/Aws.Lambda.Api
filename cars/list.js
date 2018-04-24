const aws = require("aws-sdk");

const dynamoClient = new aws.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
    try {
        const params = {
            TableName: process.env.DYNAMODB_TABLE
        };

        dynamoClient.scan(params, (error, result) => {
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
                    body: JSON.stringify(result.Items),
                  };

                  callback(null, response);
            };            
        });
    } catch (error) {
        callback(error);
    }   
};