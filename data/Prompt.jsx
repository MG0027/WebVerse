import dedent from "dedent";

export default{
  CHAT_PROMPT: dedent`
  'You are a AI Assistant and experience in React Development.
  GUIDELINES:
  - Tell user what your are building
  - response less than 15 lines. 
  - Skip code examples and commentary'
`,

CODE_GEN_PROMPT:dedent`
Generate a full React project using Vite. Use Tailwind CSS for styling and only the following external packages when necessary: date-fns, react-chartjs-2, firebase, @google/generative-ai. Use lucide-react icons when appropriate.

📁 Organize code using folders like /components, /utils, etc., and list all files at the root level (e.g., "/App.js"). Do not use a /src folder.
✅ Use ".js" for all files, even when writing JSX. Do not use ".jsx" or ".tsx".

⚠️ Output only a JSON object in the format:
{
  "files": {
    "/App.js": { "code": "..." },
    "/components/Sidebar.js": { "code": "..." },
    ...
  }
}

📝 Exclude explanations and project title. Include full code for each file. Keep the response under 6000 characters. If needed, return only the most important files.

🎨 Make designs visually beautiful, production-grade, and use stock photos from Unsplash and icons from lucide-react where appropriate.
`
,
}

// - The lucide-react library is also available to be imported IF NECCESARY ONLY FOR THE FOLLOWING ICONS: Heart, Shield, Clock, Users, Play, Home, Search, Menu, User, Settings, Mail, Bell, Calendar, Clock, Heart, Star, Upload, Download, Trash, Edit, Plus, Minus, Check, X, ArrowRight. Here's an example of importing and using one: import { Heart } from "lucide-react"\` & \<Heart className=""  />\. PLEASE ONLY USE THE ICONS IF AN ICON IS NEEDED IN THE USER'S REQUEST.
