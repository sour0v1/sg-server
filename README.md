This repository contains the Express.js server code for [Swapnashray-Granthagar](https://github.com/sour0v1/sg-client). The platform allows users to explore, search, and borrow books. The backend is managed using Express and MongoDB, with JWT used for authentication.

## How to use
  ### Prerequisites
  Make sure you have the following installed: 
   - **Node.js**
   - **npm**
   - **MongoDB**(local or cloud)
  ### Installation
  **1. Clone the repository:**
  ```
 git clone https://github.com/sour0v1/sg-server.git
 cd sg-server
  ```
 **2. Install dependencies:**
 ```
npm install
 ```
### Environment Variables
Create a **.env** file in the root directory and add the following environment variables:
```
MONGODB_USER=your_mongodb_user_name
MONGOD_PASSWORD=your_mongodb_password
JWT_SECRET=your_jwt_secret_key
```
### Running the server
```
node index.js
```
The server will automatically restart when changes are detected, and it will run on **http://localhost:5000** by default.

## Technology Used
- **Backend:** Express.js
- **Database:** MongoDB
- **Authentication:** JWT(JSON Web Tokens)
- **Environment Variables:** dotenv

  
