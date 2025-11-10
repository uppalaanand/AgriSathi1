Commands To Run AgriSmart:

1. Download Folder from drive.
2. Open Folder in VS Code.

1.backend:
	cd backend
	npm install
	cd src
	node server.js
Open New Terminal

2.ml-service:
	cd ml-service
	python -m venv venv
	venv\Scripts\activate
	pip install -r requirements.txt
	python app.py
Open new Terminal

3.frontend:
	cd frontend
	npm install
	npm start

Note : If Any API Error 
1. Go To .env files and replace GEMINI_API with your api key and try to run again. 
	
	
