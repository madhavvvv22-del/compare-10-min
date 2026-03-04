# Push to GitHub

Your project is ready to push. Follow these steps:

## 1. Create a new repository on GitHub

1. Go to [github.com/new](https://github.com/new)
2. Set the repository name to **compare-10-min** (or any name you prefer)
3. Leave it **empty** (no README, no .gitignore)
4. Click **Create repository**

## 2. Push your code

If you used `compare-10-min` as the repo name:

```bash
cd /Users/madhavbatham/Desktop/APP_10_MIN
git push -u origin main
```

If you used a different repo name, update the remote first:

```bash
git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username and `YOUR_REPO_NAME` with your repo name.

## 3. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **Add New** → **Project**
3. Import your GitHub repo
4. Set **Root Directory** to `web`
5. Click **Deploy**
