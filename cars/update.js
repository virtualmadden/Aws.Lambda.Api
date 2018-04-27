const aws = require("aws-sdk");

const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: null,
    ExpressionAttributeNames: {
        "#make": "make",
    },
    ExpressionAttributeValues: null,
    UpdateExpression: "SET #make = :make, model = :model, released = :released",
    ReturnValues: "ALL_NEW"
};

const dynamoClient = new aws.DynamoDB.DocumentClient();

const updateCar = async (id, request) => {
    params.Key = {
        id: id,
    };
      
    params.ExpressionAttributeValues = {
        ":make": request.make,
        ":model": request.model,
        ":released": request.released
    };

    return new Promise((resolve, reject) => {
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
                
                reject(response);
            } else {
                let response = {
                    statusCode: 200,
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(result.Attributes)
                };
                
                resolve(response);
            }
        });
    });
};

exports.handler = async (event, context, callback) => {
    try {
        let id = event.pathParameters.id;
        let request = JSON.parse(event.body);
    
        let response = await updateCar(id, request);

        callback(null, response);
    } catch (error) {
        callback(error);
    }   
};