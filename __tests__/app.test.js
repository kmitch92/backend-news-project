const request = require('supertest');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const app = require('../app');
const data = require('../db/data/test-data/.');

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe('ALL /*', () => {
  test('status: 404 for endpoint not found', () => {
    return request(app)
      .get('/non_existent_endpoint')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Endpoint Not Found');
      });
  });
});

describe('GET /api/topics', () => {
  test("should respond with status code:200, and with an array of all topics in the topics table of the database, with each item containing a 'slug' and a 'description' property.", () => {
    return request(app)
      .get('/api/topics')
      .expect(200)
      .then((response) => {
        expect(response.body.topics).toEqual(expect.any(Array));
        expect((response.body.topics.length = 3));
        expect(Object.keys(response.body.topics[0])).toEqual([
          'slug',
          'description',
        ]);
      });
  });
});

describe('GET /api/articles/:article_id', () => {
  test('should respond with a status code:200, and with an article object, containing the properties: author (matches the username from the users table), title, article_id, body, topic, created_at, votes.', () => {
    return request(app)
      .get('/api/articles/1')
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
      });
  });

  test('comment-count refactor test', () => {
    return request(app)
      .get('/api/articles/9')
      .expect(200)
      .then(({ body }) => {
        expect(body.article.comment_count).toEqual(2);
      });
  });

  test('should respond with a status code:400 when passed an invalid article_id type ', () => {
    return request(app)
      .get('/api/articles/one')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid ID Type');
      });
  });

  test('should respond with a status: 404 when passed a valid but non-existent id', () => {
    return request(app)
      .get('/api/articles/200')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Article Not Found');
      });
  });
});

describe('PATCH /api/articles/:article_id', () => {
  test('should respond with status code:200 and the updated article when a successful patch request is made. This endpoint increments the votes on the article: the votes should be incremented by the passed amount', () => {
    const voteIncrementer = { inc_votes: 7 };
    return request(app)
      .patch('/api/articles/2')
      .send(voteIncrementer)
      .expect(200)
      .then(({ body }) => {
        expect(body.updatedArticle[0].votes).toEqual(7);
      });
  });

  test('should respond with a status code:400 when passed an invalid article_id type ', () => {
    const voteIncrementer = { inc_votes: 7 };
    return request(app)
      .patch('/api/articles/two')
      .send(voteIncrementer)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid ID Type');
      });
  });

  test('should respond with a status code:404 when passed a valid but non-existent id', () => {
    const voteIncrementer = { inc_votes: 7 };
    return request(app)
      .patch('/api/articles/200')
      .send(voteIncrementer)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Article Not Found');
      });
  });

  test('should respond with a status code:400 if passed an incorrect argument object', () => {
    const voteIncrementer = { fail_inc_votes: 7 };
    return request(app)
      .patch('/api/articles/2')
      .send(voteIncrementer)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid Request Body');
      });
  });
});

describe('GET /api/users', () => {
  test('should respond with a status code:200 and a narray of user objects with the properties: username, name, avatar_url', async () => {
    const users = await request(app).get('/api/users');
    expect(users.body).toEqual(expect.any(Array));
    expect(users.body).toHaveLength(4);

    users.body.forEach((user) => {
      expect(user.name).toEqual(expect.any(String));
      expect(user.username).toEqual(expect.any(String));
      expect(user.avatar_url).toEqual(expect.any(String));
    });
  });
});

describe('GET /api/articles', () => {
  test('should respond with a status code:200, and with an array of article objects, each containing the properties: author, title, article_id, body, topic, created_at, votes and comment count', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        body.forEach((article) => {
          expect(article).toEqual(expect.any(Object));
          expect(article.title).toEqual(expect.any(String));
          expect(article.article_id).toEqual(expect.any(Number));
          expect(article.topic).toEqual(expect.any(String));
          expect(article.author).toEqual(expect.any(String));
          expect(article.body).toEqual(expect.any(String));
          expect(article.created_at).toEqual(expect.any(String));
          expect(article.votes).toEqual(expect.any(Number));
          expect(article.comment_count).toEqual(expect.any(Number));
        });
      });
  });
  test('Articles should be ordered by dates in descending order', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeSorted('created_at', {
          descending: true,
          coerce: true,
        });
      });
  });
});

describe('GET /api/articles/:article_id/comments', () => {
  test('should respond with a status code:200, and with an array of comment objects, for a successful request. Each comment object should have the properties of: comment_id, votes, created_at, author, body', () => {
    return request(app)
      .get('/api/articles/9/comments')
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveLength(2);
        body.forEach((comment) => {
          expect(comment).toEqual(expect.any(Object));
          expect(comment.comment_id).toEqual(expect.any(Number));
          expect(comment.votes).toEqual(expect.any(Number));
          expect(comment.created_at).toEqual(expect.any(String));
          expect(comment.author).toEqual(expect.any(String));
          expect(comment.body).toEqual(expect.any(String));
        });
      });
  });
  test('should respond with a status code:400 when passed an invalid article_id type ', () => {
    return request(app)
      .get('/api/articles/one/comments')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid ID Type');
      });
  });

  test('should respond with a status: 404 when passed a valid but non-existent id', () => {
    return request(app)
      .get('/api/articles/200/comments')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Article Not Found');
      });
  });

  test('should respond with a status: 200 and an empty array when passed a valid and existing id that has no comments', () => {
    return request(app)
      .get('/api/articles/2/comments')
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(expect.any(Array));
        expect(body).toHaveLength(0);
      });
  });
});

describe('POST /api/articles/:article_id/comments', () => {
  test('should respond with a status code:201 and a returned comment object, with the fields: comment_id, body, author, article_id, created_at.', () => {
    const date1 = new Date(Date.now());
    const date1InSeconds = Math.floor(date1.getTime());

    const postableComment = {
      username: 'icellusedkars',
      body: 'comment for test',
    };

    return request(app)
      .post('/api/articles/2/comments')
      .send(postableComment)
      .expect(201)
      .then(
        ({
          body: {
            returnComment: [comment],
          },
        }) => {
          expect(comment).toEqual(expect.any(Object));
          expect(comment.comment_id).toEqual(expect.any(Number));
          expect(comment.votes).toEqual(0);
          expect(comment.author).toEqual('icellusedkars');
          expect(comment.body).toEqual('comment for test');

          const bodyDate = new Date(comment.created_at);
          const bodyDateInSeconds = Math.floor(bodyDate.getTime());

          const date2 = new Date(Date.now());
          const date2InSeconds = Math.floor(date2.getTime());

          expect(bodyDateInSeconds).toBeGreaterThan(date1InSeconds);
          expect(bodyDateInSeconds).toBeLessThan(date2InSeconds);
        }
      );
  });

  test('should respond with a status code:400 when passed an invalid article_id type ', () => {
    const postableComment = {
      username: 'icellusedkars',
      body: 'comment for test',
    };
    return request(app)
      .post('/api/articles/two/comments')
      .send(postableComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid ID Type');
      });
  });

  test('should respond with a status code:404 when passed a valid but non-existent id', () => {
    const postableComment = {
      username: 'icellusedkars',
      body: 'comment for test',
    };
    return request(app)
      .post('/api/articles/200/comments')
      .send(postableComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Article Not Found');
      });
  });

  test('should respond with a status code:400 if passed an incorrect argument object', () => {
    const postableComment = {
      uselname: 'icellusedkars',
      bodeh: 'comment for test',
    };
    return request(app)
      .post('/api/articles/2/comments')
      .send(postableComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid Request Body');
      });
  });

  test('should respond with a status code:404 if passed an argument object containing a non-existant username', () => {
    const postableComment = {
      username: 'Kiel',
      body: 'comment for test',
    };
    return request(app)
      .post('/api/articles/2/comments')
      .send(postableComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Username Not Found');
      });
  });
});

describe('GET /api/articles (queries)', () => {
  test('should accept the following endpoint queries: sort_by (sorts articles by any valid column), order (can be set to asc or desc - desc by default - for the direction of the sorting) and topic, which filters the articles by the specified topic value', () => {
    const top = 'mitch';
    const sort = 'author';

    return request(app)
      .get(`/api/articles/?sort_by=${sort}&topic=${top}`)
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeSortedBy(sort, { descending: true });
        body.forEach((article) => {
          expect(article.topic).toEqual(top);
          expect(article.title).toEqual(expect.any(String));
          expect(article.article_id).toEqual(expect.any(Number));
          expect(article.author).toEqual(expect.any(String));
          expect(article.body).toEqual(expect.any(String));
          expect(article.created_at).toEqual(expect.any(String));
          expect(article.votes).toEqual(expect.any(Number));
          expect(article.comment_count).toEqual(expect.any(Number));
        });
      });
  });

  test('further testing of the above (different parameters, manual value for order)', () => {
    const top = 'mitch';
    const sort = 'votes';
    const order = 'asc';
    return request(app)
      .get(`/api/articles/?sort_by=${sort}&order=${order}&topic=${top}`)
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeSortedBy(sort, { descending: false });
        body.forEach((article) => {
          expect(article.topic).toEqual(top);
          expect(article.title).toEqual(expect.any(String));
          expect(article.article_id).toEqual(expect.any(Number));
          expect(article.author).toEqual(expect.any(String));
          expect(article.body).toEqual(expect.any(String));
          expect(article.created_at).toEqual(expect.any(String));
          expect(article.votes).toEqual(expect.any(Number));
          expect(article.comment_count).toEqual(expect.any(Number));
        });
      });
  });

  test('should return status code:200 and a list of articles filtered by only a given topic', () => {
    return request(app)
      .get('/api/articles?topic=cats')
      .expect(200)
      .then(({ body }) => {
        expect(body.length).toBe(1);
        body.forEach((article) => {
          expect(article.topic).toEqual('cats');
        });
      });
  });
  test("Should return a status code:400 and error if sort_by column doesn't exist", () => {
    return request(app)
      .get('/api/articles?sort_by=tittle')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid Sort Request');
      });
  });
  test('should return status code:404 and error if topic does not exist', () => {
    return request(app)
      .get('/api/articles?topic=mitchy')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Topic Not Found');
      });
  });

  test('should return a status code:400 and an error if order value != asc/desc', () => {
    return request(app)
      .get('/api/articles?order=dess')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid Order Value');
      });
  });
  test('should return status code:200 and an empty array for an existant topic with no articles', () => {
    return request(app)
      .get('/api/articles?topic=paper')
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(expect.any(Array));
        expect(body).toHaveLength(0);
      });
  });
});

describe('DELETE /api/comments/:comment_id', () => {
  test('should return status code:204 and no content if the delete request is successful', () => {
    return request(app).delete('/api/comments/4').expect(204);
  });
  test('should return a status code:400 if the comment_id is of invalid type', () => {
    return request(app)
      .delete('/api/comments/four')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid ID Type');
      });
  });
  test('should return a status code: 404 if the comment_id does not reference a valid comment object', () => {
    return request(app)
      .delete('/api/comments/400')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Comment Not Found');
      });
  });
});
