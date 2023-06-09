# scraper-parser

# Setup

- Requires Node 18 or above.
- Postgres Server
- RabbitMQ

---

## Installation

Clone the repository, install the dependencies and get started right away. Make sure you already have `nodejs`, `npm` and `yarn` installed in your system.

```sh
git clone https://github.com/Prabeshpd/scraper-parser.git
cd scraper parser
cp .env.example .env
yarn
```

---

## Environment Variables

Set environment variables in your env file:

---

## RabbitMQ Usage

Rabbit MQ is used for event based communication between the different node process. For now this node process consumes the file upload event and then it parses it and stores in the database. It then sends an event for scraping the database using the rabbit mq.

The reason for using this approach is to make the process independent and scalable. If there are lot of file uploads then the process can be run as cloud function and scale accordingly or we can run each process in a cluster.

---

## Scrape CSV Format

For now it only accpets the csv file. Csv file must be row separated for each keyword.
Example is in the [CSV FORMAT](./tags.csv)

## Start Application

To start the application in dev.

```bash
yarn start:dev
```

---

## Manage ENV Variable

To manage env variable we can have `vault` to store our database credentials and dynamic secrets that is needed to run the environment. We can have a vault agent to rotate our secret of vault and access the credentials from the vault api interface.
Or we can have a agent that populates our env file whenever a change is encountered in vault credentials.

---

## RELEASE CONVENTION

[Release Convention](./RELEASE.md)
