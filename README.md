# ✅ Full Stack Todo App — React + .NET

A beginner-friendly full stack project with:
- **Frontend**: React (Vite)
- **Backend**: .NET 8 Web API

---

## 📁 Project Structure

```
fullstack-todo/
├── backend/
│   └── TodoApi/
│       ├── TodoApi.csproj        ← .NET project file
│       ├── Program.cs            ← App entry point (CORS, Swagger)
│       ├── Models/
│       │   └── TodoItem.cs       ← Data model
│       └── Controllers/
│           └── TodosController.cs ← REST API (GET, POST, PUT, DELETE)
│
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── main.jsx              ← React entry point
        ├── App.jsx               ← Main UI component
        ├── api.js                ← All fetch() calls to the backend
        └── index.css             ← Styling
```

---

## 🚀 How to Run

### Step 1 — Start the Backend (.NET API)

```bash
cd backend/TodoApi
dotnet run
```

The API will start at: `http://localhost:5000`

You can test the API in your browser at: `http://localhost:5000/swagger`

---

### Step 2 — Start the Frontend (React)

Open a **new terminal**:

```bash
cd frontend
npm install
npm run dev
```

The app will open at: `http://localhost:5173`

---

## 📡 API Endpoints

| Method | URL              | What it does           |
|--------|------------------|------------------------|
| GET    | /api/todos       | Get all todos          |
| GET    | /api/todos/{id}  | Get one todo by ID     |
| POST   | /api/todos       | Create a new todo      |
| PUT    | /api/todos/{id}  | Update a todo          |
| DELETE | /api/todos/{id}  | Delete a todo          |

---

## 💡 Concepts You'll Learn

- **React Hooks**: `useState`, `useEffect`
- **Fetch API**: Making HTTP requests from React
- **REST API**: Building endpoints with .NET
- **CORS**: Allowing cross-origin requests
- **CRUD**: Create, Read, Update, Delete operations

---

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [.NET 8 SDK](https://dotnet.microsoft.com/download)
