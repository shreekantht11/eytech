# 🚀 Quick Setup Guide

## Prerequisites

- Node.js 18+ and npm
- MongoDB account (free at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- Google Gemini API key (free at [Google AI Studio](https://makersuite.google.com/app/apikey))

## Step-by-Step Setup

### 1. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Create Environment File

Create a `.env` file in the **root directory**:

```env
# Gemini AI Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# MongoDB Configuration
MONGODB_URI=your_mongodb_connection_string_here

# Server Configuration
PORT=8000

# CORS Configuration
FRONTEND_URL=http://localhost:8080
```

### 3. Get Your API Keys

#### Gemini API Key:
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the key and paste it in `.env` as `GEMINI_API_KEY`

#### MongoDB URI:
1. Create free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier M0)
3. Click "Connect" → "Connect your application"
4. Copy connection string
5. Replace `<password>` with your database password
6. Paste in `.env` as `MONGODB_URI`

Example MongoDB URI:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/tatacapital?retryWrites=true&w=majority
```

### 4. Seed the Database

```bash
npm run seed
```

Expected output:
```
✅ Successfully seeded 10 customers
📊 Customer Summary:
Rajesh Kumar         | Phone: 9876543210 | Score: 780 | Limit: ₹50,000
Priya Sharma         | Phone: 9876543211 | Score: 820 | Limit: ₹75,000
...
```

### 5. Run the Application

**Run both frontend and backend together:**
```bash
npm run dev
```

Or run separately:

Terminal 1 (Frontend):
```bash
npm run dev:frontend
```

Terminal 2 (Backend):
```bash
cd backend
npm run dev
```

### 6. Access the Application

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000 (root endpoint)

## 🧪 Test the Demo

### Flow A: Instant Approval ✅
1. Click "Start Chat with Tara"
2. Say: "I need a loan of 40000 rupees"
3. When asked, enter phone: `9876543210`
4. Loan approved instantly!
5. Download sanction letter

### Flow B: Salary Slip Required 📄
1. Start chat
2. Say: "I want 130000 rupees loan"
3. Enter phone: `9876543211`
4. Upload salary slip when prompted
5. Enter salary: `60000`
6. Approved after verification
7. Download sanction letter

### Flow C: Rejection ❌
1. Start chat
2. Say: "I need 50000 rupees"
3. Enter phone: `9876543212`
4. See rejection (credit score < 700)
5. Get alternative options

## 🐛 Troubleshooting

### Backend won't start
- Check `.env` file exists in root directory
- Verify MongoDB URI is correct
- Ensure port 8000 is available

### "Cannot connect to MongoDB"
- Check MongoDB Atlas network access (whitelist your IP)
- Verify username/password in connection string
- Ensure database name is correct

### "Gemini API error"
- Verify API key is valid
- Check API quota hasn't been exceeded
- Ensure no extra spaces in `.env` file

### Frontend can't reach backend
- Verify backend is running on port 8000
- Check CORS configuration
- Clear browser cache

## 📝 API Endpoints Reference

```
POST   /api/chat                        - Master agent chat
GET    /api/offers/:customerId          - Get pre-approved offers
POST   /api/verify-kyc                  - Verify customer KYC
GET    /api/credit-score/:customerId    - Get credit score
POST   /api/upload-salary               - Upload salary slip
GET    /api/sanction/:id/download       - Download sanction letter
GET    /api/admin/sessions              - View all sessions
GET    /api/admin/sanctions             - View all sanctions
GET    /health                          - Health check
```

## 🎯 Next Steps

1. ✅ Complete setup following this guide
2. 🧪 Test all three demo flows
3. 🎨 Customize branding and content
4. 🚀 Deploy to production
5. 📊 Monitor usage via admin endpoints

## 🆘 Need Help?

- Check main [README.md](./README.md) for detailed documentation
- Review error logs in terminal
- Verify all environment variables are set
- Ensure all dependencies are installed

---

Made for EY Techathon 2025 🏆
