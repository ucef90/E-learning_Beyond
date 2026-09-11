# Beyond Expertise - Architecture Overview

## Vision produit

La plateforme combine quatre couches complémentaires :

1. Site corporate premium
2. Catalogue de formations orienté conversion
3. Portail client / apprenant
4. Mini LMS natif extensible

## Principes d’architecture

- Séparer clairement le marketing, le catalogue, le CRM commercial et le learning.
- Concevoir un socle compatible avec l’évolution vers un produit SaaS EdTech.
- Garder un schéma de données unifié pour éviter la fragmentation entre vente, opérations et apprentissage.
- Prévoir l’intégration future de services tiers sans dépendance forte à la V1.

## Stack retenue

- Frontend : Next.js, React, TypeScript
- Styling : CSS global modulaire et design tokens partagés
- Backend : NestJS, TypeScript
- Base de données : PostgreSQL
- ORM : Prisma
- Auth : JWT access + refresh
- Déploiement : Docker-friendly, variables d’environnement, staging/prod ready

## Domaines métier

- `marketing`
- `catalog`
- `sales`
- `accounts`
- `learner`
- `lms`
- `cms`
- `notifications`
- `admin`

## Modules backend initialisés

- `health`
- `auth`
- `users`
- `categories`
- `trainings`
- `contacts`
- `quotes`
- `courses`

## Évolution prévue

- Paiement en ligne
- Multi-tenant B2B
- Administration complète
- Reporting avancé
- Connecteurs LMS externes
- SCORM / xAPI si besoin
