
📚 Serverless Book Shop Project
A full-stack application for managing a book inventory, featuring a modern React frontend and a Node.js backend deployed via the Serverless Framework on AWS.

📁 Repository Structure
React-Frontend/: The public-facing user interface. Built with React and designed for fast, responsive book browsing.

Sereverless-backend/: The REST API layer.

services/: Business logic and Lambda handlers.

db/: MongoDb configuration and data access layers.

client/: Third-party integrations and AWS SDK clients.

🛠 Management & Administration (Private)
The system includes a dedicated dashboard for adding and managing books in the inventory.

Internal Tooling: To maintain security, the management interface is hosted at a private URL.

Access: Authorized developers should store this URL in their local .env file under the key REACT_APP_ADMIN_URL.

Capabilities: This interface allows for full CRUD operations (Create, Read, Update, Delete) on the book database.

🚀 Getting Started
1. Backend Setup
Navigate to Sereverless-backend/.

Install dependencies: npm install.

Copy .env.example to .env and add your AWS credentials.

Deploy: serverless deploy.

2. Frontend Setup
Navigate to React-Frontend/.

Install dependencies: npm install.


Run locally: npm start.

🌐 Live Links
Public Website: https://erezamsalem.link/

Admin Dashboard: [Your private URL for dedicated dashboard]