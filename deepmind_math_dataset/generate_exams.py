import pymongo
import os
from dotenv import load_dotenv
import logging
import random

# Configure logging to track progress and errors
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Load .env file from the root of the repository
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env'))

# Fetch MongoDB URI from the environment variable
MONGO_URI = os.getenv("MONGO_URI")

# Check if the MongoDB URI is properly loaded from .env
if not MONGO_URI:
    raise ValueError("MongoDB connection string is not defined in the environment variables")

logging.info(f"MongoDB Connection String: {MONGO_URI}")

# Function to fetch questions by module from MongoDB
def fetch_questions_by_module():
    logging.info("Fetching all available questions by module from MongoDB...")
    try:
        client = pymongo.MongoClient(MONGO_URI)
        db = client["ai-grader"]
        collection = db["Questions"]
        
        # Aggregate questions by module
        pipeline = [
            {
                "$group": {
                    "_id": "$module",
                    "questions": {"$push": "$$ROOT"}
                }
            }
        ]
        questions_by_module = list(collection.aggregate(pipeline))
        
        logging.info(f"Found {len(questions_by_module)} different modules with questions.")
        return questions_by_module

    except pymongo.errors.PyMongoError as e:
        logging.error(f"Error fetching questions from MongoDB: {e}")
    finally:
        client.close()

# Function to generate exams with questions from multiple modules
def generate_exams(num_exams=5, questions_per_exam=10):
    logging.info(f"Generating {num_exams} exams with {questions_per_exam} questions each, evenly distributed across modules...")
    
    # Fetch questions grouped by module
    questions_by_module = fetch_questions_by_module()
    
    if not questions_by_module:
        logging.error("No questions found in the database.")
        return []
    
    exams = []
    
    for exam_num in range(1, num_exams + 1):
        exam_questions = []
        
        # Calculate how many questions to select per module
        modules_count = len(questions_by_module)
        questions_per_module = max(1, questions_per_exam // modules_count)
        
        # Distribute questions across modules
        for module_data in questions_by_module:
            module_questions = module_data['questions']
            
            # If the module has fewer questions than needed, select all of them
            if len(module_questions) < questions_per_module:
                selected_questions = module_questions
            else:
                # Randomly sample the required number of questions from the module
                selected_questions = random.sample(module_questions, questions_per_module)
            
            exam_questions.extend(selected_questions)
        
        # Randomly pick more questions if there are still slots remaining after balancing
        remaining_slots = questions_per_exam - len(exam_questions)
        if remaining_slots > 0:
            extra_questions = random.sample(sum([module_data['questions'] for module_data in questions_by_module], []), remaining_slots)
            exam_questions.extend(extra_questions)
        
        # Randomize the order of the questions in the exam
        random.shuffle(exam_questions)
        
        # Prepare the exam document to insert into the database
        exam = {
            "subject_name": "Mathematics",
            "questions": [{"_id": question["_id"], "module": question["module"]} for question in exam_questions]
        }
        exams.append(exam)
        
        logging.info(f"Exam {exam_num} generated with {len(exam_questions)} questions.")
    
    return exams

# Function to insert generated exams into MongoDB
def insert_exams_into_mongodb(exams):
    logging.info("Connecting to MongoDB Atlas to insert exams...")

    try:
        client = pymongo.MongoClient(MONGO_URI)
        db = client["ai-grader"]
        exams_collection = db["Exams"]
        
        if exams:
            result = exams_collection.insert_many(exams)
            logging.info(f"Inserted {len(result.inserted_ids)} exams into MongoDB.")
        else:
            logging.warning("No exams to insert into MongoDB.")

    except pymongo.errors.PyMongoError as e:
        logging.error(f"Error inserting exams into MongoDB: {e}")
    finally:
        client.close()

# Main script logic
if __name__ == "__main__":
    logging.info("Generating exams with questions from different modules...")
    
    # Generate exams
    exams = generate_exams(num_exams=5, questions_per_exam=10)

    # Insert generated exams into MongoDB
    insert_exams_into_mongodb(exams)
