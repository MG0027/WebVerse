const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");
const fs = require("node:fs");
const mime = require("mime-types");

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp-image-generation",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseModalities: [
    "image",
    "text",
  ],
  responseMimeType: "text/plain",
};

const CodeGenerationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

  export const chatSession = model.startChat({
    generationConfig,
    history: [
    ],
  });

  export const GenAiCode = model.startChat({
    generationConfig: CodeGenerationConfig,
    history: [
      {
        role: "user",
        parts: [
          {text: "Generate to do app: Generate a Project in React. Create multiple components, organizing them in separate folders with filenames using the .js extension, if needed. The output should use Tailwind CSS for styling, \nwithout any third-party dependencies or libraries, except for icons from the lucide-react library, which should only be used when necessary. Available icons include: Heart, Shield, Clock, Users, Play, Home, Search, Menu, User, Settings, Mail, Bell, Calendar, Star, Upload, Download, Trash, Edit, Plus, Minus, Check, X, and ArrowRight. For example, you can import an icon as import { Heart } from \"lucide-react\" and use it in JSX as <Heart className=\"\" />.\nalso you can use date-fns for date format and react-chartjs-2 chart, graph library\n\nReturn the response in JSON format with the following schema:\n{\n  \"projectTitle\": \"\",\n  \"explanation\": \"\",\n  \"files\": {\n    \"/App.js\": {\n      \"code\": \"\"\n    },\n    ...\n  },\n  \"generatedFiles\": []\n}\n\nHere’s the reformatted and improved version of your prompt:\n\nGenerate a programming code structure for a React project using Vite. Create multiple components, organizing them in separate folders with filenames using the .js extension, if needed. The output should use Tailwind CSS for styling, without any third-party dependencies or libraries, except for icons from the lucide-react library, which should only be used when necessary. Available icons include: Heart, Shield, Clock, Users, Play, Home, Search, Menu, User, Settings, Mail, Bell, Calendar, Star, Upload, Download, Trash, Edit, Plus, Minus, Check, X, and ArrowRight. For example, you can import an icon as import { Heart } from \"lucide-react\" and use it in JSX as <Heart className=\"\" />.\n\nReturn the response in JSON format with the following schema:\n\njson\nCopy code\n{\n  \"projectTitle\": \"\",\n  \"explanation\": \"\",\n  \"files\": {\n    \"/App.js\": {\n      \"code\": \"\"\n    },\n    ...\n  },\n  \"generatedFiles\": []\n}\nEnsure the files field contains all created files, and the generatedFiles field lists all the filenames. Each file's code should be included in the code field, following this example:\nfiles:{\n  \"/App.js\": {\n    \"code\": \"import React from 'react';\\nimport './styles.css';\\nexport default function App() {\\n  return (\\n    <div className='p-4 bg-gray-100 text-center'>\\n      <h1 className='text-2xl font-bold text-blue-500'>Hello, Tailwind CSS with Sandpack!</h1>\\n      <p className='mt-2 text-gray-700'>This is a live code editor.</p>\\n    </div>\\n  );\\n}\"\n  }\n}\n  Additionally, include an explanation of the project's structure, purpose, and functionality in the explanation field. Make the response concise and clear in one paragraph.\n  - When asked then only use this package to import, here are some packages available to import and use (date-fns,react-chartjs-2,\"firebase\",\"@google/generative-ai\" ) only when it required\n  \n  - For placeholder images, please use a https://archive.org/download/placeholder-image/placeholder-image.jpg\n  -Add Emoji icons whenever needed to give good user experinence\n  - all designs I ask you to make, have them be beautiful, not cookie cutter. Make webpages that are fully featured and worthy for production.\n\n- By default, this template supports JSX syntax with Tailwind CSS classes, React hooks, and Lucide React for icons. Do not install other packages for UI themes, icons, etc unless absolutely necessary or I request them.\n\n- Use icons from lucide-react for logos.\n\n- Use stock photos from unsplash where appropriate, only valid URLs you know exist. Do not download the images, only link to them in image tags.\n   `"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "{\n  \"projectTitle\": \"Simple To-Do App\",\n  \"explanation\": \"This project is a basic to-do application built with React and styled using Tailwind CSS. It allows users to add, view, and delete tasks. The application is structured with separate components for the task input, task list, and individual task items to maintain organization and readability. It leverages React's state management to handle task updates and uses Tailwind CSS classes directly within the JSX for styling. No external UI libraries are used, except for the optional usage of icons from 'lucide-react' for enhanced visual cues. This provides a clean and functional to-do list interface.\",\n  \"files\": {\n    \"/App.js\": {\n      \"code\": \"import React from 'react';\\nimport TaskInput from './components/TaskInput';\\nimport TaskList from './components/TaskList';\\nimport { useState, useEffect } from 'react';\\n\\nfunction App() {\\n  const [tasks, setTasks] = useState(() => {\\n    const savedTasks = localStorage.getItem('tasks');\\n    if (savedTasks) {\\n      return JSON.parse(savedTasks);\\n    } else {\\n      return [];\\n    }\\n  });\\n\\n  useEffect(() => {\\n    localStorage.setItem('tasks', JSON.stringify(tasks));\\n  }, [tasks]);\\n\\n  const addTask = (text) => {\\n    setTasks([...tasks, { id: Date.now(), text, completed: false }]);\\n  };\\n\\n  const deleteTask = (id) => {\\n    setTasks(tasks.filter(task => task.id !== id));\\n  };\\n\\n  const toggleComplete = (id) => {\\n    setTasks(tasks.map(task =>\\n      task.id === id ? { ...task, completed: !task.completed } : task\\n    ));\\n  };\\n\\n  return (\\n    <div className=\\\"bg-gray-100 min-h-screen py-10 px-4\\\">\\n      <div className=\\\"container mx-auto max-w-md bg-white shadow-md rounded-lg p-6\\\">\\n        <h1 className=\\\"text-2xl font-bold text-center text-blue-600 mb-4\\\">📝 My To-Do List</h1>\\n        <TaskInput onAddTask={addTask} />\\n        <TaskList tasks={tasks} onDeleteTask={deleteTask} onToggleComplete={toggleComplete} />\\n      </div>\\n    </div>\\n  );\\n}\\n\\nexport default App;\\n\"\n    },\n    \"/components/TaskInput.js\": {\n      \"code\": \"import React, { useState } from 'react';\\nimport { Plus } from 'lucide-react';\\n\\nfunction TaskInput({ onAddTask }) {\\n  const [text, setText] = useState('');\\n\\n  const handleChange = (event) => {\\n    setText(event.target.value);\\n  };\\n\\n  const handleSubmit = (event) => {\\n    event.preventDefault();\\n    if (text.trim()) {\\n      onAddTask(text);\\n      setText('');\\n    }\\n  };\\n\\n  return (\\n    <form onSubmit={handleSubmit} className=\\\"flex items-center mb-4\\\">\\n      <input\\n        type=\\\"text\\\"\\n        className=\\\"shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline\\\"\\n        placeholder=\\\"Add new task...\\\"\\n        value={text}\\n        onChange={handleChange}\\n      />\\n      <button\\n        type=\\\"submit\\\"\\n        className=\\\"ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline\\\"\\n      >\\n        <Plus className=\\\"h-5 w-5\\\" />\\n      </button>\\n    </form>\\n  );\\n}\\n\\nexport default TaskInput;\\n\"\n    },\n    \"/components/TaskList.js\": {\n      \"code\": \"import React from 'react';\\nimport TaskItem from './TaskItem';\\n\\nfunction TaskList({ tasks, onDeleteTask, onToggleComplete }) {\\n  return (\\n    <ul>\\n      {tasks.map(task => (\\n        <TaskItem\\n          key={task.id}\\n          task={task}\\n          onDeleteTask={onDeleteTask}\\n          onToggleComplete={onToggleComplete}\\n        />\\n      ))}\\n      {tasks.length === 0 && <p className=\\\"text-gray-500 text-center\\\">No tasks yet. Add some!</p>}\\n    </ul>\\n  );\\n}\\n\\nexport default TaskList;\\n\"\n    },\n    \"/components/TaskItem.js\": {\n      \"code\": \"import React from 'react';\\nimport { Trash, Check, X } from 'lucide-react';\\n\\nfunction TaskItem({ task, onDeleteTask, onToggleComplete }) {\\n  return (\\n    <li className=\\\"flex justify-between items-center py-2 px-3 mb-2 rounded shadow-sm bg-white\\\">\\n      <div className=\\\"flex items-center\\\">\\n        <input\\n          type=\\\"checkbox\\\"\\n          className=\\\"form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500 mr-2\\\"\\n          checked={task.completed}\\n          onChange={() => onToggleComplete(task.id)}\\n        />\\n        <span className={`${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>\\n          {task.text}\\n        </span>\\n      </div>\\n      <div>\\n        <button onClick={() => onDeleteTask(task.id)} className=\\\"text-red-500 hover:text-red-700 focus:outline-none\\\">\\n          <Trash className=\\\"h-4 w-4\\\" />\\n        </button>\\n      </div>\\n    </li>\\n  );\\n}\\n\\nexport default TaskItem;\\n\"\n    }\n  },\n  \"generatedFiles\": [\n    \"/App.js\",\n    \"/components/TaskInput.js\",\n    \"/components/TaskList.js\",\n    \"/components/TaskItem.js\"\n  ]\n}\n"},
        ],
      },
    ],
  });



//   const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
//   // TODO: Following code needs to be updated for client-side apps.
//   const candidates = result.response.candidates;
//   for(let candidate_index = 0; candidate_index < candidates.length; candidate_index++) {
//     for(let part_index = 0; part_index < candidates[candidate_index].content.parts.length; part_index++) {
//       const part = candidates[candidate_index].content.parts[part_index];
//       if(part.inlineData) {
//         try {
//           const filename = `output_${candidate_index}_${part_index}.${mime.extension(part.inlineData.mimeType)}`;
//           fs.writeFileSync(filename, Buffer.from(part.inlineData.data, 'base64'));
//           console.log(`Output written to: ${filename}`);
//         } catch (err) {
//           console.error(err);
//         }
//       }
//     }
//   }
//   console.log(result.response.text());
// }
