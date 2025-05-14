# Virtual Doctor

A comprehensive healthcare application that combines AI-powered diagnosis, emotional support, and medication management.

## Features

- AI-powered symptom diagnosis
- Emotional state tracking and analysis
- Medication management and reminders
- AI chat assistant for health-related queries
- Secure user authentication
- Real-time health monitoring

## Tech Stack

### Backend
- FastAPI
- Firebase
- PostgreSQL
- TensorFlow
- OpenAI API

### Mobile App
- React Native
- Expo
- Firebase Authentication
- React Navigation
- Various UI components and libraries

## Setup Instructions

### Backend Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```
DATABASE_URL=your_database_url
FIREBASE_CREDENTIALS=your_firebase_credentials
OPENAI_API_KEY=your_openai_api_key
```

4. Run the backend server:
```bash
uvicorn main:app --reload
```

### Mobile App Setup

1. Navigate to the mobile app directory:
```bash
cd "Mobile App/mobile/a0-project"
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on your preferred platform:
```bash
# For iOS
npm run ios

# For Android
npm run android
```

## Project Structure

```
Virtual-Doctor/
├── BackEnd/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── models/
│   │   └── services/
│   ├── tests/
│   └── main.py
├── Mobile App/
│   └── mobile/
│       └── a0-project/
│           ├── src/
│           ├── screens/
│           └── utils/
├── requirements.txt
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Your Name - your.email@example.com
Project Link: [https://github.com/QuantumBreakz/Virtual-Doctor](https://github.com/QuantumBreakz/Virtual-Doctor) 