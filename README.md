<p align="center">
  <img src="https://github-production-user-asset-6210df.s3.amazonaws.com/2793951/249391043-4d65a757-b8cb-47de-b197-774df2cf0837.png" alt="@retronew/adonis-bull-queue">
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@retronew/adonis-bull-queue"><img src="https://img.shields.io/npm/dm/@retronew/adonis-bull-queue.svg?style=flat-square" alt="Download"></a>
  <a href="https://www.npmjs.com/package/@retronew/adonis-bull-queue"><img src="https://img.shields.io/npm/v/@retronew/adonis-bull-queue.svg?style=flat-square" alt="Version"></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/npm/l/@retronew/adonis-bull-queue.svg?style=flat-square" alt="License"></a>
</p>

`@retronew/adonis-bull-queue` is a queue system based on [BullMQ](https://github.com/taskforcesh/bullmq)
for [AdonisJS](https://adonisjs.com/).

> [!NOTE]
> You must have a Redis server running on your machine.

---

## Getting Started

This package is available in the npm registry.

```bash
node ace add @retronew/adonis-bull-queue
```

## Usage

The `queue` service gives you access to the `dispatch` method.
It will dispatch the linked job to the queue with the given payload.

```ts
import queue from '@retronew/adonis-bull-queue/services/main';

queue.dispatch(RegisterStripeCustomer, {...});

// You can also specify options for a specific job
queue.dispatch(RegisterStripeCustomer, {...}, {
  queueName: 'stripe',
});
```

You can create a job by running `node ace make:job {job}`.
This will create the job within your `app/jobs` directory.

The `handle` method is what gets called when the jobs is processed while
the `rescue` method is called when the max attempts of the job has been reached.

You can remove the `rescue` method if you want.

Since the job instance is passed to the constructor, you can easily send notifications with the `rescue` method. See [this page](https://api.docs.bullmq.io/classes/Job.html) for full documentation on the job instance.

**Example job file:**

```ts
// app/jobs/register_stripe_customer.ts
import { Job } from '@retronew/adonis-bull-queue'

interface RegisterStripeCustomerPayload {
  userId: string;
};

export default class RegisterStripeCustomer extends Job {
  static get $$filepath() {
    return import.meta.url
  }

  public async handle(payload: RegisterStripeCustomerPayload) {
    // ...
  }

  /**
   * This is an optional method that gets called if it exists when the retries has exceeded and is marked failed.
   */
  public async rescue(payload: RegisterStripeCustomerPayload, error: Error) {}
}
```

#### Job Attempts

By default, all jobs have a retry of 3 and this is set within your `config/queue.ts` under the `jobs` object.

You can also set the attempts on a call basis by passing the override as shown below:

```ts
queue.dispatch(SomeJob, {...}, { attempts: 3 })
```

#### Delayed retries

If you need to add delays between retries, you can either set it globally via by adding this to your `config/queue.ts`:

```ts
// config/queue.ts
import { defineConfig } from '@retronew/adonis-bull-queue'

export default defineConfig({
  // ...

  jobs: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    }
  }
})
```

Or... you can also do it per job:

```ts
queue.dispatch(Somejob, {...}, {
  attempts: 3,
  backoff: { type: 'exponential', delay: 5000 }
})
```

With that configuration above, BullMQ will first add a 5s delay before the first retry, 20s before the 2nd, and 40s for the 3rd.

You can visit [this page](https://docs.bullmq.io/guide/retrying-failing-jobs) on further explanation / other retry options.

#### Running the queue

Run the queue worker with the following ace command:

```bash
node ace queue:listen

# or

node ace queue:listen --queue=stripe

# or

node ace queue:listen --queue=stripe,cloudflare
```

Once done, you will see the message `Queue processing started`.
