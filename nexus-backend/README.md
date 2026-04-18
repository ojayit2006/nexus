# Nexus - Automated Clearance Protocol (Backend)

This is the backend for the Nexus university graduation clearance platform. It provides APIs for authentication, student management, clearance workflows, document verification, due reconciliation, payment processing, and certificate generation, built on top of Express.js and Supabase.

## Tech Stack
- **Node.js** & **Express**
- **Supabase** (PostgreSQL, Storage, Auth)
- **Anthropic AI** (Automated document verification)
- **Nodemailer** (Email notifications)
- **PDFKit** (Certificate generation)

## Prerequisites
- Node.js (v18+)
- A Supabase account and project

## Supabase Setup Instructions
1. **Create a new project** on [Supabase](https://supabase.com/).
2. **Database Settings**: 
   - Note down your database password.
3. **API Keys**:
   - Go to `Project Settings > API`.
   - Copy the `Project URL`, `anon` public key, and `service_role` secret key.
   - **Important**: Keep the `service_role` key secure, as it bypasses Row Level Security (RLS). We use this key for backend operations.
4. **Storage (Optional yet recommended)**:
   - Create buckets for `documents` and `certificates` in Supabase Storage.
5. **Authentication**:
   - Configure email/password auth under `Authentication > Providers`.

## Local Development Setup

1. **Clone the repository** and navigate to this folder.
   ```bash
   cd nexus-backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Configuration**:
   - Copy the `.env.example` file to a new file called `.env`:
     ```bash
     cp .env.example .env
     ```
   - Update the `.env` file with your specific Supabase keys and other configuration values (Anthropic API Key, SMTP settings, etc.).

4. **Run the development server**:
   ```bash
   npm run dev
   ```
   The server will start on `http://localhost:5000` (or the PORT specified in `.env`).

## Architecture Details
- **Controllers**: Handlers for API endpoints. They use `supabaseAdmin` for database interactions to bypass client-side RLS, ensuring authoritative backend control.
- **Services**: Business logic, external API integrations (Anthropic, Email), and reusable Supabase operations.
- **Routes**: Express routers linking endpoints to their respective controllers.
- **Middleware**: Functions for auth validation, error handling, rate limiting, and file uploads.
