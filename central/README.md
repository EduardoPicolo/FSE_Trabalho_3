This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
yarn dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Using Docker

1. Build the container: `docker build -t nextjs-docker .`.
2. Run the container: `docker run -p 3000:3000 -p 8000:8000 nextjs-docker`.
