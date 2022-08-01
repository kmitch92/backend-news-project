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
        expect(body.msg).toBe("Endpoint Not Found");
      });
  });
});

describe.only("GET /api/topics", () => {
  test("should respond with status code:200, and with an array of all topics in the topics table of the database, with each item containing a 'slug' and a 'description' property.", () => {
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

describe.only("GET /api/articles/:article_id", () => {
  test("should respond with a status code:200, and with an article object, containing the properties: author (matches the username from the users table), title, article_id, body, topic, created_at, votes", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual(expect.any(Object));
        expect(Object.keys(body.article)).toEqual([
          "article_id",
          "title",
          "topic",
          "author",
          "body",
          "created_at",
          "votes",
        ]);
      });
  });

  test("should respond with a status code:400 when passed an invalid article_id type ", () => {
    return request(app)
      .get("/api/articles/one")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid ID Type");
      });
  });

  test("should respond with a status: 404 when passed a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/200")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article Not Found");
      });
  });
});
