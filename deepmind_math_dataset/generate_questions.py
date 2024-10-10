import csv
import pymongo
import os
from dotenv import load_dotenv
import logging

# Configure logging to track the progress and errors, including MongoDB connection details
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Load .env file from the root of the repository
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env'))

# Fetch MongoDB URI from the environment variable
MONGO_URI = os.getenv("MONGO_URI")

# Check if the MongoDB URI is properly loaded from .env
if not MONGO_URI:
    raise ValueError("MongoDB connection string is not defined in the environment variables")

# Print out the connection string for debugging
logging.info(f"MongoDB Connection String: {MONGO_URI}")

# Function to generate sample data (here 300 questions)
def generate_questions(num_questions=300):
    logging.info("Generating questions...")
    questions = []
    for i in range(1, num_questions + 1):
        question = f"Solve {i}*x = {i*2} for x."
        answer = i * 2 // i  # Simple logic, customize as needed
        questions.append({
            "question": question,
            "answer": answer,
            "module": "algebra__linear_1d"  # Example module name
        })
    logging.info(f"{num_questions} questions have been generated.")
    return questions

# Function to write questions to a CSV file (optional)
def write_questions_to_csv(questions, csv_filename='generated_questions.csv'):
    logging.info(f"Writing {len(questions)} questions to {csv_filename}...")
    with open(csv_filename, mode='w', newline='') as file:
        writer = csv.DictWriter(file, fieldnames=['question', 'answer', 'module'])
        writer.writeheader()
        writer.writerows(questions)
    logging.info(f"{len(questions)} questions have been written to {csv_filename}.")

# Function to load data to MongoDB
def load_data_to_mongodb(csv_file):
    logging.info("Connecting to MongoDB Atlas...")

    try:
        # Initialize MongoDB client with default settings (no SSL disabling)
        client = pymongo.MongoClient(
            MONGO_URI,
            serverSelectionTimeoutMS=30000  # Increase timeout to 30 seconds for connection
        )
        
        # Output the current connection string for debugging
        logging.info(f"Attempting connection to MongoDB using: {MONGO_URI}")
        
        # Select the database and collection
        db = client["ai-grader"]  # Ensure this matches your MongoDB database name
        collection = db["Questions"]  # Ensure this matches your collection name
        
        # Try to ping the server to see if connection is established
        logging.info("Pinging MongoDB server to check connection...")
        client.admin.command('ping')
        
        logging.info("Connected to MongoDB successfully!")

        # Read the CSV and insert the data into MongoDB
        with open(csv_file, 'r') as file:
            reader = csv.DictReader(file)
            data = list(reader)
            if data:
                result = collection.insert_many(data)
                logging.info(f"Inserted {len(result.inserted_ids)} documents into MongoDB.")
            else:
                logging.info("No data found in the CSV to insert.")

    except pymongo.errors.ServerSelectionTimeoutError as e:
        logging.error(f"Connection to MongoDB timed out: {e}")
    except pymongo.errors.PyMongoError as e:
        logging.error(f"Error inserting data into MongoDB: {e}")
    finally:
        client.close()

# Main script logic
if __name__ == "__main__":
    csv_filename = 'generated_questions.csv'

    # Generate questions
    questions = generate_questions(num_questions=300)

    # Write questions to CSV for a backup (optional)
    write_questions_to_csv(questions, csv_filename=csv_filename)

    # Load data to MongoDB
    load_data_to_mongodb(csv_filename)
