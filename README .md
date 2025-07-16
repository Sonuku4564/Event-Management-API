#  Event Registration API

A RESTful API for managing events, user registrations, and related operations using **Node.js**, **Express**, **Prisma**, and **PostgreSQL**.
## Features

- ✅ Create events
- ✅ Fetch event details with registered users
 - ✅ Register users for events
- ❌ Prevent duplicate registrations
- 🚫 Disallow registration for full or past events
- 🔄 Cancel a user registration
- ⏳ List upcoming events (sorted by date and location)
- 📊 View event statistics (capacity usage)



## Tech Stack
- **Node.js**
- **Express.js**
- **Prisma ORM**
- **PostgreSQL**
- **Postman**
- **dotenv**
## Project Setup Instructions

### 1. Clone the Repo

```bash
https://github.com/Sonuku4564/Event-Management-API.git
cd Event-Management-API
```
### 2. Install Dependencies

```bash
npm install
```
### 3. Configure Environment

```bash
DATABASE_URL=postgresql://user:password@localhost:5432/eventdb
PORT=3000

```
### 4. Prisma Setup

```bash
npx prisma generate
npx prisma migrate dev --name init


```
### 5. Start the Server

```bash
npm Start

```
## API Reference

###  Base URL
```bash
http://localhost:3000/api
```

###  API Endpoints

### 📌 1. Create Event

**POST** `/events/create`

Creates a new event.

#### Request Body (JSON):
```json
{
  "title": "Event Title",
  "dateTime": "YYYY-MM-DDTHH:mm:ss[.s...]Z",
  "location": "Event Address",
  "capacity": 200
}
```
### 📌2. Create New User

**POST**  `/user/create`

Creates a new user.

#### Request Body (JSON):
```json
{
  "name": "name",
  "email": "name@email.com"
}
```
### 📌 3. Get Event Details

**GET**  `/events/details/:id`

Fetches full event data along with the list of registered users.



### 📌 4. Register to Event

**POST**  ` /events/register`

Registers a user for a specific event.

#### Request Body (JSON):
```json
{
  "userId": 2,
  "eventId": 2
}

```

### 📌 5. Cancel Registration

**DELETE**  `/events/cancel`

Cancels a user's registration for an event.



### 📌 6. Upcoming Events

**GET**  `/events/Upcoming`

- Returns a list of future events, sorted:

- First by dateTime (ascending)

- Then by location (alphabetically)



### 📌 7. Event Statistics

**GET**  `/events/stats/:id`

- Returns statistics for a specific event.

Response includes:
- Total registrations

- Remaining capacity

- Percentage of capacity used

## License

[MIT License](https://choosealicense.com/licenses/mit/)

