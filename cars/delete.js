const aws = require("aws-sdk");

const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: null
};

const dynamoClient = new aws.DynamoDB.DocumentClient();

const deleteCar = async (request) => {
    params.Key = {
        id: request
    };

    return new Promise((resolve, reject) => {
        dynamoClient.delete(params, (error) => {
            if (error) {
                let response = {
                    statusCode: error.statusCode || 501,
                    headers: { 
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({"error": error.message})
                };

              reject(response);
            } else {
                let response = {
                    statusCode: 200,
                    body: JSON.stringify({}),
                };

                resolve(response);
            }            
        });
    });
};

exports.handler = async (event, context, callback) => {
    try {
        let request = event.pathParameters.id;

        let response = await deleteCar(request).catch((response) => {callback(null, response)});

        callback(null, response);
    } catch (error) {
        callback(error);
    }   
};