
# Image Customization Web App

This web app allows users to customize images with AI-powered features like background removal, resizing, recoloring, and more. Built with Next.js, it uses Clerk for authentication and Stripe for payments, enabling a seamless user experience for both free and premium features.


## Features

- User Authentication: Sign up, log in, and secure access with Clerk.
- Payment System: Subscription-based premium features powered by Stripe.
- Image Customization
- Responsive Design: Optimized for all devices, including mobile and desktop.

## Tech

- Frontend: Next.js, React, TypeScript, TailwindCSS
- Backend: Node.js, Express.js, MongoDB
- Authentication: Clerk
- Payments: Stripe
- Image Processing: AI-powered APIs or third-party services
- Deployment: Vercel, MongoDB Atlas
## Deployment

To deploy this project run

```bash
  npm run deploy
```


## Run Locally

Clone the project

```bash
  git clone https://github.com/your-username/image-customization-app.git

```

Go to the project directory

```bash
  cd image-customization-app
```

Install dependencies

```bash
  npm install
# or
yarn install
```

Start the server

```bash
  npm run dev
# or
yarn dev
```


## Support

For support, email deepak96153@gmail.com

## 🔑Key Features

1. Clerk Authentication
- Clerk handles all user authentication, from sign-up to session management. To configure Clerk:

- Sign up at Clerk.dev.
- Create an application and obtain your API keys.
- Add the keys to your .env.local file as shown above.
2. Stripe Payment Integration
- Stripe handles payments for premium features. Users can - subscribe to access additional services like high-resolution - image downloads and bulk processing.

- Create an account on Stripe.
- Set up your products and pricing in the Stripe Dashboard.
- Configure your Stripe keys in the .env.local file.
3. AI-Powered Image Customization
- Key image customization features include:

- Background Removal: Remove image backgrounds with AI.
- Resize and Recolor: Adjust dimensions and apply color filters.
4. Responsive and Mobile-Ready
- The app is optimized for all screen sizes, ensuring a smooth - user experience on both mobile and desktop devices.




##📦 Deployment
Frontend (Vercel)
Deploy the app to Vercel by connecting your GitHub repository. Vercel automatically handles the deployment and environment variables.


