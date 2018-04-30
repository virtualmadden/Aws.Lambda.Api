const getLambda = require("../cars/get");
const aws_mock = require("aws-sdk-mock");

const expect = require("chai").expect;
const assert = require("chai").assert;

aws_mock.mock('DynamoDB.DocumentClient', 'get', (params, callback) => {
    callback(null, {Item:{"id": "f321fffb-bda3-4288-b0f0-7c7eeb1cd4cb", "make": "Ford","model": "Mustang","released": 2000}});
  });

describe("getLambda", () => {
    [
        "{\"id\":\"f321fffb-bda3-4288-b0f0-7c7eeb1cd4cb\"}"
    ].forEach((request) => {
        it( `successful invocation: request=${request}`, (done) => {
            var context = {
                succeed: (result) => {
                        expect(result.body).to.be.true;
                        done();
                    },
                fail: () => {
                        done(new Error("never context.fail"));
                    }
            }
            getLambda.handler({pathParameters: request}, {/* context */}, (error, result) => {
                try {                   
                    expect(error).to.not.exist;
                    
                    expect(result).to.exist;
                    
                    let response = JSON.parse(result.body);

                    assert.equal(result.statusCode, 200);
                    
                    assert.equal(response.id, "f321fffb-bda3-4288-b0f0-7c7eeb1cd4cb");
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