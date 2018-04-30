const deleteLambda = require("../cars/delete");
const aws_mock = require("aws-sdk-mock");

const expect = require("chai").expect;
const assert = require("chai").assert;

aws_mock.mock('DynamoDB.DocumentClient', 'delete', (params, callback) => {
    callback(null, "successfully put item in database");
  });

describe("deleteLambda", function() {
    [
        "{\"id\":\"f321fffb-bda3-4288-b0f0-7c7eeb1cd4cb\"}"
    ].forEach(function(request) {
        it( `successful invocation: request=${request}`, function(done) {
            var context = {
                succeed: function(result) {
                        expect(result.body).to.be.true;
                        done();
                    },
                fail: function() {
                        done(new Error("never context.fail"));
                    }
            }
            deleteLambda.handler({pathParameters: request}, {/* context */}, (error, result) => {
                try {                   
                    expect(error).to.not.exist;
                    
                    expect(result).to.exist;

                    assert.equal(result.statusCode, 204);
                    
                    assert.equal(result.body, "{}");
                    
                    done();
                }
                catch(error) {               
                    done(error);
                }
            });
        });
    });
});