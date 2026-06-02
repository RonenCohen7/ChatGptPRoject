# ChatGPT Project – Full-Stack Overview

The **ChatGPT Project** is a full-stack web application that lets a user create conversations, send messages, and receive AI-generated answers from OpenAI. A **React + TypeScript** client talks to a **Python FastAPI** backend, which stores conversations and messages in **MongoDB** and forwards chat history to the **OpenAI API** to generate assistant replies.

## Tech Stack

**Frontend:** React 19, TypeScript, Vite, Axios, React Router DOM

**Backend:** Python, FastAPI, Uvicorn, Pydantic, PyMongo (MongoDB), OpenAI SDK, python-dotenv

**Database:** MongoDB

**Environment:** `.env` from `.env.example` (never commit `.env`)

## Architecture

The system has two parts that communicate over a REST API:

- **Frontend (`Frontend/ChatGpt`)** – A Vite single-page app. Services (`ConversationService`, `chatService`) call the backend with Axios; URLs are centralized in `src/Utils/AppConfig.ts`.
- **Backend (`Backend`)** – A FastAPI server (port **4000**). Controllers expose REST routes, services hold the business logic, a small data-access layer (`Dal`) wraps PyMongo, and `OpenAiService` calls OpenAI (`gpt-4o-mini`).

CORS is configured on the backend to allow the Vite dev origin (`http://localhost:5173`).

### API routes

| Method | Route | Description |
| ------ | ----- | ----------- |
| `GET`  | `/api/conversation`        | List all conversations |
| `GET`  | `/api/conversation/{_id}`  | Get one conversation |
| `POST` | `/api/conversation`        | Create a conversation |
| `DELETE` | `/api/conversation/{_id}` | Delete a conversation |
| `GET`  | `/api/chat/{_id}`          | Get messages of a conversation |
| `POST` | `/api/chat`                | Send a message and get the assistant reply |

## Repository layout

```
ChatGptProject/
├── Backend/
│   ├── src/
│   │   ├── app.py                  # FastAPI app, CORS, routers, uvicorn entry (port 4000)
│   │   ├── controllers/            # chat_controller, conversation_controller
│   │   ├── services/               # conversation_service, message_service, service_openai
│   │   ├── models/                 # conversation_model, message_model (Pydantic)
│   │   ├── middleware/             # exception_handler, logger_middleware
│   │   └── utils/                  # app_config (.env), dal (MongoDB)
│   └── requirements.txt
├── Frontend/
│   └── ChatGpt/                    # React + Vite SPA
│       └── src/
│           ├── main.tsx, App.tsx
│           ├── components/         # About, PageArea/Home
│           ├── Models/             # ConversationModel, MessageModel
│           ├── Service/            # ConversationService, chatService
│           └── Utils/              # AppConfig (API URLs), Http
├── Database/
├── .env.example
├── .gitignore
└── README.md
```

## Prerequisites

- Python 3.12+ (project developed on 3.14)
- Node 18+ and npm
- MongoDB running locally (`mongodb://localhost:27017`)
- An OpenAI API key

## Environment setup

From the repository root, create your `.env` from the template and fill in your own values:

```bash
cp .env.example .env
```

`.env` keys:

- `CONNECTION_STRING` – MongoDB URI (e.g. `mongodb://localhost:27017`)
- `DB_NAME` – database name (e.g. `ChatGptDB`)
- `OPENAI_API_KEY` – your OpenAI key

> ⚠️ Never commit your real `.env`. If a key was ever exposed, rotate it in the OpenAI dashboard.

## Local development

### Backend (FastAPI, port 4000)

```bash
cd Backend
python -m venv env
source env/bin/activate          # Windows: env\Scripts\activate
pip install -r requirements.txt
cd src
python app.py                    # serves on http://localhost:4000 (reload enabled)
```

Make sure MongoDB is running before you start the server.

### Frontend (Vite, port 5173)

```bash
cd Frontend/ChatGpt
npm install
npm run dev                      # open http://localhost:5173
```

The frontend expects the backend at `http://localhost:4000` (see `src/Utils/AppConfig.ts`).

## End users vs. developers

Anyone who only **uses** the app in the browser does not run any commands from this repository — the setup steps above are **for developers** building or self-hosting the stack.

## Developer

Developed by **Ronen Cohen**.
