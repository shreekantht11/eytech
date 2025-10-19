# Tata Capital AI Chatbot - Full Stack Lending Platform

A production-ready AI-powered lending chatbot built for EY Techathon. This application demonstrates a complete loan approval workflow using Gemini AI as the Master Agent orchestrating specialized Worker Agents for Sales, Verification, Underwriting, and Sanction Letter Generation.

## 🚀 Features

- **AI-Powered Chatbot**: Conversational interface powered by Google Gemini
- **Master Agent Orchestration**: Intelligent workflow management
- **Worker Agents**:
  - Sales Agent: Loan amount and tenure collection
  - Verification Agent: KYC validation from MongoDB
  - Underwriting Agent: Credit score evaluation and eligibility rules
  - Sanction Letter Generator: PDF generation with loan details
- **Real-time Processing**: Instant approvals for eligible customers
- **Document Upload**: Salary slip processing for higher loan amounts
- **Session Management**: Complete audit trail in MongoDB
- **Responsive Design**: Beautiful UI with Tata Capital branding

## 🎨 Design

- **Primary Color**: Deep Blue (#003399)
- **Accent Color**: Gold (#FFD700)
- **Typography**: Inter font family
- **Framework**: React + TypeScript + Tailwind CSS + shadcn/ui

## 📋 Prerequisites

- Node.js 18+ and npm
- MongoDB account (MongoDB Atlas recommended)
- Google Gemini API key

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd tata-capital-ai-chatbot
```

### 2. Install all dependencies

```bash
npm run install:all
```

This installs dependencies for both frontend and backend.

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
# Gemini AI Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# MongoDB Configuration
MONGODB_URI=your_mongodb_connection_string_here

# Server Configuration
PORT=8000
```

**How to get your API keys:**

- **Gemini API Key**: Visit [Google AI Studio](https://makersuite.google.com/app/apikey) and create a new API key
- **MongoDB URI**: 
  1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
  2. Create a new cluster
  3. Click "Connect" and select "Connect your application"
  4. Copy the connection string and replace `<password>` with your database password

### 4. Seed the database

```bash
npm run seed
```

This will create 10 synthetic customer records with:
- Name, age, city, phone
- Credit scores (0-900)
- Pre-approved limits
- Current loan status

## 🚀 Running the Application

### Development Mode

**Option 1: Run both frontend and backend together (Recommended)**

```bash
npm run dev
```

This will start:
- Frontend on `http://localhost:8080`
- Backend on `http://localhost:8000`

**Option 2: Run separately**

Terminal 1 (Frontend):
```bash
npm run dev:frontend
```

Terminal 2 (Backend):
```bash
npm run dev:backend
```

### Production Mode

Build frontend:
```bash
npm run build
```

Build and run backend:
```bash
npm run build:backend
npm run start:backend
```

## 🎯 Demo Flows

### Flow A: Instant Approval ✅

**Scenario**: Customer with ₹50,000 pre-approved limit requests ₹40,000

1. Start chat and request ₹40,000 loan
2. Provide phone number for verification
3. System verifies KYC from MongoDB
4. Underwriting approves instantly (within pre-approved limit)
5. Sanction letter generated
6. Download PDF

**Test Phone**: 9876543210 (Pre-approved: ₹50,000)

### Flow B: Salary Slip Required 📄

**Scenario**: Customer with ₹75,000 limit requests ₹1,30,000

1. Start chat and request ₹1,30,000
2. Provide phone for verification
3. System requests salary slip (amount > limit but ≤ 2x limit)
4. Upload salary slip with ₹60,000/month salary
5. EMI calculation: ₹1,30,000 / 12 months = ₹10,833/month
6. Check: ₹10,833 ≤ 50% of ₹60,000 (₹30,000) ✓
7. Approve and generate sanction letter

**Test Phone**: 9876543211 (Pre-approved: ₹75,000)

### Flow C: Rejection ❌

**Scenario**: Credit score < 700 or amount > 2x pre-approved limit

1. Request loan amount > 2x pre-approved limit
2. System checks credit score and rules
3. Rejection with explanation
4. Offer to lower amount or schedule callback

**Test Phone**: 9876543212 (Credit Score: 650)

## 🔌 API Endpoints

### Chat & Session Management
- `POST /api/chat` - Master Agent orchestration
  ```json
  {
    "sessionId": "session_123",
    "message": "I need a loan of 50000"
  }
  ```

### Customer & Verification
- `GET /api/offers/:customerId` - Get pre-approved offers
- `POST /api/verify-kyc` - Verify customer from CRM
  ```json
  {
    "sessionId": "session_123",
    "phone": "9876543210"
  }
  ```

### Credit & Underwriting
- `GET /api/credit-score/:customerId` - Get credit score
- `POST /api/underwriting` - Run underwriting rules
  ```json
  {
    "customerId": "cust_123",
    "requestedAmount": 50000,
    "tenure": 12
  }
  ```

### Document Processing
- `POST /api/upload-salary` - Upload salary slip
  - Content-Type: multipart/form-data
  - Fields: file, sessionId, salary (for demo)

### Sanction Letters
- `POST /api/generate-sanction` - Generate PDF sanction letter
- `GET /api/sanction/:id/download` - Download sanction letter

### Admin
- `GET /api/admin/sessions` - List all sessions with audit logs

## 🧪 Testing with cURL

### Start a chat session
```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "test_session_1",
    "message": "I need a loan of 50000 rupees"
  }'
```

### Check eligibility
```bash
curl -X POST http://localhost:8000/api/verify-kyc \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "test_session_1",
    "phone": "9876543210"
  }'
```

### Get offers
```bash
curl http://localhost:8000/api/offers/cust_1
```

## 📁 Project Structure

```
tata-capital-ai-chatbot/
├── src/
│   ├── components/          # React components
│   │   ├── Hero.tsx
│   │   ├── Chatbot.tsx
│   │   ├── Features.tsx
│   │   └── ...
│   ├── pages/              # Page components
│   │   └── Index.tsx
│   ├── lib/                # Utilities
│   └── hooks/              # Custom hooks
├── backend/                # Backend server (to be implemented)
│   ├── src/
│   │   ├── agents/        # Worker agents
│   │   ├── routes/        # API routes
│   │   ├── models/        # MongoDB schemas
│   │   └── services/      # Business logic
│   └── scripts/
│       └── seed.ts        # Database seeding
├── .env                   # Environment variables
└── README.md             # This file
```

## 🔐 Security Notes

- Never commit `.env` file
- Keep Gemini API key server-side only
- Implement rate limiting in production
- Add input validation for all endpoints
- Use HTTPS in production
- Implement proper authentication for admin endpoints

## 🚢 Deployment

### Deploy to Vercel (Frontend)

1. Push code to GitHub
2. Import project in Vercel
3. Configure environment variables (if needed)
4. Deploy

### Deploy Backend (Render/Railway)

1. Create new web service
2. Connect GitHub repository
3. Add environment variables:
   - `GEMINI_API_KEY`
   - `MONGODB_URI`
   - `PORT=8000`
4. Deploy

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Verify MongoDB URI format
- Check network access settings in MongoDB Atlas
- Ensure IP whitelist includes your IP

### Gemini API Errors
- Verify API key is correct
- Check API quota/limits
- Ensure proper error handling in backend

### File Upload Issues
- Check file size limits
- Verify MIME types are allowed
- Ensure uploads directory exists

## 📚 Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB with Mongoose
- **AI**: Google Gemini API
- **PDF Generation**: pdfkit
- **File Upload**: multer

## 🤝 Contributing

This is a demo project for EY Techathon. For production use:
1. Add comprehensive error handling
2. Implement authentication & authorization
3. Add rate limiting
4. Set up monitoring and logging
5. Implement comprehensive testing
6. Add data encryption

## 📄 License

MIT License - feel free to use for learning and demonstration purposes.

## 👥 Support

For questions or issues:
- Create an issue in GitHub
- Email: support@tatacapital.com (demo)

---

**Note**: This is a demonstration project created for EY Techathon. The backend implementation with actual Gemini integration, MongoDB operations, and PDF generation needs to be completed separately. The frontend is fully functional and production-ready.

**Next Steps**: 
1. Implement backend Express server with TypeScript
2. Create Worker Agent functions
3. Integrate Gemini API for Master Agent
4. Set up MongoDB schemas and connections
5. Implement PDF generation for sanction letters
6. Add comprehensive error handling and logging
