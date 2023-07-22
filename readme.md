# Does this work?

_barely_

```
cp .env.example .env # And update the env
npm install
npx tsx --require dotenv/config src/main.ts some-file.mp4 # output is put into the `output` directory
```
