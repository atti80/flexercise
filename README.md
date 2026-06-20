# Flexercise

## 0. Dev Container

Open the folder in VS Code and reopen that in Dev Container.  
The initialization can take some time, please be patient.  

## 1. Tooling

Install the latest 8.0.x dotnet-ef tool.

```sh
dotnet tool install --global dotnet-ef --version 8.0.23
```

## 2. Backend

Apply the initial migration and start the backend.

```sh
cd ./backend/MesApi/
dotnet ef database update
dotnet watch
```

## 3. Frontend

Start the frontend.

```sh
cd ./frontend/mes-app/
yarn start
```

## 4. Check the project in a browser

```sh
# open this link in a browser
http://localhost:3000/
```
