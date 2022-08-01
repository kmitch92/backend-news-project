# ReadMe

## Setting up environment variables.

To connect the seed and app files to the databases, environment variables need to be set locally.

- To do this, create two files named .env.development and .env.test in the project directory.

- Within each of those files, set PGDATABASE to equal nc_news and nc_news_test respectively.

  **.env.development** -> `PGDATABASE=nc_news`

  **.env.test** -> `PGDATABASE=nc_news_test`

---
