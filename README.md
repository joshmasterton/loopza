# Loopza

Loopza is a community-driven social platform where users can create posts, join discussions, and explore topics. Built with React.js, Express.js, and PostgreSQL, it features a modern design, MVC architecture, and Docker integration for scalability and ease of deployment.

## Table of Contents

- Project Setup
- Development
- Testing
- Contributing
- License

## Project setup

### Prerequisites

- Docker installed
- Docker compose installed

### Installation:

1. Clone the repository

   - git clone https://github.com/joshmasterton/loopza.git

   - cd loopza

2. Development

   - docker-compose up --build

   - access via browser with http://localhost:9000/

3. Testing

   - docker-compose -f .\docker-compose.test.yml up --build

4. Stop the containers

   - docker-compose down

### Contributing

We welcome contributions! If you're interested in contributing, please follow these steps:

- Fork the repository.
- Create a new feature branch.
- Commit your changes.
- Submit a pull request.
