# MealExchange - Complete Project Specification

## Overview

A mobile-first web platform for NUS students to exchange hall/RC/NUSC meal credits using an internal token economy.

**Tech Stack**: Next.js 14 (App Router) + TypeScript + Tailwind CSS + Supabase

---

## 1. Core Concepts

| Term | Definition |
|------|------------|
| **Credit** | Meal unit (Hall/RC/NUSC) - what users exchange |
| **Token** | Platform currency for in-app payments |
| **Request** | Buyer posts: "I want to eat at X location" |
| **Offer** | Provider posts: "I can bring you to eat at X location" |
| **Deal** | One accept others request/offer |

### Default Token Pricing (user-adjustable)

| Location Type | Default Price |
|---------------|---------------|
| Hall | 1.0 token |
| RC | 1.5 tokens |
| NUSC | 2.0 tokens |

---

## 2. Supported Locations

### Halls (6)
- Eusoff Hall
- Kent Ridge Hall
- King Edward VII Hall
- Raffles Hall
- Sheares Hall
- Temasek Hall

### Residential Colleges (5)
- RVRC
- CAPT
- RC4
- Tembusu
- Acacia

### NUSC (1)
- NUSC

---

## 3. User Authentication

### Requirements
- Email domain: `@u.nus.edu` only
- Sign up with email, password, otp(otp generate by randomizer)
- sign in with email and password
- if not signed in any account, user default as guest, can view whats the opening deals etc, but cannot accept the deal, it must logged in to deal a deal


## 4. Token Economy
### Balance Rules
- New users start at: `0 tokens`
- Minimum balance: `-2 tokens` (max debt)
- No cash-out (tokens stay in platform)

### Debt Restrictions
When `token_balance == -2`:
- ❌ Cannot create token-paid requests
- ❌ Cannot accept token offers
- ✅ Can provide meals (earn tokens)
- ✅ Can do cash deals

---

## 5. Marketplace Flows

### Flow A: Meal Request (Buyer)

```
1. Buyer creates request:
   - Location (Hall/RC/NUSC + specific place)
   - Meal time (breakfast/dinner + date)
   - Payment method (token/cash)
   - Token price/cash amount (default pre-filled)
   - Expiry (default: 24 hours)

2. Request appears in marketplace

3. Provider accepts:
   - If token payment: buyer's tokens locked in escrow
   - Deal created, chat opens

4. Completion:
   - buyer click on deal complete
   - Escrow released to provider
```

### Flow B: Meal Offer (Provider)

```
1. Provider creates offer:
   - Location (Hall/RC/NUSC + specific place)
   - Meal time ( specific date or anydate etc)
   - Token price (can discount: "Hall meal 0.7 token")
   - Expiry

2. Offer appears in marketplace

3. Buyer accepts:
   - If token payment: buyer's tokens locked
   - Deal created, chat opens

4. Same completion flow
```

---

## 6. Deal States

```
pending → accepted → completed
                  ↘ cancelled
                  ↘ expired
```

| State | Description |
|-------|-------------|
| `pending` | Listed in marketplace, no match yet |
| `accepted` | Matched, escrow locked (if token), chat active |
| `completed` | Verification code entered, tokens transferred |
| `cancelled` | Either party cancelled, escrow returned |
| `expired` | Time limit passed, escrow returned |

---

## 7. Pages (Mobile-First)

| Page | Route | Purpose |
|------|-------|---------|
| Home | `/` | Marketplace with Requests/Offers tabs |
| Create Request | `/create/request` | Form to post request |
| Create Offer | `/create/offer` | Form to post offer |
| Active Deals | `/deals` | User's ongoing deals |
| Deal Chat | `/deals/[id]` | Chat + completion for specific deal |
| Wallet | `/wallet` | Balance, transaction history |
| Profile | `/profile` | User settings, logout |
| Blacklist | `/blacklist` | Public list of blacklisted users |
| Login | `/login` | Email and password input to login |
| SignUp | `/signup` | signup for new users |

---
