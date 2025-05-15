# Backend Documentation

## Overview
The backend of the Virtual Doctor project is built using Django and Django REST Framework, providing a robust API for the frontend and mobile applications. The system implements a microservices architecture with secure authentication, real-time communication, and comprehensive data management.

## Technology Stack
- Python 3.9 with Django 4.2
- Django REST Framework 3.14.0
- PostgreSQL 14 for database
- Celery 5.3.0 for async tasks
- Redis 7.0 for caching
- JWT Authentication
- Channels for WebSocket
- pytest for testing
- Black for code formatting
- isort for import sorting
- mypy for type checking

## Project Structure
```
backend/
├── virtual_doctor/        # Main project directory
│   ├── settings/         # Django settings
│   │   ├── base.py      # Base settings
│   │   ├── dev.py       # Development settings
│   │   └── prod.py      # Production settings
│   ├── urls.py          # URL configuration
│   ├── asgi.py          # ASGI configuration
│   └── wsgi.py          # WSGI configuration
├── apps/                 # Django applications
│   ├── users/           # User management
│   │   ├── models.py    # User models
│   │   ├── views.py     # User views
│   │   └── serializers.py # User serializers
│   ├── chat/            # Chat functionality
│   │   ├── consumers.py # WebSocket consumers
│   │   ├── models.py    # Chat models
│   │   └── views.py     # Chat views
│   ├── medicine/        # Medicine management
│   │   ├── models.py    # Medicine models
│   │   ├── views.py     # Medicine views
│   │   └── services.py  # Medicine services
│   └── diagnosis/       # Diagnosis system
│       ├── models.py    # Diagnosis models
│       ├── views.py     # Diagnosis views
│       └── services.py  # Diagnosis services
├── utils/               # Utility functions
│   ├── decorators.py    # Custom decorators
│   ├── permissions.py   # Custom permissions
│   └── helpers.py       # Helper functions
├── tests/              # Test cases
│   ├── unit/          # Unit tests
│   ├── integration/   # Integration tests
│   └── e2e/           # End-to-end tests
├── celery/            # Celery configuration
│   ├── __init__.py    # Celery app
│   └── tasks.py       # Celery tasks
├── requirements/      # Requirements files
│   ├── base.txt      # Base requirements
│   ├── dev.txt       # Development requirements
│   └── prod.txt      # Production requirements
└── manage.py         # Django management script
```

## Key Features
1. **User Management**
   - Authentication with JWT
   - Authorization with roles
   - Profile management
   - Role-based access
   - Password reset
   - Email verification
   - Social authentication

2. **Chat System**
   - Real-time messaging with WebSocket
   - AI integration
   - Message history
   - File attachments
   - Typing indicators
   - Read receipts
   - Message encryption

3. **Medicine Management**
   - Prescription handling
   - Drug database
   - Interaction checking
   - Dosage calculation
   - Stock management
   - Price tracking
   - Alternative medicines

4. **Diagnosis System**
   - Symptom analysis
   - Condition matching
   - Treatment suggestions
   - Medical history
   - Lab results
   - Imaging reports
   - Progress tracking

5. **API Endpoints**
   - RESTful architecture
   - JWT authentication
   - Rate limiting
   - CORS support
   - API versioning
   - Documentation
   - Error handling

## Getting Started
1. Create virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   venv\Scripts\activate     # Windows
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements/dev.txt
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Set up database:
   ```bash
   python manage.py migrate
   python manage.py createsuperuser
   ```

5. Run development server:
   ```bash
   python manage.py runserver
   ```

6. Run Celery worker:
   ```bash
   celery -A virtual_doctor worker -l info
   ```

7. Run tests:
   ```bash
   pytest
   ```

## Development Guidelines
1. **Code Style**
   - Follow PEP 8
   - Use type hints
   - Write docstrings
   - Implement logging
   - Use Black for formatting
   - Use isort for imports
   - Use mypy for type checking

2. **Database**
   - Use migrations
   - Optimize queries
   - Implement caching
   - Regular backups
   - Use indexes
   - Monitor performance
   - Handle transactions

3. **Security**
   - Input validation
   - SQL injection prevention
   - XSS protection
   - CSRF protection
   - Rate limiting
   - Data encryption
   - Secure headers

4. **Performance**
   - Query optimization
   - Caching strategy
   - Async tasks
   - Load balancing
   - Database indexing
   - API pagination
   - Response compression

## Testing
- Unit tests: pytest
  - Model tests
  - View tests
  - Service tests
  - Utility tests
- Integration tests: Django TestCase
  - API tests
  - Database tests
  - Cache tests
- API tests: DRF TestCase
  - Endpoint tests
  - Authentication tests
  - Permission tests
- Coverage: pytest-cov
  - Code coverage
  - Branch coverage
  - Report generation

## Deployment
- Production settings
  - Debug mode
  - Secret keys
  - Allowed hosts
  - Database config
- Environment variables
  - API keys
  - Database URLs
  - Redis config
  - Email settings
- Database configuration
  - Connection pooling
  - Replication
  - Backup strategy
  - Monitoring
- Static files
  - CDN setup
  - Compression
  - Caching
  - Versioning
- SSL/TLS setup
  - Certificate management
  - HTTPS redirect
  - HSTS
  - CSP
- Monitoring
  - Error tracking
  - Performance monitoring
  - Resource usage
  - Alert system

## API Documentation
- Swagger/OpenAPI
  - API endpoints
  - Request/response schemas
  - Authentication
  - Examples
- Postman collection
  - Environment setup
  - Request examples
  - Test scripts
  - Documentation
- API versioning
  - URL versioning
  - Header versioning
  - Deprecation policy
  - Migration guide
- Rate limiting
  - IP-based limits
  - User-based limits
  - Endpoint limits
  - Custom rules
- Error handling
  - Status codes
  - Error messages
  - Validation errors
  - Custom exceptions

## Contributing
1. Fork repository
2. Create feature branch
3. Write tests
4. Update documentation
5. Create pull request
6. Code review
7. Merge changes

## License
MIT License 