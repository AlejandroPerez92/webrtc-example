# WebRTC playground project

## Instructions
1. Run Nexus wamp server with ``` docker-compose up ```
2. Run web client app with ``` npm run dev ```
3. Open two [Client]( http://localhost:5173/) tabs
4. Copy the ```Client uuid``` from one client and paste it into the ```Remote uuid``` field in the other client
5. Push ```Start Session``` button on the second client
6. The WebRTC communication will be established between thw two tabs