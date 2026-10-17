# Connecting My First Words to Google Cloud Storage

**Google Cloud project ID:** `my-first-words-kids`

**GitHub repo:** `Centinell2025/My-First-Words-20-Games-Sound-v5.zip`

**Current state:** The workflow `.github/workflows/google-cloud-storage.yml` is committed, but deployment is **NOT connected** until the project owner performs the steps below. The workflow runs manually only.

## 1. Check billing and create bucket

Open https://console.cloud.google.com/storage/browser?project=my-first-words-kids

If Cloud Storage still requires a billing prepayment or free-trial verification, inspect the terms before authorizing. A $0.00 billing overview **does not** prove there is no pending payment requirement. A budget alert is **not** a spending cap.

Create a uniquely named bucket only when billing and pricing are understood; save its exact name.

## 2. Set up GitHub federation without keys

In Google Cloud:
- Open https://console.cloud.google.com/iam-admin/serviceaccounts?project=my-first-words-kids
- Create a dedicated service account, such as `my-first-words-publisher`, with **only** permission to upload objects to the intended bucket. Grant `Storage Object Admin` **on that bucket**, not project-wide.
- Open https://console.cloud.google.com/iam-admin/workload-identity-pools?project=my-first-words-kids
- Create a Workload Identity Pool and OIDC provider for issuer `https://token.actions.githubusercontent.com`.
- Map `google.subject=assertion.sub` and `attribute.repository=assertion.repository`.
- Restrict the provider with condition `assertion.repository == 'Centinell2025/My-First-Words-20-Games-Sound-v5.zip'`.
- Allow the provider's repository principal to impersonate **only** the publishing service account using `roles/iam.workloadIdentityUser`.
- Copy the provider resource name and service account email. They are identifiers, not passwords.

Official guide: https://github.com/google-github-actions/auth#workload-identity-federation

## 3. Set repository variables

Open https://github.com/Centinell2025/My-First-Words-20-Games-Sound-v5.zip/settings/variables/actions

Set these **Repository variables** (never upload a service account JSON private key):
- `GCS_BUCKET`: exact existing bucket name (no `gs://` prefix)
- `GCP_WORKLOAD_IDENTITY_PROVIDER`: provider resource name `projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/POOL/providers/PROVIDER`
- `GCP_SERVICE_ACCOUNT`: email address of dedicated publishing service account

## 4. Deploy

Open https://github.com/Centinell2025/My-First-Words-20-Games-Sound-v5.zip/actions/workflows/google-cloud-storage.yml

Select **Run workflow**, then inspect the logs. The workflow only uploads public PWA files, not the entire source repository.

**Important:** `cover-official.webp` is currently absent from the repository; upload it before publishing if you want the approved cover visible.

## 5. Website hosting and commercial launch

An object storage bucket is not automatically a safe, HTTPS commercial website. Configure the website index `index.html`, secure HTTPS and appropriate public access separately. Google Cloud Storage HTTPS on a custom domain typically requires additional infrastructure, which can cost money.

**Do not host paid-only game assets publicly and assume a payment button protects them.** Paid access requires proper entitlement enforcement. Children must not be presented with direct purchasing prompts.
