# Squigl v2

Squigl v2 is the next evolution of my Twitter/X clone, rebuilt from the ground up with a modern tech stack. This time, I’ve split it into two parts: a
**Django REST Framework** back-end for a robust API and a **React** front-end for a seamless user experience. Built on the foundation of my [Banana repository](https://github.com/paulio11/banana).

[Squigl v1](https://github.com/paulio11/P4-Squigl-Twitter-Clone)

## Features

On top of everything in [Banana](https://github.com/paulio11/banana), Squigl v2 includes:

- Post creation (image and/or text)
- Automatic hashtag, user profile links, and URL generation in posts
- Post editing and deletion
- Post liking
- Replying, editing, and deleting replies
- Reply liking
- Individual post pages with replies
- User profile pages
- User following and unfollowing
- Private user-to-user messaging
- Message read/unread status
- Message deletion
- Trending hashtags calculated from posts
- Listing unfollowed users
- Post and user searching
- User profile customisation

### Upcoming Features

To make v2 have feature parity with v1 I still need to add the following:

- Post reporting
- Moderation dashboard
- Optimised views for mobile and tablet

## Deployment

Instructions are for macOS.

### Requirements

- Node.js
- Python

### Backend Setup

1. Open the backend directory in your terminal.
2. Create and activate a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip3 install -r requirements.txt
   ```
4. Apply database migrations:
   ```bash
   python3 manage.py makemigrations dm posts accounts
   python3 manage.py migrate
   ```
5. (Optional) Create an admin user:
   ```bash
   python3 manage.py createsuperuser
   ```
6. Start the server:
   ```bash
   python3 manage.py runserver
   ```

### Frontend Setup

1. Open the frontend directory in your terminal.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm run dev
   ```
