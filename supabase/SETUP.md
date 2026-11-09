# Supabase setup

1. In Supabase, open SQL Editor and run `schema.sql` from this folder.
2. In Authentication > Users, invite `bautistajimmy.dev@gmail.com` as a user. Public sign-ups stay disabled.
3. In Authentication > URL Configuration, add the app's local and deployed URLs to the redirect allow list.
4. Put the project URL and publishable (anon) key in `.env.local` as `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`, then restart the app.
5. Open `/admin`, request the email sign-in link, and use it to edit the shared catalog. The home page is public and read-only.

The SQL policies allow everyone to read the catalog and permit writes only for the specified admin email. Never use a service-role key in the browser.
