# Install dependencies

Make sure you have node and npm installed. (I use Yarn for managing dependencies)

```bash
npm i
```

# Deploy

Install the [`flyctl`](https://fly.io/docs/getting-started/installing-flyctl/) cli to deploy [Node apps](https://fly.io/docs/getting-started/node/) to fly.io.

```bash
flyctl launch
```

After deploy, connect to your instance with `flyctl open`

## Deploy failed?

I got a deploy error when I tried for the first time.

```
Failed due to unhealthy allocations - no stable job version to auto revert to and deploying as v1
```

To fix, I refered [this](https://fly.io/docs/getting-started/node/) from the docs.
