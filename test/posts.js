// test/posts.js
const app = require("./../server")
const chai = require("chai")
const chaiHttp = require("chai-http")
const expect = chai.expect

// Import the Post and User model from our models folder so we
// we can use it in our tests.
const Post = require('../models/post')
const User = require("../models/user");
const server = require('../server')


const agent = chai.request.agent(app);
chai.should()
chai.use(chaiHttp)

describe('Posts', function() {
    const agent = chai.request.agent(server)
    
    const user = {
        username: 'poststest',
        password: 'testposts',
        confirm: 'testposts'
    };

    before(function (done) {
        agent
          .post('/sign-up')
          .set("content-type", "application/x-www-form-urlencoded")
          .send(user)
          .then(function (res) {
            done()
          })
          .catch(function (err) {
            done(err);
          });
    });

    it("should create with valid attributes at POST /posts/new", function (done) {
        
        // Check how many posts there currently are
        Post.estimatedDocumentCount().then(initialDocCount => {
            agent
            .post("/login")
            .send({ username: user.username, password: user.password, remember: "on" })
            .end(function(err, res) {
                agent.should.have.cookie("nToken");

                var newPost = {
                    title: 'post title',
                    url: 'https://www.google.com',
                    summary: 'post summary',
                    subreddit: "post subreddit",
                    author: res.body._id
                }

                agent
                .post("/posts/new" )
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
            });
        })
    })

    after(function (done) {
        Post.findOneAndDelete({title: "post title"})
        .then(function (res) {
            agent.close()
      
            User.findOneAndDelete({
                username: user.username
            })
              .then(function (res) {
                  done()
              })
              .catch(function (err) {
                  done(err);
              });
        })
        .catch(function (err) {
            done(err);
        });
    });
})