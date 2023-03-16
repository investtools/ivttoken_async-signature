# Asynchronous Signature Service

[![Test](https://https://github.com/investtools/ivttoken_async-signature/actions/workflows/test.yml/badge.svg)](https://https://github.com/investtools/ivttoken_async-signature/actions/workflows/async-signature-test.yml)


This is a service used to multi-sign a transaction asynchronously

## Code of Conduct
We are committed to fostering a welcoming and inclusive community. Please read our [Code of Conduct](CODE_OF_CONDUCT.md) for more information.

  ## Features 
- Create Signature  
- Submit Signature  

## Dependencies
- Prisma Client: an open source ORM  
- Dot Env: a module that loads environment variables   
- Ethers: a library for Ethereum 

## 🔧 Setting up local development

### Requirements

- [Node v16](https://nodejs.org/download/release/latest-v16.x/)  
- [Git](https://git-scm.com/downloads)

### Local Setup Steps

#### Clone the repository:
```sh
git clone https://github.com/investtools/ivttoken_async-signature
```

#### Install dependencies:
```sh
npm install
```

#### Set up environment variables (keys):
```sh
cp .env.example .env # (linux)
copy .env.example .env # (windows)
```

### Testing locally

#### Create an instance of a docker container image by running:
``` 
npm run database:local:prepare
```

#### Create a migration to sync the database with the schema:
``` 
npm run prisma:migrate:dev
```

#### Run the serverless offline plugin with:
``` 
npm run dev
```

#### Now you can make POST requests to:
```
http://localhost:3000/dev/create-signature  
http://localhost:3000/dev/submit-signature 
```

#### To see data at the database, run:
``` 
npm run prisma:studio
```

#### Run mocha tests by simply running:
``` 
npm run test
```