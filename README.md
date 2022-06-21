![Hestia](https://user-images.githubusercontent.com/45223699/174790000-55532400-de69-4948-9cfe-15ecba4f3b88.jpg)

Self-Hosted Open-Source Discord Bot to onboard & protect community members. It gamifies user entertainment & engagement.

## Usage

1. Clone using:

```bash
git clone https://github.com/Accretence/hestia
```

2. Install dependencies:

```bash
npm install
```

3. Create a Discord Bot using [Discord Developer Portal](https://discord.com/developers/applications)
4. Create a Cloud MongoDB Atlas Database using [MongoDB Cloud](https://www.mongodb.com/cloud)
5. Fill in `.env` using `sample.env` as a template:

```bash
DISCORD_TOKEN = // Your Discord Bot Token
ATLAS_URL = // Your MongoDB Atlas Connection URL
```

6. Run locally:

```bash
npm run dev
```
