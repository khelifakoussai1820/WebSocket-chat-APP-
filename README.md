# Gosra

> Talk freely. Connect instantly.

Gosra is a real-time messaging application built with **Next.js**, **PostgreSQL**, **Prisma**, and **WebSocket**. Users can create accounts, verify their email addresses, sign in, add friends, and exchange messages in real time.

## Features

* User registration and login
* Email verification with OTP
* Secure password hashing with `bcryptjs`
* Authentication with NextAuth.js
* Search for registered users
* Send, accept, and reject friend requests
* Friends list
* Create direct conversations
* Send and receive messages in real time
* Persistent message history
* Protected API routes
* Responsive user interface
* Separate WebSocket server

## Tech Stack

### Frontend and API

* Next.js 16
* React 19
* JavaScript
* Tailwind CSS v4
* React Hook Form
* GSAP

### Backend and Database

* Next.js Route Handlers
* PostgreSQL
* Prisma ORM 7
* `@prisma/adapter-pg`
* `pg`

### Authentication and Email

* NextAuth.js v4
* `bcryptjs`
* Nodemailer
* Gmail SMTP
* Email verification with OTP

### Real-Time Communication

* WebSocket
* `ws`
* Node.js WebSocket server

### Deployment

* Vercel — Next.js frontend and API
* Render — WebSocket server
* Neon — PostgreSQL database

## Project Structure

```text
Gosra/
├── apps/
│   └── web/
│       ├── app/
│       │   ├── (marketing)/
│       │   ├── (auth)/
│       │   │   ├── signin/
│       │   │   ├── signup/
│       │   │   └── verify-email/
│       │   ├── (app)/
│       │   │   ├── chat/
│       │   │   └── friends/
│       │   ├── api/
│       │   │   ├── auth/
│       │   │   │   └── [...nextauth]/
│       │   │   ├── users/
│       │   │   ├── friends/
│       │   │   └── conversations/
│       │   ├── generated/
│       │   │   └── prisma/
│       │   ├── layout.js
│       │   └── globals.css
│       │
│       ├── components/
│       │   ├── home/
│       │   ├── auth/
│       │   ├── chat/
│       │   ├── friends/
│       │   └── ui/
│       │
│       ├── hooks/
│       │   └── useWebSocket.js
│       │
│       ├── lib/
│       │   ├── prisma.js
│       │   ├── auth.js
│       │   ├── email/
│       │   ├── validations/
│       │   └── websocket/
│       │
│       ├── services/
│       │   ├── users.js
│       │   ├── otp.js
│       │   ├── friendships.js
│       │   ├── conversations.js
│       │   └── messages.js
│       │
│       ├── prisma/
│       │   ├── schema.prisma
│       │   └── migrations/
│       │
│       ├── socket/
│       │   └── src/
│       │       ├── server.js
│       │       ├── auth.js
│       │       └── handlers/
│       │           └── messages.js
│       │
│       ├── prisma7.config.ts
│       ├── middleware.js
│       ├── package.json
│       └── .env
│
└── packages/
    └── shared/
        ├── constants.js
        └── protocol/
            ├── messages.js
            └── types.js
```

## Application Flow

### Registration

```text
User submits signup form
        ↓
POST /api/auth/signup
        ↓
Validate form data
        ↓
Hash password
        ↓
Create user in PostgreSQL
        ↓
Generate OTP
        ↓
Send verification email
        ↓
Redirect to email verification
```

### Email Verification

```text
User enters OTP
        ↓
POST /api/auth/verify-email
        ↓
Check OTP and expiration
        ↓
Set emailVerified = true
        ↓
Delete verification record
        ↓
Redirect to signin
```

### Messaging

```text
User opens a conversation
        ↓
Load previous messages through REST API
        ↓
Connect to WebSocket server
        ↓
Join conversation room
        ↓
Send messages through WebSocket
        ↓
Broadcast messages to conversation members
        ↓
Persist messages in PostgreSQL
```

## Database Models

The application currently uses these Prisma models:

* `User`
* `EmailVerification`
* `FriendRequest`
* `Friendship`
* `Conversation`
* `ConversationMember`
* `Message`

### Relationships

* A user can send and receive friend requests.
* A friendship connects two users.
* A conversation contains multiple members.
* A conversation contains multiple messages.
* Every message belongs to a sender and a conversation.
* Email verification is linked to one user.

## Requirements

Before running the project, install:

* Node.js 22 or newer
* npm
* PostgreSQL, or a hosted PostgreSQL database such as Neon
* A Gmail account with an App Password

## Installation

Clone the repository:

```bash
git clone https://github.com/khelifakoussai1820/WebSocket-chat-APP-.git
```

Move into the web application:

```bash
cd WebSocket-chat-APP-/apps/web
```

Install dependencies:

```bash
npm install
```

## Environment Variables

Create a `.env` file inside `apps/web`:

```env
DATABASE_URL="your_postgresql_connection_string"

NEXTAUTH_SECRET="your_nextauth_secret"
NEXTAUTH_URL="http://localhost:3000"

GMAIL_USER="your_gmail_address@gmail.com"
GMAIL_APP_PASSWORD="your_gmail_app_password"

NEXT_PUBLIC_WS_URL="ws://localhost:3001"
```

### Environment Variable Description

| Variable             | Description                            |
| -------------------- | -------------------------------------- |
| `DATABASE_URL`       | PostgreSQL connection string           |
| `NEXTAUTH_SECRET`    | Secret used by NextAuth.js             |
| `NEXTAUTH_URL`       | URL of the Next.js application         |
| `GMAIL_USER`         | Gmail address used to send OTP emails  |
| `GMAIL_APP_PASSWORD` | Google App Password used by Nodemailer |
| `NEXT_PUBLIC_WS_URL` | WebSocket server URL                   |

Never commit `.env` or expose database credentials, NextAuth secrets, or Gmail App Passwords publicly.

## Gmail App Password

The application uses Gmail SMTP to send verification emails.

To create an App Password:

1. Open your Google Account.
2. Go to **Security**.
3. Enable **2-Step Verification**.
4. Open **App passwords**.
5. Create an App Password for Gosra.
6. Add the generated password to `GMAIL_APP_PASSWORD`.

Use the App Password instead of your normal Gmail password.

## Database Setup

Generate the Prisma client:

```bash
npx prisma generate
```

Apply migrations in development:

```bash
npx prisma migrate dev
```

Apply existing migrations in production:

```bash
npx prisma migrate deploy
```

Format the Prisma schema:

```bash
npx prisma format
```

Do not run `prisma migrate reset` on a production database because it deletes existing data.

## Run the Application Locally

Start the Next.js application:

```bash
npm run dev
```

The frontend and API will be available at:

```text
http://localhost:3000
```

In another terminal, start the WebSocket server:

```bash
npm run socket
```

The WebSocket server will run on:

```text
ws://localhost:3001
```

## Available Scripts

```bash
npm run dev
```

Starts the Next.js development server.

```bash
npm run build
```

Generates the Prisma client and builds the Next.js application.

```bash
npm run start
```

Starts the production Next.js server.

```bash
npm run socket
```

Starts the WebSocket server.

```bash
npm run lint
```

Runs ESLint.

```bash
npx prisma generate
```

Generates the Prisma client.

```bash
npx prisma migrate dev
```

Creates and applies a development migration.

```bash
npx prisma migrate deploy
```

Applies existing migrations in production.

## API Routes

### Authentication

```text
POST /api/auth/signup
POST /api/auth/verify-email
GET  /api/auth/session
POST /api/auth/signout
```

### Users

```text
GET /api/users/search?q=...
```

### Friends

```text
GET  /api/friends
POST /api/friends/request
POST /api/friends/request/:id/accept
POST /api/friends/request/:id/reject
```

### Conversations

```text
GET  /api/conversations
POST /api/conversations
```

### Messages

```text
GET  /api/conversations/:id/messages
POST /api/conversations/:id/messages
```

All protected routes require an authenticated session.

## WebSocket Events

The WebSocket server supports conversation-based messaging.

### Join a Conversation

```json
{
  "type": "join_conversation",
  "conversationId": 1
}
```

### Send a Message

```json
{
  "type": "send_message",
  "conversationId": 1,
  "content": "Hello!"
}
```

### Receive a Message

```json
{
  "type": "new_message",
  "message": {
    "id": 1,
    "conversationId": 1,
    "senderId": 2,
    "content": "Hello!",
    "createdAt": "2026-09-17T12:00:00.000Z"
  }
}
```

## Security Notes

* Passwords are hashed before being stored.
* Protected routes verify the current session.
* Users cannot access conversations they do not belong to.
* Users cannot send messages to conversations they are not members of.
* Friend requests prevent self-requests.
* OTP codes expire after a limited period.

## Future Improvements

* Password reset flow
* Resend OTP functionality
* Message delivery status
* Online and offline presence
* Read receipts
* Message deletion and editing
* Image and file sharing
* Push notifications
* Better WebSocket token authentication
* Redis adapter for multiple WebSocket instances
* Automated tests
* Rate limiting

## Deployed version :
https://gosra-delta.vercel.app/

This project is created for educational and demonstration purposes.
