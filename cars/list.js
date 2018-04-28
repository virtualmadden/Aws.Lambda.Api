const aws = require("aws-sdk");

const params = {
    TableName: process.env.DYNAMODB_TABLE
};

const dynamoClient = new aws.DynamoDB.DocumentClient();

const listAllCards = async () => {
    return new Promise((resolve, reject) => {
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

              reject(response);
            } else {
                let response = {
                    statusCode: 200,
                    body: JSON.stringify(result.Items),
                  };

                  resolve(response);
            };            
        });
    });
};

exports.handler = async (event, context, callback) => {
    try {
        let response = await listAllCards();

        callback(null, response);
    } catch (error) {
        callback(error);
    }   
};