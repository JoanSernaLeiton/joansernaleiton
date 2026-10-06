---
title: Modern Angular - Standalone, Signals and the New Control Flow
author: Joan Serna Leiton
pubDatetime: 2026-10-05T12:00:00Z
slug: modern-angular-signals-standalone
featured: false
draft: true
tags:
  - Angular
  - Signals
  - TypeScript
description: Angular has changed a lot in the last few versions. Standalone components, signals, the new control flow and the inject function make our code smaller and easier to reason about. Let's see what a modern Angular component looks like today.
---

# Modern Angular - Standalone, Signals and the New Control Flow

## Why talk about "modern" Angular?

If you learned Angular a few years ago, you remember NgModules, constructors full of injected services and `*ngIf` everywhere. That code still works, but the framework has moved on and the new APIs remove a lot of boilerplate.

In this article we will build one small component using the modern building blocks: standalone components, `inject`, signals and the new control flow.

## Standalone components

A standalone component declares its own dependencies, so we no longer need an NgModule just to say "this component uses `RouterLink`".

```ts
@Component({
  selector: "app-user-list",
  standalone: true,
  imports: [RouterLink],
  templateUrl: "./user-list.component.html",
})
export class UserListComponent {}
```

In recent versions `standalone: true` is the default, so you can omit it. Bootstrapping is also simpler:

```ts
bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes), provideHttpClient()],
});
```

## `inject` instead of constructor injection

The `inject` function lets us request a dependency in a field initializer. It is shorter, works well with inheritance and can be reused in plain functions.

```ts
export class UserListComponent {
  private readonly http = inject(HttpClient);
}
```

## Signals

Signals are reactive values that Angular tracks precisely. When a signal changes, only the places that read it are updated.

```ts
export class CounterComponent {
  count = signal(0);
  double = computed(() => this.count() * 2);

  constructor() {
    effect(() => console.log("count is", this.count()));
  }

  increment() {
    this.count.update(value => value + 1);
  }
}
```

- `signal` holds a value.
- `computed` derives a value and is memoized.
- `effect` runs a side effect when the signals it reads change.

If you already use RxJS, you do not need to throw it away. Use `toSignal` to read an observable from a template and `toObservable` for the opposite direction:

```ts
users = toSignal(this.http.get<User[]>("/api/users"), { initialValue: [] });
```

## Signal inputs

Inputs can also be signals, which makes them composable with `computed`:

```ts
export class UserCardComponent {
  user = input.required<User>();
  fullName = computed(() => `${this.user().name} ${this.user().lastName}`);
}
```

## The new control flow

The built-in `@if`, `@for` and `@switch` blocks replace the structural directives and need no imports.

```html
@if (users().length) {
<ul>
  @for (user of users(); track user.id) {
  <li>{{ user.name }}</li>
  }
</ul>
} @else {
<p>No users yet.</p>
}
```

Note that `@for` requires `track`, which avoids the common performance mistake of forgetting `trackBy`.

## Conclusion

Standalone components, `inject`, signals and the new control flow give us less boilerplate and more predictable change detection. You can migrate step by step, the Angular CLI even ships schematics for standalone and control flow, so there is no need to rewrite everything at once.
