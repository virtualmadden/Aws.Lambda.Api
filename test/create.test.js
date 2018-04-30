const createLambda = require("../cars/create");
const aws_mock = require("aws-sdk-mock");

const expect = require("chai").expect;
const assert = require("chai").assert;

aws_mock.mock('DynamoDB.DocumentClient', 'put', (params, callback) => {
    callback(null, {Item:{"make": "Ford","model": "Mustang","released": 2000}});
  });

describe("createLambda", function() {
    [
        "{\"make\": \"Ford\",\"model\": \"Mustang\",\"released\": 2000}"
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