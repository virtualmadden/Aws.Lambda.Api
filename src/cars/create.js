const aws = require("aws-sdk");
const uuid = require("uuid");

const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
        id: null,
        make: null,
        model: null,
        released: null
    }
};

let dynamoClient = null;

const createCar = async (request) => {
    params.Item.id = uuid.v1();
    params.Item.make = request.make;
    params.Item.model = request.model;
    params.Item.released = request.released;
    
    return new Promise((resolve, reject) => {
        if(params.Item.make == null || params.Item.model == null || params.Item.released == null) {
            let response = {
                statusCode: 400,
                headers: { 
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({"error": "invalid model"})
            };
            
            reject(response);
        }
        
        dynamoClient.put(params, (error) => {
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
    dynamoClient = new aws.DynamoDB.DocumentClient();

    try {
        let request = JSON.parse(event.body);
        
        let response = await createCar(request).catch((response) => {callback(null, response)});

        callback(null, response);
    } catch (error) {
        callback(error);
    }   
};