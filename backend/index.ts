import dotenv from "dotenv";
import express, { Express, NextFunction, Request, Response } from "express";
import { isHttpError } from "http-errors";
import bodyParser from 'body-parser';
import Stripe from 'stripe';

import userRoutes from "./src/routes/user";


dotenv.config();
const stripePublishableKey = process.env.STRIPE_PUBLISHABLE_KEY || '';
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';
const app: Express = express();
const port = process.env.PORT ?? 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.use("/api/users", userRoutes);

// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  // 500 is the "internal server error" error code, this will be our fallback
  let statusCode = 500;
  let errorMessage = "An error has occurred.";

  // check is necessary because anything can be thrown, type is not guaranteed
  if (isHttpError(error)) {
    // error.status is unique to the http error class, it allows us to pass status codes with errors
    statusCode = error.status;
    errorMessage = error.message;
  }
  // prefer custom http errors but if they don't exist, fallback to default
  else if (error instanceof Error) {
    errorMessage = error.message;
  }

  res.status(statusCode).json({ error: errorMessage });
});

app.listen(port, () => {
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  console.log(`[server]: Server is running at http://localhost:${port}`);
});


app.use((req, res, next) => {
  bodyParser.json()(req, res, next);
});

app.get('/stripe-key', (_, res) => {
  res.send({publishableKey: stripePublishableKey});
  return;
});

app.post('/create-payment-intent', async (req, res) => {
  const {
    email = `test${Math.floor(Math.random() * 9999) + 1}@domain.com`,
    currency,
    request_three_d_secure,
    payment_method_types = [],
  } = req.body;

  const stripe = new Stripe(stripeSecretKey, {
    // apiVersion: '2020-08-27',
    typescript: true,
  });

  const customer = await stripe.customers.create({email});

  const params = {
    amount: 5000,
    currency,
    customer: customer.id,
    payment_method_options: {
      card: {
        request_three_d_secure: request_three_d_secure || 'automatic',
      },
    },
    payment_method_types: payment_method_types,
  };

  try {
    const paymentIntent = await stripe.paymentIntents.create(params);
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.send({
      error: "Payment Error!",
    });
    return;
  }
  return;
});

app.post('/payment-sheet-setup-intent', async (req, res) => {
  const {
    email = `test${Math.floor(Math.random() * 9999) + 1}@domain.com`,
    payment_method_types = [],
  } = req.body;

  const stripe = new Stripe(stripeSecretKey, {
    // apiVersion: '2020-08-27',
    typescript: true,
  });

  const customer = await stripe.customers.create({email});

  const ephemeralKey = await stripe.ephemeralKeys.create(
    {customer: customer.id},
    {apiVersion: '2020-08-27'},
  );
  const setupIntent = await stripe.setupIntents.create({
    ...{customer: customer.id, payment_method_types},
  });

  res.json({
    setupIntent: setupIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id,
  });
  return;
});

app.post('/payment-sheet', async (req, res) => {
  const {email = `test${Math.floor(Math.random() * 9999) + 1}@domain.com`} =
    req.body;

  const stripe = new Stripe(stripeSecretKey, {
    // apiVersion: '2020-08-27',
    typescript: true,
  });

  const customer = await stripe.customers.create({email});

  const ephemeralKey = await stripe.ephemeralKeys.create(
    {customer: customer.id},
    {apiVersion: '2020-08-27'},
  );
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 5099,
    currency: 'usd',
    payment_method_types: ['card', 'link'],
  });
  res.json({
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id,
  });
  return;
});

app.post('/payment-sheet-subscription', async (req, res) => {
  const {email = `test${Math.floor(Math.random() * 9999) + 1}@domain.com`} =
    req.body;

  const stripe = new Stripe(stripeSecretKey, {
    // apiVersion: '2020-08-27',
    typescript: true,
  });

  const customer = await stripe.customers.create({email});

  const ephemeralKey = await stripe.ephemeralKeys.create(
    {customer: customer.id},
    {apiVersion: '2020-08-27'},
  );
  const PRICE_ID = '<YOUR PRICE ID HERE>';
  const subscription = await stripe.subscriptions.create({
    customer: customer.id,
    items: [{price: PRICE_ID}],
    trial_period_days: 3,
  });

  if (typeof subscription.pending_setup_intent === 'string') {
    const setupIntent = await stripe.setupIntents.retrieve(
      subscription.pending_setup_intent,
    );

    res.json({
      setupIntent: setupIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
    });
  } else {
    throw new Error(
      'Expected response type string, but received: ' +
        typeof subscription.pending_setup_intent,
    );
  }
  return;
});

app.listen(4242, () => console.log(`Node server listening on port ${4242}!`));
