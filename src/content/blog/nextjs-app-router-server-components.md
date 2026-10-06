---
title: Next.js App Router - Server Components, Caching and Data Fetching
author: Joan Serna Leiton
pubDatetime: 2026-10-05T12:30:00Z
slug: nextjs-app-router-server-components
featured: false
draft: true
tags:
  - Next.js
  - React
  - Performance
description: The Next.js App Router changes where our code runs. Server Components, server actions and the caching layers can make applications faster, but only if we understand what runs on the server and what runs in the browser.
---

# Next.js App Router - Server Components, Caching and Data Fetching

## A different mental model

With the App Router, components are **Server Components by default**. They render on the server, can access databases or internal services directly and send no JavaScript for themselves to the browser. Only the components that need interactivity become Client Components.

## Server Components fetch data directly

```tsx
// app/users/page.tsx
export default async function UsersPage() {
  const res = await fetch("https://api.example.com/users");
  const users: User[] = await res.json();

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

There is no `useEffect`, no loading state management in the component and no API key exposed to the client.

## Client Components only where needed

Add `"use client"` to the file that needs state, effects or browser APIs, and keep it as low in the tree as possible.

```tsx
"use client";

export function LikeButton() {
  const [liked, setLiked] = useState(false);
  return <button onClick={() => setLiked(!liked)}>{liked ? "♥" : "♡"}</button>;
}
```

A Server Component can render a Client Component, so most of the page stays on the server and only the button is hydrated.

## Server Actions

Server actions let a form call a function that runs on the server.

```tsx
async function createUser(formData: FormData) {
  "use server";
  await db.user.create({ data: { name: String(formData.get("name")) } });
  revalidatePath("/users");
}
```

Always validate the input and check permissions inside the action, since it is a public endpoint.

## Caching

Next.js has several caching layers and their defaults have changed between versions, so check the documentation of the version you use. In general:

- Choose explicitly whether a fetch should be cached or dynamic.
- Use `revalidatePath` or `revalidateTag` after a mutation.
- Use Suspense and `loading.tsx` to stream parts of the page while the rest loads.

## Conclusion

The App Router rewards keeping most of the work on the server and sending little JavaScript to the browser. Start with Server Components, add Client Components for interactivity and be explicit about caching.
