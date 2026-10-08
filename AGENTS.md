<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Passport data lives in an in-memory store (src/lib/store.ts) seeded from src/data; why: front-end prototype with dummy data, no backend.
- Warranty rules (expiry, H-30/H-7 reminders, status) live in src/lib/warranty.ts with tests; why: keeps business rules in one testable place.
