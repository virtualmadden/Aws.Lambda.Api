const updateLambda = require("../cars/update");
const aws_mock = require("aws-sdk-mock");

const expect = require("chai").expect;
const assert = require("chai").assert;

aws_mock.mock('DynamoDB.DocumentClient', 'update', (params, callback) => {
    callback(null, {Attributes:{"id": "f321fffb-bda3-4288-b0f0-7c7eeb1cd4cb", "make": "Ford","model": "Mustang","released": 2000}});
  });

describe("updateLambda", function() {
    [
        {"pathParameters":{"id": "f321fffb-bda3-4288-b0f0-7c7eeb1cd4cb"},"body":{"make": "Ford","model": "Mustang","released": 2006}}
    ].forEach(function(request) {
        it( `successful invocation: request=${JSON.stringify(request)}`, function(done) {
            var context = {
                succeed: function(result) {
                        expect(result.body).to.be.true;
                        done();
                    },
                fail: function() {
                        done(new Error("never context.fail"));
                    }
            }
            updateLambda.handler({body: JSON.stringify(request.body), pathParameters: request.pathParameters.id}, {/* context */}, (error, result) => {
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