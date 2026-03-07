# TaskManagerFrontend

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.1.1.

A frontend web application for managing tasks.
This application allows users to register, log in, create tasks, edit them, and manage them through an interactive dashboard.

⚠️ This frontend **requires the backend API** to run correctly:

➡ Backend repository: [https://github.com/lukoq/task-manager-backend](https://github.com/lukoq/task-manager-backend)

## Features

* **User authentication** – users can register, log in, and manage their account.
* **Task management** – create, edit, and update task status.
* **Task table view** – tasks are displayed in a clear table layout.
* **Filtering and searching** – quickly filter and search tasks.
* **Statistics dashboard** – visual charts showing task-related statistics.
* **User profile management** – view and edit user profile information.
* **Dark mode** – switch between light and dark theme.


## Development server

This frontend requires the backend API to function.

1. Follow the setup instructions in the backend README. ⬆️
  
2. Start the backend server before running the frontend.

3. Clone the frontend repository:

```bash
git clone https://github.com/lukoq/task-manager-frontend.git
```

4. Run the app

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

---

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## License

This project is licensed under the MIT License.


