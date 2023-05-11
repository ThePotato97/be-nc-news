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
  describe("Invalid Path", () => {
    it("should return 404 if the path doesn't exist", () => {
      return request(app).get("/api/banana").expect(404);
    });
  });
});
