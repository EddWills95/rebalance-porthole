# BOS-Mode

Balance Channels without being a CLI wizard

### What is this magic?

-   Wraps this awesome tool [rebalance-lnd](https://github.com/C-Otto/rebalance-lnd) with a UI

## To Run

You'll need a few ENVs set up first:

```
LND_DATA_DIR
LND_IP
LND_GRPC_PORT
LND_DATA_DIR
```

You can run the individual parts inside each directory:

```
cd api
yarn start

cd client
yarn start
```

### Instructions

1. Your channels will be populated (if it's all hooked up) and sorted by ratio (Local/Remote)
2. Select one that you want to try and rebalance
3. The rebalance amount will auto-populate with the required amount of sats for 50:50
4. Most of the time this won't work. Try dropping the amount to something like 10k
5. You'll see the console output in the window underneath

### To Do

-   [x] Switch Success / error to notification component
-   [x] Switch to using ENVs
-   [ ] Add a log file (Success + Costs / Errors)
-   [ ] Auto Balance (job queue)
-   [ ] Dockerise (☂️😉)
