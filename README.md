# Lead Management App

This project consists of two parts: **Backend (Node.js)** and **Frontend (Angular)**.

---

## 🚀 Backend Setup

1. Open the file:  
   ```bash
   ./config/config.json
   ```
   and update the `ipserver` value with your server IP:  
   ```json
   "ipserver": "your-IP"
   ```

2. Install dependencies:  
   ```bash
   npm install
   ```

3. Start the server:  
   ```bash
   node index.js
   ```

---

## 💻 Frontend Setup (Angular)

1. Open the file:  
   ```bash
   ./src/app/services/lead.service.ts
   ```
   and update the API URL with your backend server IP and port:  
   ```ts
   private apiUrl = 'http://your-IP:your-port';
   ```

2. Install dependencies:  
   ```bash
   npm install
   ```

3. Run the Angular application:  
   ```bash
   ng serve
   ```

   The application will be available at:  
   ```
   http://localhost:4200
   ```

---

## 📌 Notes
- Make sure the **backend server** is running before starting the frontend.
- Replace `your-IP` and `your-port` with the actual server information.
