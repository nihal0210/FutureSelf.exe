# Shadow Slayer – Future You Simulator
## Setup Guide

Follow these steps to get the project running locally.

### 1. Prerequisites
- Python 3.10+
- A Google Account (for OAuth and AI access)

### 2. Get API Keys

#### Google OAuth 2.0 Client ID
1. Go to the [Google Cloud Console](https://console.cloud.google.com).
2. Create a new project (e.g., "Shadow Slayer").
3. Go to **APIs & Services > Credentials**.
4. Click **Create Credentials** > **OAuth client ID**.
5. If prompted, configure the OAuth consent screen (Internal or External, add your email as a test user if External).
6. Application Type: **Web application**.
7. Authorized JavaScript origins: `http://localhost:5000`
8. Authorized redirect URIs: `http://localhost:5000/auth/callback`
9. Copy your **Client ID** and **Client Secret**.

#### Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Click **Create API Key**.
3. Copy the generated key.

### 3. Environment Variables
1. Copy `.env.example` to a new file called `.env` in the root folder.
2. Fill in the keys you copied:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `GEMINI_API_KEY`
   - Generate a random string for `FLASK_SECRET_KEY` (e.g., `my-super-secret-key`).

### 4. Install & Run
**On Windows:**
Double-click `run.bat`. It will create a virtual environment, install dependencies, and start the app.

**Manual setup (any OS):**
```bash
python -m venv venv
# Activate venv:
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate

pip install -r requirements.txt
flask run --debug
```

### 5. Access
Open your browser to `http://localhost:5000`.
