# Frontend for Architecture Chatbot (Archi Bot)
This project implements a Backend-for-Frontend (BFF) in Node.js and a frontend that runs in the browser. The frontend invokes an API exposed by the BFF. The backend invokes the API exposed by the RAG service.

Node.js was chosen because it has mature libraries for Single Sign-On (SSO). Streamlit is a very new project and is not suitable for production according to its authors.

## Base Project:
https://github.com/tyleroneil72/chat-bot

This project was used as a base.

## OIDC/OAuth Support
To support login with the global AD, passport was used with the openid-client plugin. Cookies were used between the frontend running in the browser and the BFF using the express-session library. This library only stores a session ID in the cookie and the data in memory. In case of needing to scale to a large number of users, it is necessary to add and configure a session database.

In case of needing to use tokens to invoke the APIGW from the frontend, small changes are needed that are commented out. Modify the client to send the token in the Authorization header, add the cookie with the token in the backend.
