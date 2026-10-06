---
title: React Patterns That Scale - Hooks, State and Rendering
author: Joan Serna Leiton
pubDatetime: 2026-10-05T12:20:00Z
slug: react-hooks-patterns-that-scale
featured: false
draft: true
tags:
  - React
  - TypeScript
  - Hooks
description: React applications get harder to maintain as they grow. Let's review some patterns that keep components small and predictable, custom hooks, where to keep state, and how to avoid unnecessary renders.
---

# React Patterns That Scale - Hooks, State and Rendering

## The problem

A component that starts with one `useState` can end up fetching data, formatting it, handling errors and rendering a table. At that point it is hard to test and hard to read. These patterns help us avoid that.

## Extract logic into custom hooks

A custom hook is just a function that uses other hooks. It lets us separate the "how" from the "what is shown".

```tsx
function useDebouncedValue<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}
```

Note the cleanup function returned by `useEffect`: forgetting it is the React version of the memory leaks we see with RxJS subscriptions.

## Keep state close to where it is used

Start with local state. Lift it up only when two siblings need it. Use context for values that really are global, such as the theme or the session, because every consumer re-renders when the context value changes.

For server data, prefer a dedicated library such as TanStack Query instead of `useEffect` and `useState`: it gives caching, deduplication and retries for free.

## Derive instead of synchronize

A common mistake is storing a value that can be computed from other state.

```tsx
// Avoid: two sources of truth
const [items, setItems] = useState<Item[]>([]);
const [total, setTotal] = useState(0);

// Better: derive it
const total = items.reduce((sum, item) => sum + item.price, 0);
```

## Avoid unnecessary renders, but measure first

`memo`, `useMemo` and `useCallback` are useful when profiling shows a real problem, for example an expensive child that receives the same props. Adding them everywhere makes code harder to read and rarely helps. Use the React DevTools profiler before optimizing.

## Keys and lists

Always use a stable, unique `key`, such as an id. Using the array index causes bugs when the list is reordered or filtered.

## Conclusion

Small components, custom hooks, state close to its usage and derived values go a long way. Measure before optimizing and let the profiler guide you.
