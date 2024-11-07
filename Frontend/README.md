# 🎓 AI Grader Frontend 📚

## Project Description

AI Grader is an innovative web application designed to assist students in practicing math problems and receiving instant feedback. This frontend prototype demonstrates the user interface for question practice and feedback display, simulating integration with a future AI-powered backend. The application is tailored for college-level precalculus courses, providing a robust platform for students to enhance their mathematical skills through interactive practice and immediate, personalized feedback.

## 🖼️ Wireframe

Our low-fidelity wireframe for this project can be viewed here: [Figma Wireframe Link](https://www.figma.com/design/etNkQhgrGFQjpt25ygbWVA/AI-Grader-PPDS?node-id=0-1\&t=G66ZvsqClFRqhnGK-1)

## 🧩 Component Architecture

Our application is built using React and Next.js, with the following major components:

1. **PracticePage**: The main component for displaying questions and handling user interactions. It manages the state of the current question and user progress.
2. **FeedbackPage**: Displays comprehensive feedback and solutions after a question is submitted. This component is crucial for the learning process, providing detailed explanations and personalized suggestions.
3. **Question**: Renders individual math questions, supporting various question types including multiple-choice, short answer, and equation input.
4. **FeedbackContent**: Displays grade and detailed feedback for a submitted answer, including written and spoken feedback to cater to different learning styles.
5. **Solution**: Shows the correct solution for a question, with step-by-step explanations to aid understanding.
6. **Canvas**: Provides an interactive drawing area for users to work out problems, supporting both mouse and touch inputs for versatility.
7. **QuestionNavigation**: Allows users to navigate between questions, with options to skip or flag questions for later review.
8. **SubmitButton**: Handles question submission, with error checking and confirmation prompts to prevent accidental submissions.
9. **ModeToggle**: Toggles between practice and exam modes, adjusting the user interface and functionality accordingly.
10. **AudioRecorder**: *(In Development)* Will allow users to record verbal explanations of their problem-solving process, enhancing the assessment capabilities of the AI grader.

Each component is implemented in a separate file, promoting a clear separation of concerns and maintainable code structure. This modular approach allows for easy updates and scalability as the project evolves.

## 🛠️ Mock Data Integration

We've implemented mock data integration using a CSV file (`mock_data.csv`) to simulate future FastAPI backend responses. This approach allows us to develop and test the frontend independently while closely mimicking the expected data structure from the API.

### Sample Data Structure

Our sample data is derived from a college precalculus course exam, providing a realistic representation of the questions and feedback students might encounter. The current dataset includes various questions, designed to accommodate thousands seamlessly.

Each row in the CSV represents a single question and includes:

- **index**: A unique identifier for each question.
- **question**: The mathematical problem presented to the student, formatted using LaTeX for complex equations.
- **answer**: The correct answer to the question, formatted in LaTeX when necessary.
- **solution**: A step-by-step explanation of how to solve the problem, providing educational value beyond just the correct answer.
- **ai_solution**: AI-generated solution explaining the problem-solving steps.
- **written_feedback**: Detailed feedback on the student's approach and answer, offering constructive criticism and encouragement.
- **spoken_feedback**: A script for audio feedback, which will be utilized in future versions with text-to-speech functionality.
- **grade**: An assessment of the student's performance on this specific question.

### Sample of Mock Data Structure

| index | question                  | answer | solution        | ai_solution      | written\_feedback | spoken\_feedback | grade |
| ----- | ------------------------- | ------ | --------------- | ---------------- | ----------------- | ---------------- | ----- |
| 1     | Simplify the expression:  | $$a^2$$ | Step-by-step... | Let's solve...   | Your answer...    | Great job...     | A     |
| 2     | Solve the equation:       | $$y = -\frac{1}{3}x + 2$$ | Step-by-step... | Let's solve... | Excellent work!   | You've done...   | B+    |
| 3     | Find the center and radius of the circle: | Center: $$(4, -\frac{1}{2})$$, Radius: $$\frac{7}{2}$$ | Step-by-step... | Let's solve... | Your solution correctly identifies... | Your explanation was systematic... | A     |

In the full implementation, the feedback and grade columns would be dynamically filled out by the AI based on the user's input, providing personalized and accurate assessments.

## 🎤 Microphone Feature *(In Development)*

We are actively working on implementing a microphone feature that will allow students to verbally explain their problem-solving process. This feature will:

1. Record audio explanations from students.
2. Transcribe the audio to text for AI analysis.
3. Provide an additional dimension for assessment, evaluating not just the final answer but also the student's reasoning and articulation of mathematical concepts.
4. Support multiple languages to cater to a diverse student population.

This feature is designed to enhance the AI's grading capabilities and provide a more comprehensive evaluation of student understanding.

## ⚛️ Setup Instructions

1. Clone the repository:

   ```bash
   git clone https://github.com/irfank123/ai-grader-frontend.git
   ```

2. Navigate to the project directory:

   ```bash
   cd ai-grader-frontend
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## 🌟 Design Decisions

1. **Next.js Framework**: Chosen for its built-in routing, server-side rendering capabilities, and excellent developer experience. This framework allows for optimized performance and SEO benefits, crucial for educational platforms.
2. **Component-Based Architecture**: Our design focuses on reusable, modular components to enhance maintainability and scalability. This approach allows for easy updates and additions to functionality as the project evolves.
3. **Mock Data Approach**: Using a CSV file for mock data allows for easy updates and closely simulates the expected API response structure. This method enables us to test various question types and feedback scenarios efficiently.
4. **Responsive Design**: The UI is designed to be responsive, ensuring a consistent experience across different device sizes. This is particularly important for students who may access the platform from various devices, including smartphones and tablets.
5. **State Management**: We use React's built-in `useState` and `useEffect` hooks for state management, keeping our application simple and efficient for this prototype stage. As the application grows, we may consider more robust state management solutions like Redux or Context API.
6. **Accessibility Focus**: We've implemented ARIA labels and ensured keyboard navigation throughout the application, making it accessible to students with diverse needs.
7. **Dark Mode Support**: To reduce eye strain during long study sessions, we've implemented a dark mode option using CSS variables and Tailwind CSS.

## 💻 Technical Choices Justified

1. **React**: Chosen for its component-based architecture, which aligns well with our design needs and promotes code reusability. React's virtual DOM also ensures optimal performance for our interactive elements.
2. **TypeScript**: Implemented to enhance code quality, provide better documentation, and catch potential errors early in the development process. This is crucial for maintaining a robust codebase as the project scales.
3. **Papa Parse**: Used for parsing CSV data, providing a simple and efficient way to handle our mock data. It offers great performance and ease of use for CSV manipulation.
4. **Tailwind CSS**: Utilized for rapid UI development and consistent styling across components. Its utility-first approach allows for highly customizable designs without leaving the HTML.
5. **localStorage**: Employed for maintaining state between page navigations, simulating session persistence without the need for a backend. This allows for a seamless user experience in the prototype phase.
6. **react-latex-next**: Integrated for rendering LaTeX equations, ensuring accurate display of mathematical notations crucial for precalculus problems.
7. **Next.js API Routes**: Utilized to simulate backend endpoints, allowing for a more realistic frontend-backend interaction model in the prototype phase.


## 🤖 AI Usage Documentation

During the development of this project, we utilized AI assistance in the following ways:

1. **Code Generation**: AI was used to generate initial component structures and boilerplate code, which was then customized and refined by our team. This significantly sped up the development process while ensuring code quality.

2. **Problem Solving**: When faced with specific implementation challenges, such as optimizing the question navigation logic, we consulted AI for potential solutions and best practices.

3. **Code Review**: AI assisted in reviewing our code for potential improvements and adherence to React and TypeScript best practices. This helped maintain consistent code quality across the project.

4. **Documentation**: AI helped in generating comprehensive comments and this README file, which was then reviewed and adjusted by our team to ensure accuracy and completeness.

5. **Mock Data Creation**: AI assisted in creating realistic mock data for our CSV file, ensuring it closely resembled expected API responses and covered a wide range of precalculus topics.

6. **Accessibility Improvements**: AI provided suggestions for improving the accessibility of our components, including proper ARIA labels and keyboard navigation enhancements.

7. **Performance Optimization**: AI offered insights into potential performance bottlenecks and suggested optimizations, particularly for the Canvas component and LaTeX rendering.

It's important to note that while AI was a valuable tool in our development process, all code and design decisions were ultimately reviewed, understood, and approved by our human team members. The AI's suggestions were always critically evaluated and often modified to best fit our specific use case and coding standards.

## 📈 Future Enhancements

1. **AI Integration**: Fully integrate with a backend AI system for dynamic question generation and personalized feedback.
2. **Voice Recognition**: Implement voice input for math equations and verbal problem-solving explanations.
3. **Progress Tracking**: Develop a dashboard for students to track their progress over time.
4. **Collaborative Features**: Add functionality for students to share and discuss problems.
5. **Adaptive Learning**: Implement an algorithm to adjust question difficulty based on student performance.

## 🙏 Acknowledgments

- Our college precalculus department for providing sample exam questions.
- The open-source community for the invaluable tools and libraries used in this project.
- Our project advisor for guidance and support throughout the development process.
