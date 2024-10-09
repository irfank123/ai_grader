# **AI-Powered Pre-Calculus Certification System** 🌱🧪

## **Overview** 📖

Welcome to our **AI-powered Pre-Calculus Certification System**! ✨ This project is designed to help students practice and certify their Pre-Calculus knowledge with the help of **AI**. Students can take exams, submit their answers (both written and spoken 🎤), and get instant feedback. It's like having your own personal math coach 👨‍🏫!

### **Features** 🥇
- Store a collection of **Pre-Calculus questions** 🧐.
- Students can submit **written answers** and **spoken explanations** 🖋️🎙️.
- Uses **speech-to-text conversion** to evaluate spoken answers 🎧.
- **AI grading** for both written and spoken responses ⭐️, with personalized feedback 💭.
- **Anti-cheating** features like **screen recording** and **LockDown Browser** (coming soon!) 🟡.

## **Project Structure** 🚀

The project is made up of several main components:

1. **MongoDB Database** 🧑‍💻: Stores questions, user responses, and related metadata.
2. **Backend API (Flask)** 🛠️: Handles question retrieval, answer submission, and response evaluation.
3. **Frontend (React)** 🌱: The user-friendly interface for students to take exams and submit their answers.

---

## **Database Design** 📃

We use **MongoDB** to manage questions and user responses. Below are the main collections:

### **Database Collections** 💻

1. **Questions Collection** 🧐
   - Stores all the Pre-Calculus questions along with their metadata.
   
   **Schema Example**:
   ```json
   {
     "_id": "ObjectId",
     "question_text": "Simplify the expression (2x^2 + 3x - 5) - (x^2 - x + 4)",
     "topic_id": "ObjectId",  // Reference to Topic collection
     "difficulty": "Medium",
     "question_type": "Long Answer",
     "correct_answer": "x^2 + 4x - 9",
     "tags": ["ObjectId1", "ObjectId2"],  // Reference to Tag collection
     "created_at": "Timestamp",
     "updated_at": "Timestamp"
   }
   ```

2. **Topics Collection** 📚
   - Defines various Pre-Calculus topics, like **Algebra** and **Trigonometry**.

   **Schema Example**:
   ```json
   {
     "_id": "ObjectId",
     "topic_name": "Algebraic Expressions",
     "description": "Questions related to simplifying algebraic expressions"
   }
   ```

3. **Tags Collection** 🌀
   - Contains tags for categorizing questions by difficulty, topic, and more.

   **Schema Example**:
   ```json
   {
     "_id": "ObjectId",
     "tag_name": "Medium",
     "tag_type": "Difficulty"
   }
   ```

4. **Responses Collection** 💬
   - Stores user responses, including **written answers**, **speech transcriptions**, and **AI evaluations**.

   **Schema Example**:
   ```json
   {
     "_id": "ObjectId",
     "user_id": "ObjectId",  // Reference to User collection
     "question_id": "ObjectId",  // Reference to Question collection
     "submitted_answer": "x^2 + 4x - 9",
     "speech_to_text": "I simplified both sides of the equation and combined like terms",
     "score": 8,
     "feedback": "Good understanding of algebraic simplification",
     "created_at": "Timestamp",
     "updated_at": "Timestamp"
   }
   ```

---

## **API Endpoints** 🛡️

Our **Flask** backend provides the following API endpoints:

1. **GET /questions**: Fetch a list of Pre-Calculus questions 📑.
2. **POST /responses**: Submit user responses to a specific question 📝.
3. **GET /responses/{user_id}**: Retrieve all responses for a user, including feedback and scores 🤖.

---

## **Tech Stack** 🤖🛠️🛠️

### **Backend** 🛍
- **Flask (Python)**: Manages API logic.
- **MongoDB**: Stores all data 📀.
- **Pandas**: Processes datasets for Pre-Calculus questions.
- **OpenAI GPT-4**: Evaluates written and verbal responses 🕵️‍♂️.

### **Frontend** 🌄
- **React**: Provides a dynamic and user-friendly interface 💻.
- **Canvas API**: Allows students to draw answers like on a whiteboard 🗒️.

### **AI and Speech Recognition** 🎧🤓
- **Google Speech-to-Text API**: Converts verbal explanations into text 💬.
- **GPT-4**: Evaluates and provides feedback 🏆.

---

## **Setup Instructions** 🔨🌃

### **1. Clone the Repository** 💲
```bash
git clone https://github.com/your-repository-url.git
cd your-repository
```

### **2. Backend Setup** 🧑‍🌐
- Install required dependencies:
  ```bash
  pip install -r requirements.txt
  ```
- Start the Flask backend:
  ```bash
  flask run
  ```

### **3. Frontend Setup** 🛠️
- Navigate to the frontend directory and install dependencies:
  ```bash
  cd frontend
  npm install
  ```
- Start the React frontend:
  ```bash
  npm start
  ```

### **4. MongoDB Setup** 📀
- Set up **MongoDB** locally or using **MongoDB Atlas**.
- Create collections: `Questions`, `Topics`, `Tags`, `Responses`.
- Insert sample data into collections.

### **5. Sample Data** 📜
Here's a Python script to populate the **Questions** collection with sample data:

```python
import pymongo
from datetime import datetime

client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["precalculus_db"]

questions = db["questions"]

questions.insert_many([
    {
        "question_text": "Simplify the expression (2x^2 + 3x - 5) - (x^2 - x + 4)",
        "topic_id": "ObjectId('6513f8b8b7b5c21c249f07d1')",
        "difficulty": "Medium",
        "question_type": "Long Answer",
        "correct_answer": "x^2 + 4x - 9",
        "tags": ["ObjectId('6513f8b8b7b5c21c249f07d3')", "ObjectId('6513f8b8b7b5c21c249f07d4')"],
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    }
])
```

### **6. Environment Variables** 🛡️
- Set up environment variables for **MongoDB** connection and **API keys** for services like **Google Speech-to-Text**.

---

## **Future Enhancements** 🚀
- **LockDown Browser Integration** 🔒: Secure proctoring to prevent cheating.
- **Live AI Proctoring** 🌉: Real-time detection of suspicious behaviors and follow-up questioning.
- **More Subjects** 🔢: Expand to additional mathematics topics!

---

## **Contributing** 💪
We love contributions! Feel free to **open a pull request** or **raise an issue** for discussion. Let's make this project better together!

---

Thanks for checking out the **AI-Powered Pre-Calculus Certification System**! Happy learning 🧘‍♂️🤓!

