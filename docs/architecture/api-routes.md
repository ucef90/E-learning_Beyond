# API routes envisagées

## Santé et système

- `GET /api/v1/health`

## Auth

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`
- `POST /api/v1/auth/forgot-password`
- `POST /api/v1/auth/reset-password`

## Utilisateurs

- `GET /api/v1/users/me`
- `PATCH /api/v1/users/me`

## Catalogue

- `GET /api/v1/categories`
- `GET /api/v1/trainings`
- `GET /api/v1/trainings/:slug`
- `GET /api/v1/trainings/:slug/sessions`

## Commercial

- `POST /api/v1/contacts`
- `POST /api/v1/quotes`
- `POST /api/v1/enrollments`

## Learning

- `GET /api/v1/courses/me`
- `GET /api/v1/courses/:id`
- `GET /api/v1/lessons/:id`
- `POST /api/v1/lessons/:id/complete`
- `POST /api/v1/quizzes/:id/attempts`
- `GET /api/v1/progress/me`
- `GET /api/v1/certificates/me`

## Admin futur

- `CRUD /api/v1/admin/trainings`
- `CRUD /api/v1/admin/categories`
- `CRUD /api/v1/admin/sessions`
- `CRUD /api/v1/admin/trainers`
- `CRUD /api/v1/admin/users`
- `CRUD /api/v1/admin/leads`
- `CRUD /api/v1/admin/quotes`
- `CRUD /api/v1/admin/courses`
- `CRUD /api/v1/admin/pages`
