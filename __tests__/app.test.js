const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const app = require("../app");
const data = require("../db/data/test-data/.");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe.only("ALL /*", () => {
  test("status: 404 for endpoint not found", () => {
    return request(app)
      .get("/non_existent_endpoint")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Endpoint not found");
      });
  });
});

describe.only("GET /api/topics", () => {
  test("should respond with all topics in topics table of database, with each item containing a 'slug' and a 'description' property.", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        expect(response.body.topics).toEqual(expect.any(Array));
        expect((response.body.topics.length = 3));
        expect(Object.keys(response.body.topics[0])).toEqual([
          "slug",
          "description",
        ]);
      });
  });
});
