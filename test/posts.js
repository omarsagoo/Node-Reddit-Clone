// test/posts.js
const app = require("./../server");
const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;

// Import the Post model from our models folder so we
// we can use it in our tests.
const Post = require('../models/post');
const server = require('../server');

chai.should();
chai.use(chaiHttp);

describe('Posts', function() {
    const agent = chai.request.agent(server);
    // Post that we'll use for testing purposes
    const newPost = {
        title: 'post title',
        url: 'https://www.google.com',
        summary: 'post summary'
    };
    it("should create with valid attributes at POST /posts/new", function (done) {
        // Check how many posts there currently are
        Post.estimatedDocumentCount().then(initialDocCount => {
            agent
                .post("/posts/new", )
                // This line fakes a form post,
                // since we're not actually filling out a form
                .set("content-type", "application/x-www-form-urlencoded")
                // Make a request to create another
                .send(newPost)
                .then(res => {
                    Post.estimatedDocumentCount().then(newDocCount => {
                        expect(res).to.have.status(200)
                        expect(newDocCount).to.be.equal(initialDocCount + 1)
                        done()
                    }).catch(err => {
                        done(err)
                    })
                }).catch(err => {
                    done(err)
                })
        }).catch(err => {
            done(err)
        })
    });

    after(function () {
        Post.findOneAndDelete(newPost);
    });
});