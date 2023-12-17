This is another social media site created with [Next.js](https://nextjs.org/) and bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started
Before running, create `.env.local` and fill the following field
```env
NEXT_API_URL=
# Below are fields that will be removed as more feature rolled out
GUEST_USERNAME= 
GUEST_EMAIL=
GUEST_PASSWORD=
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

| Features                                          | Status                |
|---------------------------------------------------|-----------------------|
| Upload post                                       | :heavy_check_mark:    |
| Edit post                                         | :x:                   |
| Like post                                         | :x:                   |
| Comment post                                      | :x:                   |
| Delete post                                       | :x:                   |
| Search post                                       | :x:                   |
| Signup user                                       | :x:                   |
| Login user (With forget password, remember me)    | :x:                   |

More features coming soon...