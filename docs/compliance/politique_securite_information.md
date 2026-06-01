# Politique de Sécurité de l'Information (PSI)
## Madrassa App - SaaS Éducatif Multi-Tenant & IA

**Version:** 1.0 (Validée après Audit DevSecOps)  
**Date d'entrée en vigueur:** 01 Juin 2026  
**Classification:** Interne / Confidentiel  
**Normes cibles:** SOC 2 Type II, ISO/IEC 27001:2022, RGPD

---

## 1. Objectif et Périmètre

La présente Politique de Sécurité de l'Information (PSI) établit le cadre de gouvernance pour protéger la confidentialité, l'intégrité et la disponibilité (triptyque CID) des systèmes et des données gérés par **Madrassa App**. 

Le périmètre inclut :
- Le Backend principal (Node.js, Express, ORM Drizzle).
- Le Frontend applicatif (React, Vite).
- L'infrastructure de données (PostgreSQL, Redis).
- Le sous-système d'Intelligence Artificielle (Agents IA via Ollama/LiteLLM, RAG).
- Les mécanismes d'isolation technologique entre les établissements scolaires (Tenants).

## 2. Gouvernance et Organisation

- **Propriété de l'information :** Chaque établissement scolaire (Tenant) est propriétaire de ses données. Madrassa App agit en tant que **Sous-traitant** (Data Processor) au sens du RGPD.
- **Formation :** Tous les développeurs et intervenants techniques disposant d'un accès au référentiel GitHub ou aux bases de production doivent lire et signer cette PSI formellement.
- **Révision annuelle :** Cette PSI sera soumise à une révision obligatoire chaque année ou lors de la publication d'un nouveau standard de conformité.

## 3. Architecture Logique & Isolation Multi-Tenant

L'architecture de Madrassa repose sur une stricte isolation logique.
- **Cloisonnement Applicatif (RBAC) :** Chaque requête HTTP est assignée à un périmètre via son `tenantId` (schoolId).
- **Contrôle Transversal (Row-Level Security) :** La base PostgreSQL enforce l'isolation grâce aux contraintes formelles empêchant la fuite de données inter-tenants.
- **Séparation des Modèles IA :** Les "Skills" locaux pour chaque agent ne reçoivent en contexte informatif que le domaine vectoriel (`ai_document_chunks`) appartenant explicitement au tenant effectuant la requête.

## 4. Gestion des Identités et des Accès (IAM)

- **Authentification forte :** 
  - L'authentification des clients finaux est déléguée au fournisseur d'identité **Firebase Auth**.
  - La validation côté backend est imposée par un SDK `firebase-admin` garantissant qu'aucune usurpation logicielle n'est possible par injection manuelle d'IDs.
- **Privilège minimum (Least Privilege) :** Les routes exposant l'IA, les dashboards financiers ou l'ingestion documentaire sont bloquées pour les étudiants. Des middlewares (`restrictToRole`) forcent la concordance des rôles `Teacher`, `Direction`, `Admin` et `SuperAdmin`.
- **Infrastructure :** Seuls les responsables d'infrastructures pré-approuvés sont autorisés à manipuler le fichier `drizzle.config.ts`, exécuter un `drizzle-kit push` ou accéder au compte hébergeur.

## 5. Cryptographie et Protection des Données

- **Chiffrement au Repos (Data-At-Rest) :** 
  - Les champs relatifs aux informations personnelles identifiables (PII), tels que les téléphones, numéros de parents et salaires des enseignants, subissent un **chiffrement fort (AES-256-GCM)** natif à la couche ORM (Drizzle hooks custom) à l'aide de la clé dérivée `ENCRYPTION_KEY`.
- **Chiffrement en Transit (Data-In-Transit) :**
  - Toutes les communications réseau API et web utilisent le niveau de protocole HTTPS TLS 1.2 minimum via Helmet/HSTS.
  - Les liaisons vers PostgreSQL et Redis s'effectuent via SSL imposé (`rejectUnauthorized: true`).
- **Gestion des Secrets :** Aucun secret ne doit résider dans le code source (Cleartext). Un coffre-fort de secrets (ou variables .env) est injecté lors de l'intégration continue.

## 6. Surveillance, Audit Logs et Traçabilité

- Conformément aux critères SOC 2 CC7.2, l'ensemble des requêtes, des appels API vers les LLMs et des actions manuelles sont archivés dans la table de log chiffrée `audit_logs_drizzle`.
- Chaque nouvelle entrée transactionnelle produit une **signature asymétrique anti-falsification (HMAC-SHA256)** à l'instanciation (`new_data._hmac`). Cette métadonnée assure qu'aucune modification rétroactive de la base log ne peut être entreprise sans se révéler corruptible lors de l'audit.

## 7. Sécurité du Cycle de Vie Logiciel (DevSecOps)

- **Scans systématiques :** Lors de chaque *push* ou *pull-request*, le pipeline GitHub Actions (`security.yml`) réalise trois tests bloquants :
  1. **Analyse des Dépendances (SCA) :** `npm audit` & Snyk pour bloquer les vulnérabilités de bibliothèque.
  2. **Analyse des Conteneurs :** *Trivy* pour balayer le système conteneurisé.
  3. **Prévention des Secrets :** *TruffleHog* pour vérifier l'absence de mots de passe, tokens et IP privées insérés par erreur dans le code source.

## 8. Plan de Réponse aux Incidents (Aperçu)

En cas de fuite de données avérée :
1. **Identification :** Les administrateurs coupent les noeuds Redis / PostgreSQL virtuels hors-ligne et révoquent les *firebase keys* et *LLM keys*.
2. **Investigation :** Le hachage asymétrique `_hmac` des logs d'audit permet d'identifier l'intrusion initiale.
3. **Notification :** Conformément à l'article 33 du RGPD, l'autorité de contrôle (CNIL ou équivalent) est informée dans un délai de 72h avec un rapport d'attaque chiffré.

---
**Approuvé par:** Équipe de Direction - Madrassa App
