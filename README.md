# bookings-managment

## Technologies used

Nodejs v14.15
KOA js
MongoDB
Redis server (manage queue)
Docker and docker compose

---

## API Documentation

In docs folder contains postman collection to be imported and be tested.

---

## Improvements to be done

It was done in a short deadline and I mapped some topics that could be improved for both projects:
request and response validation (using Yup maybe?)
improve dependency injection (I had some issues using InversifyJS with koa)
Maybe add an ORM for Mongo (this project is quite simple for it).
Improve logs and not handled exceptions

---

## Personal decision

I decided to use Redis Server instead of SQS, because I don't have too much experience running SQS locally, to solve the problem of doing the same thing, I am using Redis Server to handle a queue.

---

## Infrastructure

For this project we have 4 services running in docker-compose server:

**Manager API** - service that can manage restaurant information and reservations

**Reservation** - service manages to create reservations and list availability for a restaurant

**MongoDB** - database that save Restaurant and Reservations

**Redis** - responsible for manage wait list

---

## How to use

Assuming you have docker and docker compose in your machine, in root folder run:

```sh
docker-compose up --build
```

It will make ports 8080 (Reservation Api), 8081 (Manager API), 27017 (MongoDB) and 6379 (Redis) busy in your machine, make sure you don't have any service running with this ports.

---

After the 4 services running properly and it is your first time, you need to create a restaurant using manager API:

```sh
# Access Postman collection in Manager/Manager - add restaurant
POST - http://localhost:8081/restaurants
-d {"open": 9,"close": 21,"tables": 2}
```

---

You can check the availability for this restaurant using:

```sh
# Access Postman collection in Reservation/Reservation - get availability
GET http://localhost:8080/reservations/restaurants/:id/availability
```

### Limitation: currently this endpoints is looking for current date

---

To create a reservation, you can use Manager or Reservation API:

```sh
# Access Postman collection in Reservation/Reservation - add reservation
POST - http://localhost:8080/reservations/restaurants/:id
-d {"from": "2022-04-07T09:00:00.000Z","to": "2022-04-07T10:00:00.000Z"}
```

If you define two tables for the restaurant and try to create three reservations for the same time slot, the third reservation will be send to wait list (Redis). This wait list will be **dequeue** in case a reservation for the same time slot be removed.

---

