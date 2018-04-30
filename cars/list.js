const aws = require("aws-sdk");

const params = {
    TableName: process.env.DYNAMODB_TABLE
};

let dynamoClient = null;

const listAllCards = async () => {
    return new Promise((resolve, reject) => {
        dynamoClient.scan(params, (error, result) => {
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
                    body: JSON.stringify(result.Items),
                  };

                  resolve(response);
            };            
        });
    });
};

exports.handler = async (event, context, callback) => {
    dynamoClient = new aws.DynamoDB.DocumentClient();

    try {
        let response = await listAllCards().catch((response) => {callback(null, response)});

        callback(null, response);
    } catch (error) {
        callback(error);
    }   
};