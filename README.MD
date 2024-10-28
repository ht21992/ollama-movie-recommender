# Movie Recommender Application

This is a movie recommender application built using Django for the backend and React for the frontend. The application allows users to input their preferences for movie recommendations, including genre, country, release year, and favorite actor. It utilizes the Ollama model for generating recommendations.

## Features

- Real-time streaming response from the Ollama model.
- Responsive design that centers the form and displays the recommendation on the right side of the screen after submission.

## Installation

To run this project, you will need to install Ollama. Please follow the instructions below to set up your environment.

### Prerequisites

- Python 3.x
- Node.js and npm
- Ollama

### Setup Instructions

1. **Clone the repository:**

   ```bash
   git clone git remote add origin https://github.com/ht21992/ollama-movie-recommender.git
   ```

2. **Create a virtual environment and activate it**
    ```
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`

    ```

3. **Backend Setup (Django):**

    Navigate to the backend directory:

    ```
    cd backend

    pip install -r requirements.txt

    python manage.py migrate

    python manage.py runserver
    ```

4. **Frontend Setup (React):**

    Navigate to the backend directory:

    ```
    cd frontend

    npm install

    npm run dev

    ```

5. **Install Ollama**

    Follow the installation instructions for [Ollama](https://ollama.com/) to ensure it is properly set up and running.

    Ensure that the Ollama server is running on http://localhost:11434/api/generate


## Usage


- Open your web browser and go to http://localhost:5173

- Fill in the movie recommendation form and click on "Get Recommendation"

- Wait for the recommendation response, which will be displayed on the right side of the screen.

![image](https://github.com/user-attachments/assets/88ca4996-ed09-4b24-8c22-f62330d642fc)

![image](https://github.com/user-attachments/assets/3687f5ba-278e-4a65-8bf5-7951d0f7024c)
