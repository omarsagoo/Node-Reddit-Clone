const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server");
const should = chai.should();
chai.use(chaiHttp);

// Agent that will keep track of our cookies
const agent = chai.request.agent(server);

const User = require("../models/user");

describe("User", function() {

    it("should not be able to login if they have not registered", function(done) {
        agent.post("/login", { username: "wrong", password: "nope" }).end(function(err, res) {
          res.status.should.be.equal(401);
          agent.should.not.have.cookie("nToken");
          done();
        });
      });

    // signup
    it("should be able to signup", function(done) {
        User.findOneAndRemove({ username: "testone" }, function() {
            agent
            .post("/sign-up")
            .send({ username: "testone", password: "password", confirm: "password" })
            .end(function(err, res) {
                console.log(res.body);
                res.should.have.status(200);
                agent.should.not.have.cookie("nToken");
                done();
            });
        });
    });

    // signup
    it("should not be able to signup without the correct confirm", function(done) {
        User.findOneAndRemove({ username: "testtwo" }, function() {
            agent
            .post("/sign-up")
            .send({ username: "testtwo", password: "correct", confirm: "incorrect" })
            .end(function(err, res) {
                console.log(res.body);
                res.should.have.status(401);
                done();
            });
        });
    });

    // login
    it("should be able to login", function(done) {
        agent
        .post("/login")
        .send({ username: "testone", password: "password", remember: "on" })
        .end(function(err, res) {
            res.should.have.status(200);
            agent.should.have.cookie("nToken");
            done(err);
        });
    });

    // logout
    it("should be able to logout", function(done) {
        agent.get("/logout").end(function(err, res) {
        res.should.have.status(200);
        agent.should.not.have.cookie("nToken");
        done();
        });
    });

    after(function () {
        agent.close()
    });
});