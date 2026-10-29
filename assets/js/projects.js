/* Portfolio project data. Keep media paths relative to assets/images/projects/. */
window.PORTFOLIO_PROJECTS = [
  {
    "slug": "pn-central-academy",
    "title": "P.N. Central Academy",
    "category": "websites",
    "categoryLabel": "Website · Full stack",
    "year": "2026",
    "status": "Website URL",
    "featured": true,
    "summary": "A school website and content-management experience that brings public information, enquiries and school updates into one place.",
    "role": "Full-stack web development",
    "stack": [
      "React",
      "Vite",
      "Tailwind CSS",
      "Node.js",
      "Express",
      "MongoDB"
    ],
    "repo": "https://github.com/prabhanshtiwari/pn-central-academy",
    "live": "https://pn-central-academy.vercel.app/",
    "problem": "School websites need to serve several audiences at once: parents looking for admissions and contact information, students checking updates, and staff maintaining public content. Important information can become difficult to find when pages and updates are managed separately.",
    "approach": "Build a responsive public website around clear information architecture, then support recurring school updates through a protected administration area. Keep public records and draft or unapproved content separate.",
    "work": [
      "Organised public information pages covering the school, admissions, facilities, staff, student information, gallery, videos and contact details.",
      "Worked across the React/Vite frontend and the Express/MongoDB backend.",
      "Implemented management flows for notices, admission resources, faculty profiles and gallery content.",
      "Added enquiry handling, with optional Google Sheets synchronisation and a retry path for failed syncs.",
      "Applied server-side validation, file-signature checks for PDFs, protected admin sessions, rate limiting, a CORS allow-list and security headers."
    ],
    "decisions": [
      [
        "Public and admin experiences",
        "Public visitors see published information; unverified or draft faculty and resources remain behind admin access."
      ],
      [
        "Content that changes over time",
        "Notices and admission resources are managed as records with publication and expiry states rather than being hard-coded into the page."
      ],
      [
        "Resilient enquiry flow",
        "Enquiries are stored in MongoDB first; the optional Sheet sync is tracked separately so a sync failure does not pretend the enquiry was lost or successfully mirrored."
      ]
    ],
    "outcome": "A deployed full-stack school website with public information pages and administrative workflows. No traffic, enquiry-conversion or performance figures are claimed because verified analytics were not available in the public repository.",
    "next": "For a production handover, confirm the school’s content and contact details, use durable object storage for uploaded media, verify all public claims with the school, and complete deployment smoke tests against the live environment.",
    "media": [
      "pn-central-academy-overview.webp",
      "pn-central-academy-admin.svg"
    ],
    "mediaAlt": [
      "Illustrative preview of the school website information architecture; not a captured production screenshot.",
      "Illustrative preview of the notices and resources administration workflow; not a captured production screenshot."
    ],
    "video": "",
    "videoNote": "No public walkthrough video was linked in the repository when this portfolio update was prepared."
  },
  {
    "slug": "bootle-village-stores",
    "title": "Bootle Village Stores & Post Office",
    "category": "websites",
    "categoryLabel": "Website · Business",
    "year": "2026",
    "status": "Website URL",
    "featured": true,
    "summary": "A responsive, frontend-only website that helps a local village store share useful information and make contact easier.",
    "role": "Frontend development",
    "stack": [
      "React",
      "JavaScript",
      "Vite",
      "Tailwind CSS v4"
    ],
    "repo": "https://github.com/prabhanshtiwari/bootle-village-stores",
    "live": "https://bootlestores.netlify.app/",
    "problem": "A small local shop needs a straightforward online presence where visitors can quickly understand what the store offers, find its location and choose a practical way to get in touch. The website should not imply online ordering or live stock when those services are not provided.",
    "approach": "Create a focused landing page with reusable React components and local visual assets. Prioritise location, store information, product highlights and direct contact actions over unnecessary e-commerce features.",
    "work": [
      "Built a self-contained frontend using React, Vite and Tailwind CSS v4.",
      "Presented shop information and product highlights in a responsive layout.",
      "Included map and directions access for visitors planning a visit.",
      "Added call, email and WhatsApp contact actions so customers can ask the store directly.",
      "Kept the website as an informational landing page rather than claiming stock tracking or online checkout."
    ],
    "decisions": [
      [
        "Informational, not transactional",
        "The site encourages customers to contact the shop; it does not promise live inventory or online payment."
      ],
      [
        "Direct contact actions",
        "Telephone, email and WhatsApp use platform-native links, keeping the path to the business short."
      ],
      [
        "Local asset strategy",
        "The repository uses local image paths with bundled SVG fallbacks, avoiding a runtime dependency on the previous website’s image host."
      ]
    ],
    "outcome": "A deployed responsive business website with store information, product highlights, directions and contact actions. The shop details, opening hours and photo permissions should be reconfirmed with the owner before any formal handover.",
    "next": "If the business wants online ordering later, treat it as a separate scope: inventory ownership, order processing, fulfilment, payment and customer support need explicit design before implementation.",
    "media": [
      "bootle-village-stores-overview.webp",
      "bootle-village-stores-details.svg"
    ],
    "mediaAlt": [
      "Illustrative preview of the store landing page layout; not a captured production screenshot.",
      "Illustrative preview of store details and contact actions; not a captured production screenshot."
    ],
    "video": "",
    "videoNote": "No public walkthrough video was linked in the repository when this portfolio update was prepared."
  },
  {
    "slug": "dynamic-weather-dashboard",
    "title": "Dynamic Weather Dashboard",
    "category": "web-apps",
    "categoryLabel": "Web app · API integration",
    "year": "2026",
    "status": "Demo URL",
    "featured": true,
    "summary": "A browser-based weather dashboard that looks up current conditions by city or device location and displays a five-day forecast.",
    "role": "Frontend development",
    "stack": [
      "HTML",
      "CSS",
      "JavaScript",
      "OpenWeather API",
      "Geolocation API"
    ],
    "repo": "https://github.com/prabhanshtiwari/Dynamic-Weather-Dashboard",
    "live": "https://dynamic-weather-1234.netlify.app/",
    "problem": "A weather lookup should give someone a quick answer without making them interpret raw API data. The interface needs to handle both a typed city and an optional location-based lookup.",
    "approach": "Use the browser to collect a city query or request geolocation permission, call the weather API, then map the response into a small set of readable weather fields and forecast cards.",
    "work": [
      "Added city search and a current-location path using the browser Geolocation API.",
      "Fetched current weather data and displayed location, date, temperature, condition, humidity and wind.",
      "Used forecast data to render daily cards for a five-day view.",
      "Kept the app as a lightweight HTML, CSS and JavaScript project."
    ],
    "decisions": [
      [
        "Two lookup paths",
        "City search remains available when a visitor declines location permission."
      ],
      [
        "Readable summaries",
        "The interface highlights everyday values instead of showing the full API response."
      ],
      [
        "Forecast grouping",
        "The current implementation selects one forecast entry per day for the daily cards."
      ]
    ],
    "outcome": "A deployed weather demo connected to OpenWeather endpoints. Its current repository implementation should be treated as a learning/demo project, not a production weather service.",
    "next": "Move the API key out of public client-side code or restrict it by allowed origin and quota. Add visible loading/error states, validate API responses, and test denied geolocation and invalid city cases.",
    "media": [
      "dynamic-weather-dashboard-overview.svg",
      "dynamic-weather-dashboard-forecast.svg"
    ],
    "mediaAlt": [
      "Illustrative preview of the current-weather dashboard; not a captured production screenshot.",
      "Illustrative preview of the five-day forecast cards; not a captured production screenshot."
    ],
    "video": "",
    "videoNote": "No public walkthrough video was linked in the repository when this portfolio update was prepared."
  },
  {
    "slug": "quiz-game",
    "title": "Quiz Game",
    "category": "web-apps",
    "categoryLabel": "Web app · JavaScript",
    "year": "2026",
    "status": "Demo URL",
    "featured": false,
    "summary": "A small browser quiz with a start flow, multiple-choice questions, answer feedback, progress and a final score.",
    "role": "Frontend development",
    "stack": [
      "HTML",
      "CSS",
      "JavaScript",
      "DOM manipulation"
    ],
    "repo": "https://github.com/prabhanshtiwari/quiz-game",
    "live": "https://prabhanshtiwari.github.io/quiz-game/",
    "problem": "A quiz interaction needs to guide a learner through one question at a time, make answer feedback understandable and show a clear result at the end.",
    "approach": "Model each question and its answer choices as JavaScript data, then use DOM updates and event listeners to move through the quiz state.",
    "work": [
      "Created a start screen, quiz screen and results screen.",
      "Stored five multiple-choice questions in a JavaScript array.",
      "Rendered answer buttons dynamically and prevented multiple selections for the same question.",
      "Tracked the current question, score and progress indicator.",
      "Displayed a final score with feedback and a restart action."
    ],
    "decisions": [
      [
        "Data-driven questions",
        "Question and answer content is separated from the rendering function in a simple array."
      ],
      [
        "Single selection per question",
        "An answer lock prevents repeated clicks from incrementing the score more than once."
      ],
      [
        "Clear quiz lifecycle",
        "Start, question, result and restart states keep the interaction easy to follow."
      ]
    ],
    "outcome": "A live browser-based quiz demo that demonstrates basic state management and DOM interaction using vanilla JavaScript. The current question set is a small static example rather than a configurable quiz platform.",
    "next": "Add keyboard-first answer navigation, accessible announcement of correctness and progress, configurable question data, and a no-JavaScript fallback if this is developed further.",
    "media": [
      "quiz-game-question.svg",
      "quiz-game-results.svg"
    ],
    "mediaAlt": [
      "Illustrative preview of a multiple-choice question screen; not a captured production screenshot.",
      "Illustrative preview of the score and restart screen; not a captured production screenshot."
    ],
    "video": "",
    "videoNote": "No public walkthrough video was linked in the repository when this portfolio update was prepared."
  },
  {
    "slug": "job-portal",
    "title": "Job Portal",
    "category": "web-apps",
    "categoryLabel": "Web app · MERN stack",
    "year": "2026",
    "status": "Demo URL",
    "featured": true,
    "summary": "A full-stack job platform with separate student and recruiter workflows for finding opportunities, managing job posts and tracking applications.",
    "role": "Full-stack development",
    "stack": [
      "React",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Mongoose",
      "JWT"
    ],
    "repo": "https://github.com/prabhanshtiwari/jobPortal",
    "live": "https://jobportal-1-qxyu.onrender.com",
    "problem": "Job seekers need a reliable way to discover opportunities and follow applications. Recruiters need a separate workspace to publish openings and review applicants. Both workflows need clear role boundaries.",
    "approach": "Build a React client and a Node.js/Express API, with JWT authentication and role-based authorization separating student and recruiter actions. Persist application data in MongoDB through Mongoose.",
    "work": [
      "Implemented email/password registration and login with JWT-based authentication.",
      "Separated student and recruiter capabilities through role-based access.",
      "Added job browsing, search, applications and application-status tracking for students.",
      "Added job creation, listing management and applicant review workflows for recruiters.",
      "Built the frontend with React, React Router, Axios, Tailwind CSS and shadcn/ui.",
      "Built the backend with Node.js, Express.js, MongoDB and Mongoose."
    ],
    "decisions": [
      [
        "Client/server separation",
        "The repository documents separate Client and Server applications, keeping interface concerns apart from API and persistence logic."
      ],
      [
        "Role-aware access",
        "Student and recruiter workflows are separated so each role can use the actions relevant to it."
      ],
      [
        "Token-based sessions",
        "JWT is used for authentication and protected application routes; production deployment still requires validation of token storage, expiry and authorization paths."
      ]
    ],
    "outcome": "A documented full-stack MERN job portal with role-specific student and recruiter workflows. No hiring, user-volume, conversion or performance metrics are claimed because verified analytics were not supplied.",
    "next": "Add automated tests for authentication, authorization, job posting and application flows. Verify all deployment URLs, review token handling and rate limiting, add monitoring and error reporting, and document API contracts.",
    "media": [
      "job-portal-overview.webp",
      "job-portal-student-dashboard.svg",
      "job-portal-recruiter-dashboard.svg"
    ],
    "mediaAlt": [
      "Preview of the Job Portal landing page with sample listing content; sample details are not verified vacancies.",
      "Illustrative student dashboard showing application tracking concepts; not a captured product screenshot.",
      "Illustrative recruiter dashboard showing job management concepts; not a captured product screenshot."
    ],
    "video": "",
    "videoNote": "No public walkthrough video was linked in the repository README when this portfolio package was prepared."
  }
];

window.PROJECT_CATEGORIES = [
  { id: 'all', label: 'All work' },
  { id: 'websites', label: 'Websites' },
  { id: 'web-apps', label: 'Web applications' }
];
