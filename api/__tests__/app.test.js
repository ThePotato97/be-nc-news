const request = require("supertest");

const testData = require("../../db/data/test-data/index");

const db = require("../../db/connection.js");
const app = require("../app");

const seed = require("../../db/seeds/seed");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("/api", () => {
  describe("GET /api", () => {
    it("should return the endpoints documentation", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then((res) => {
          const { body } = res;
          expect(res.headers["content-type"]).toMatch(/json/);
          expect(body).toHaveProperty("GET /api");
          expect(body).toHaveProperty("GET /api/topics");
          expect(body["GET /api"]).toHaveProperty("description");
          expect(body["GET /api/topics"]).toHaveProperty("description");
        });
    });
  });

  describe("GET /api/topics", () => {
    it("should get a list of topics in the database and have a status of 200", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((res) => {
          const { topics } = res.body;
          expect(topics).toBeInstanceOf(Array);
          expect(topics).toHaveLength(3);
          topics.forEach((topic) => {
            expect(topic).toHaveProperty("slug");
            expect(topic).toHaveProperty("description");
          });
        });
    });
  });

  describe("GET /api/articles/:article_id", () => {
    it("should return the specified article from the id", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then((res) => {
          const { article } = res.body;
          expect(article).toBeInstanceOf(Object);
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("article_id");
          expect(article).toHaveProperty("body");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("article_img_url");
        });
    });
    it("should return an error when the parameter is wrong", () => {
      return request(app)
        .get("/api/articles/fails")
        .expect(400)
        .then((res) => {
          const { body } = res;
          expect(body.msg).toBe("Bad Request");
        });
    });
    it("should return an error when the article id doesn't exist", () => {
      return request(app)
        .get("/api/articles/123994")
        .expect(404)
        .then((res) => {
          const { body } = res;
          expect(body.msg).toBe("Article ID does not exist");
        });
    });
  });
  describe("GET /api/articles/:article_id/comments", () => {
    it("should return the specified article comments", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then((res) => {
          const { comments } = res.body;
          expect(comments).toBeInstanceOf(Array);
          expect(comments).toHaveLength(11);
          comments.forEach((comment) => {
            expect(comment).toMatchObject({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              article_id: 1,
            });
          });
        });
    });
    it("should be able to handle an invalid article id", () => {
      return request(app)
        .get("/api/articles/test/comments")
        .expect(400)
        .then((res) => {
          const { body } = res;
          expect(body.msg).toBe("Bad Request");
        });
    });
    it("should return an error when the article id doesn't exist", () => {
      return request(app)
        .get("/api/articles/1000/comments")
        .expect(404)
        .then((res) => {
          const { body } = res;
          expect(body.msg).toBe("Article ID does not exist");
        });
    });
    it("should return an empty array for an article with no comments", () => {
      return request(app)
        .get("/api/articles/7/comments")
        .expect(200)
        .then((res) => {
          const { comments } = res.body;
          expect(comments).toHaveLength(0);
        });
    });
  });
  describe("POST /api/articles/:article_id/comments", () => {
    it("should return the posted comment", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({
          username: "butter_bridge",
          body: "Hello World!",
        })
        .expect(201)
        .then((res) => {
          const { comment } = res.body;
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: "butter_bridge",
            body: "Hello World!",
            article_id: 1,
          });
        });
    });
    it("should ignore unnecessary body properties", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({
          username: "butter_bridge",
          body: "Hello World!",
          test: "",
        })
        .expect(201)
        .then((res) => {
          const { comment } = res.body;
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: "butter_bridge",
            body: "Hello World!",
            article_id: 1,
          });
        });
    });
    it("should be able to handle an invalid article id", () => {
      return request(app)
        .post("/api/articles/test/comments")
        .send({
          username: "butter_bridge",
          body: "Hello World!",
        })
        .expect(400)
        .then((res) => {
          const { body } = res;
          expect(body.msg).toBe("Bad Request");
        });
    });
    it("should be able to handle username that doesn't exist", () => {
      return request(app)
        .post("/api/articles/test/comments")
        .send({
          username: "foo",
          body: "Hello World!",
        })
        .expect(400)
        .then((res) => {
          const { body } = res;
          expect(body.msg).toBe("Bad Request");
        });
    });
    it("should be able to handle an empty body", () => {
      return request(app)
        .post("/api/articles/test/comments")
        .send({})
        .expect(400)
        .then((res) => {
          const { body } = res;
          expect(body.msg).toBe("Bad Request");
        });
    });
    it("should return 404 if the article id invalid", () => {
      return request(app)
        .post("/api/articles/1000/comments")
        .send({
          username: "butter_bridge",
          body: "Hello World!",
        })
        .expect(404)
        .then((res) => {
          const { body } = res;
          expect(body.msg).toBe("Article ID does not exist");
        });
    });
  });
  describe("PATCH /api/articles/:article_id", () => {
    it("should increment the specified article id's and add 1 vote and return the updated article", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({
          inc_votes: 1,
        })
        .expect(200)
        .then((res) => {
          const { article } = res.body;
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: 1,
            body: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: 101,
            article_img_url: expect.any(String),
          });
        });
    });
    it("should increment the specified article id's and add -100 votes and return the updated article", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({
          inc_votes: -100,
        })
        .expect(200)
        .then((res) => {
          const { article } = res.body;
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: 1,
            body: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: 0,
            article_img_url: expect.any(String),
          });
        });
    });
    it("should ignore unnecessary body properties", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({
          inc_votes: -100,
          test: 1000,
        })
        .expect(200)
        .then((res) => {
          const { article } = res.body;
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: 1,
            body: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: 0,
            article_img_url: expect.any(String),
          });
        });
    });
    it("should be able to handle an empty body", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({})
        .expect(400)
        .then((res) => {
          const { body } = res;
          expect(body.msg).toBe("Invalid Body");
        });
    });
    it("should be able to handle an invalid article id", () => {
      return request(app)
        .patch("/api/articles/test")
        .send({
          inc_votes: 1,
        })
        .expect(400)
        .then((res) => {
          const { body } = res;
          expect(body.msg).toBe("Bad Request");
        });
    });
    it("should return an error when the article id doesn't exist", () => {
      return request(app)
        .patch("/api/articles/1000")
        .send({
          inc_votes: 1,
        })
        .expect(404)
        .then((res) => {
          const { body } = res;
          expect(body.msg).toBe("Article ID does not exist");
        });
    });
  });
  describe("GET /api/articles", () => {
    it("should get a list of articles that are in the database and have a status of 200", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((res) => {
          const { articles } = res.body;

          expect(articles).toBeInstanceOf(Array);
          expect(articles).toHaveLength(12);

          articles.forEach((topic) => {
            expect(topic).toHaveProperty("author");
            expect(topic).toHaveProperty("article_id");
            expect(topic).toHaveProperty("topic");
            expect(topic).toHaveProperty("created_at");
            expect(topic).toHaveProperty("votes");
            expect(topic).toHaveProperty("article_img_url");
            expect(topic).toHaveProperty("comment_count");
          });
        });
    });
    it("should not have a body property on any articles", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((res) => {
          const { articles } = res.body;
          expect(articles).toBeInstanceOf(Array);
          expect(articles).toHaveLength(12);
          articles.forEach((topic) => {
            expect(topic).not.toHaveProperty("body");
          });
        });
    });
    it("should have the total count of the comments", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((res) => {
          const { articles } = res.body;
          articles.forEach((topic) => {
            expect(topic).toHaveProperty("comment_count");
          });
        });
    });

    it("should be sorted by date in descending order", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((res) => {
          const { articles } = res.body;
          expect(articles).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
  });
  describe("DELETE /api/comments/:comment_id", () => {
    it("should return 204 with no content when successful", () => {
      return request(app).delete("/api/comments/1").expect(204);
    });
    it("should return 404 if the comment id invalid", () => {
      return request(app)
        .delete("/api/comments/1000")
        .expect(404)
        .then((res) => {
          const { body } = res;
          expect(body.msg).toBe("Comment ID does not exist");
        });
    });
    it("should be able to handle an invalid comment id", () => {
      return request(app)
        .delete("/api/comments/test")
        .expect(400)
        .then((res) => {
          const { body } = res;
          expect(body.msg).toBe("Bad Request");
        });
    });
  });
  describe("GET /api/users", () => {
    it("should return an array of objects of users", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then((res) => {
          const { users } = res.body;
          expect(users).toHaveLength(4);
          users.forEach((user) => {
            expect(user).toMatchObject({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            });
          });
        });
    });
  });
  describe('GET /api/articles (queries)', () => {
    it('should return articles with the specified topic', () => {
      return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then((res) => {
          const { articles } = res.body;

          expect(articles).toBeInstanceOf(Array);
          expect(articles).toHaveLength(11);
          expect(articles).toBeSortedBy("created_at", {
            descending: true,
          });

          articles.forEach((topic) => {
            expect(topic).toMatchObject({
              author: expect.any(String),
              article_id: expect.any(Number),
              topic: "mitch",
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(Number),
            });
          });
        });
    });
    it('should return articles with the specified order', () => {
      return request(app)
        .get("/api/articles?order=asc")
        .expect(200)
        .then((res) => {
          const { articles } = res.body;

          expect(articles).toBeInstanceOf(Array);
          expect(articles).toHaveLength(12);
          expect(articles).toBeSortedBy("created_at", {
            descending: false,
          });

          articles.forEach((topic) => {
            expect(topic).toMatchObject({
              author: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(Number),
            });
          });
        });
    });
    it('should return articles sorted by author', () => {
      return request(app)
        .get("/api/articles?sort_by=author")
        .expect(200)
        .then((res) => {
          const { articles } = res.body;

          expect(articles).toBeInstanceOf(Array);
          expect(articles).toHaveLength(12);
          expect(articles).toBeSortedBy("author", {
            descending: true,
          });

          articles.forEach((topic) => {
            expect(topic).toMatchObject({
              author: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(Number),
            });
          });
        });
    });
    it('should return articles sorted by article_id', () => {
      return request(app)
        .get("/api/articles?sort_by=article_id")
        .expect(200)
        .then((res) => {
          const { articles } = res.body;

          expect(articles).toBeInstanceOf(Array);
          expect(articles).toHaveLength(12);
          expect(articles).toBeSortedBy("article_id", {
            descending: true,
          });

          articles.forEach((topic) => {
            expect(topic).toMatchObject({
              author: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(Number),
            });
          });
        });
    });
    it('should return articles sorted by comment_count', () => {
      return request(app)
        .get("/api/articles?sort_by=comment_count")
        .expect(200)
        .then((res) => {
          const { articles } = res.body;
          console.log(articles)
          expect(articles).toBeInstanceOf(Array);
          expect(articles).toHaveLength(12);
          expect(articles).toBeSortedBy("comment_count", {
            descending: true,
          });

          articles.forEach((topic) => {
            expect(topic).toMatchObject({
              author: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(Number),
            });
          });
        });
    });
    it('should take multiple queries', () => {
      return request(app)
        .get("/api/articles?sort_by=article_id&topic=mitch&order=asc")
        .expect(200)
        .then((res) => {
          const { articles } = res.body;

          expect(articles).toBeInstanceOf(Array);
          expect(articles).toHaveLength(11);
          expect(articles).toBeSortedBy("article_id", {
            descending: false,
          });

          articles.forEach((topic) => {
            expect(topic).toMatchObject({
              author: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(Number),
            });
          });
        });
    });
    it('should return 400 for invalid sort_by field', () => {
      return request(app)
        .get("/api/articles?sort_by=invalid")
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe('Invalid sort_by field');
        });
    });
    it('should return 400 for invalid order field', () => {
      return request(app)
        .get("/api/articles?order=invalid")
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe('Invalid order field');
        });
    });
    it('should return an empty array if theres no matching topics', () => {
      return request(app)
        .get("/api/articles?topic=invalid")
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe('Invalid topic field');
        });
    });
    it('should return articles sorted by votes in ascending order', () => {
      return request(app)
        .get("/api/articles?sort_by=votes&order=asc")
        .expect(200)
        .then((res) => {
          const { articles } = res.body;

          expect(articles).toHaveLength(12);
          expect(articles).toBeSortedBy("votes", {
            descending: false,
          });
        });
    });
  });
  describe("Invalid Path", () => {
    it("should return 404 if the path doesn't exist", () => {
      return request(app).get("/api/banana").expect(404);
    });
  });
});
