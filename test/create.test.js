const createLambda = require("../src/cars/create");
const aws_mock = require("aws-sdk-mock");

const expect = require("chai").expect;
const assert = require("chai").assert;

aws_mock.mock('DynamoDB.DocumentClient', 'put', (params, callback) => {
    callback(null, {Item:{"make": "Ford","model": "Mustang","released": 2000}});
});

describe("createLambda", () => {
    [
        "{\"make\": \"Ford\",\"model\": \"Mustang\",\"released\": 2000}"
    ].forEach((request) => {
        it(`successful invocation: request=${request}`, (done) => {
            var context = {
                succeed: (result) => {
                        expect(result.body).to.be.true;
                        done();
                    },
                fail: (result) => {
                        expect(result.body).to.be.true;
                        done();
                    }
            }
            createLambda.handler({body: request}, {/* context */}, (error, result) => {
                try {                   
                    expect(error).to.not.exist;
                    
                    expect(result).to.exist;

                    let response = JSON.parse(result.body);

                    assert.equal(result.statusCode, 201);
                    
                    expect(response.id).to.be.not.null;
                    assert.equal(response.make, "Ford");
                    assert.equal(response.model, "Mustang");
                    assert.equal(response.released, 2000);
                    
                    done();
                }
                catch(error) {               
                    done(error);
                }
            });
        });
    });
});