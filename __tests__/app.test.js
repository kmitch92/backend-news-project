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

describe("ALL /*", () => {
  test("status: 404 for endpoint not found", () => {
    return request(app)
      .get("/non_existent_endpoint")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Endpoint Not Found");
      });
  });
});

describe("GET /api/topics", () => {
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

describe("GET /api/articles/:article_id", () => {
  test("should respond with a status code:200, and with an article object, containing the properties: author (matches the username from the users table), title, article_id, body, topic, created_at, votes and comment count", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual(expect.any(Object));
        expect(body.article.title).toEqual(expect.any(String));
        expect(body.article.article_id).toEqual(expect.any(Number));
        expect(body.article.topic).toEqual(expect.any(String));
        expect(body.article.author).toEqual(expect.any(String));
        expect(body.article.body).toEqual(expect.any(String));
        expect(body.article.created_at).toEqual(expect.any(String));
        expect(body.article.votes).toEqual(expect.any(Number));

        ///Test Refactor Below
        expect(body.article.comment_count).toEqual(11);
        ////Test Refactor Above
      });
  });

  test("additional comment-count refactor test", () => {
    return request(app)
      .get("/api/articles/9")
      .expect(200)
      .then(({ body }) => {
        expect(body.article.comment_count).toEqual(2);
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

describe("PATCH /api/articles/:article_id", () => {
  test("should respond with status code:200 and the updated article when a successful patch request is made. This endpoint increments the votes on the article: the votes should be incremented by the passed amount", () => {
    const voteIncrementer = { inc_votes: 7 };
    return request(app)
      .patch("/api/articles/2")
      .send(voteIncrementer)
      .expect(200)
      .then(({ body }) => {
        expect(body.updatedArticle.votes).toEqual(7);
      });
  });

  test("should respond with a status code:400 when passed an invalid article_id type ", () => {
    const voteIncrementer = { inc_votes: 7 };
    return request(app)
      .patch("/api/articles/two")
      .send(voteIncrementer)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid ID Type");
      });
  });

  test("should respond with a status code:404 when passed a valid but non-existent id", () => {
    const voteIncrementer = { inc_votes: 7 };
    return request(app)
      .patch("/api/articles/200")
      .send(voteIncrementer)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article Not Found");
      });
  });

  test("should respond with a status code:400 if passed an incorrect argument object", () => {
    const voteIncrementer = { fail_inc_votes: 7 };
    return request(app)
      .patch("/api/articles/2")
      .send(voteIncrementer)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Request Body");
      });
  });
});

describe("GET /api/users", () => {
  test("should respond with a status code:200 and a narray of user objects with the properties: username, name, avatar_url", async () => {
    const users = await request(app).get("/api/users");
    expect(users.body).toEqual(expect.any(Array));
    expect(users.body).toHaveLength(4);

    users.body.forEach((user) => {
      expect(user.name).toEqual(expect.any(String));
      expect(user.username).toEqual(expect.any(String));
      expect(user.avatar_url).toEqual(expect.any(String));
    });
  });
});
