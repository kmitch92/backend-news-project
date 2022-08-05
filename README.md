# Back-end News API Project - Read-Me

# https://backend-news-project.herokuapp.com/api

#### A news/blog backend api that is designed to allow for the retrieval of articles, posting of comments and voting behaviours by interacting with a PostgreSQL database.

Versions:

- `Node.js v18.3.0`
- `PostgreSQL v 12.11`

---

## **Setup**

### **Dependencies**

This project has a number of dependencies that it requires to run without error:

- `dotenv v16.0.0`
- `express v4.18.1`
- `pg v8.7.3`
- `pg-format v1.0.4 `

Any further development efforts would require the following dev dependencies:

- `husky v7.0.0`
- `jest v27.5.1`
- `jest-extended v2.0.0`
- `jest-sorted v1.0.14`
- `supertest v6.2.4`

### **Environment Variables**

To connect the seed and app files to the databases, environment variables need to be set locally.

- To do this, create two files named .env.development and .env.test in the project directory.

- Within each of those files, set PGDATABASE to equal nc_news and nc_news_test respectively.

  **.env.development** -> `PGDATABASE=nc_news`

  **.env.test** -> `PGDATABASE=nc_news_test`

### **Database Setup and Seeding**

To set up the database, use the script `npm run setup-dbs` to create both the test and dev databases. Use the script `npm run seed` to seed your working database (this will be either the development or test database depending on the value of `NODE_ENV`).

### **Testing**

This project uses the Jest testing framework, and was developed using TDD. With `jest`, `jest-sorted`, `jest-extended` and `supertest` installed as dev-dependencies, the script `npm test` will run all of the unit tests that were generated in the development of this project. These can be found in the `__tests__` directory, with separate testing suites for `utils.js` and `app.js`. Husky was used to hook the tests to git commits to prevent the release of malfunctioning code.

---
