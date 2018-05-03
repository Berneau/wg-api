There are 3 types of routes: **unprotected, protected** and **admin**. Calls on unprotected routes can be made without sending a JWT. These are *read-only-routes*.

A token is required for admin and protected routes. e.g. as Header: x-access-token **token**. Protected routes are for logged in users only.

To access admin routes in addition to the token also the user has to be an admin. (admin flag in user object). These routes are only used to maintain the application.

Every response is wrapped in an object with an additional "ok"-attribute which is either true or false.
