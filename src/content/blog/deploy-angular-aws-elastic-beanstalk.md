---
title: Deploying an Angular App on AWS Elastic Beanstalk
author: Joan Serna Leiton
pubDatetime: 2026-10-05T12:10:00Z
slug: deploy-angular-aws-elastic-beanstalk
featured: false
draft: true
tags:
  - AWS
  - Elastic Beanstalk
  - Angular
  - DevOps
description: AWS Elastic Beanstalk lets us deploy applications without managing the infrastructure by hand. Let's see how to package an Angular application, serve it with Node.js and deploy it with the EB CLI, and when S3 with CloudFront is a better fit.
---

## What is Elastic Beanstalk?

Elastic Beanstalk (EB) is a service that provisions the infrastructure for us: EC2 instances, load balancer, auto scaling and health monitoring. We upload the code and EB takes care of the rest, while we can still access the underlying resources if needed.

An Angular application is static after the build, so before starting, keep in mind that **S3 + CloudFront is usually cheaper and simpler** for a pure single page app. EB makes sense when you also need a server, for example Angular SSR, or when your team already runs everything on EB.

## 1. Build the application

```bash
ng build --configuration production
```

The output goes to `dist/<project>/browser`.

## 2. Serve it with a small Node.js server

EB's Node.js platform runs `npm start`, so we add a tiny Express server that serves the static files and falls back to `index.html` so the Angular router works.

```ts
import express from "express";
import path from "node:path";

const app = express();
const dist = path.join(__dirname, "dist/my-app/browser");

app.use(express.static(dist));
app.get("*", (_req, res) => res.sendFile(path.join(dist, "index.html")));

app.listen(process.env.PORT || 8080);
```

```json
{
  "scripts": {
    "start": "node server.js"
  }
}
```

EB's Node.js platform proxies traffic to the port in the `PORT` environment variable, so we read it instead of hardcoding one.

## 3. Deploy with the EB CLI

```bash
pip install awsebcli
eb init my-angular-app --platform node.js --region us-east-1
eb create my-angular-env
eb deploy
eb open
```

`eb init` configures the application, `eb create` creates the environment (this takes a few minutes) and `eb deploy` uploads a new version afterwards.

## 4. Environment configuration

Use `.ebextensions` or the console to set environment variables and the Node version. Never commit secrets to the repository, store them in the environment configuration or in AWS Secrets Manager.

## Automating with CI

In your pipeline, build first and then run `eb deploy` with credentials from an IAM role or from OIDC instead of long-lived access keys.

## Conclusion

Elastic Beanstalk is a good middle ground between managing EC2 by hand and a fully managed container platform. For a static Angular app consider S3 and CloudFront first, and use EB when you need a Node server next to your app.
