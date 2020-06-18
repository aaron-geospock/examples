import PrestoClient from "../../src/js/prestoClient.js";
import fetchMock from 'fetch-mock';
import mocha from "mocha";
import chai from "chai";
import btoa from "btoa";

mocha.it("prestoClient auth", async function() {
    let client = new PrestoClient("testurl", "username", "password");
    let fetch = fetchMock.sandbox();
    client.setFetch(fetch);

    fetch.any({status: 200, body: {}});

    for await (let state of client.execute("testsql")) {
    }

    chai.expect(fetch.lastOptions().headers.Authorization).to.equal(`Basic ${btoa("username:password")}`);
});

mocha.it("prestoClient result", async function() {
    let client = new PrestoClient("testurl", "username", "password");
    let fetch = fetchMock.sandbox();
    client.setFetch(fetch);

    fetch.post("/testurl/v1/statement", {status: 200, body: {nextUri: "/testurl/v1/statement/1"}});
    fetch.get("/testurl/v1/statement/1", {status: 200, body: {data: [["results"]]}});

    let results = [];

    for await (let {data} of client.execute("testsql")) {
        results.push({data});
    }

    chai.expect(results).to.be.deep.equal([
        {data: undefined},
        {data: [["results"]]}
    ]);
});

mocha.it("prestoClient URL trailing slash", async function() {
    let client = new PrestoClient("https://sqlaccess.example.com/", "username", "password");
    let fetch = fetchMock.sandbox();
    client.setFetch(fetch);

    fetch.post("https://sqlaccess.example.com/v1/statement", {status: 200, body: {nextUri: "https://sqlaccess.example.com/v1/statement/1"}});

    let response = await client.submitQuery("SHOW TABLES FROM geospock.default");
    chai.expect(response.url).to.deep.equal("https://sqlaccess.example.com/v1/statement");
});
