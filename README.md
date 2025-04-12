# Working with events

This app fetches polygon events and saves li.fi fee events into MongoDB

## Build and Run

To build this project run
```bash
  npm run build
```

And then to start run
```bash
  npm run start
```

If you want to load blocks {from} - {to} run
```bash
  npm run start -- --from={from} --to={to} 
```

For example
```bash
  npm run start -- --from=70196523 --to=70196525
```