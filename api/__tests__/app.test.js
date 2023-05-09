const request = require("supertest");

const testData = require("../../db/data/test-data/index");

const db = require("../../db/connection.js");
const app = require("../app");

const seed = require("../../db/seeds/seed");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("/api", () => {
  describe("get /api/topics", () => {
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
  describe("invalid path", () => {
    it("should return 404 if the path doesn't exist", () => {
      return request(app).get("/api/banana").expect(404);
    });
  });
});