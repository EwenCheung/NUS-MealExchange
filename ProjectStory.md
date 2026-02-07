# Project Story - NUS MealExchange

## Inspiration

It started with a simple question during a late-night study session: _"Why does all this food go to waste?"_

In NUS (National University of Singapore), thousands of students live in Halls and Residential Colleges (RCs) with mandatory meal plans. The problem? Schedule conflicts, classes overrun, or just the desire to eat somewhere else often lead to skipped meals and wasted credits. Meanwhile, students in other halls get bored of their own daily menu and crave variety but can't access other dining halls easily.

We realized there was a huge inefficiencies gap: some students are throwing away paid meals, while other students are paying cash to eat outside because they can't access those very meals.

> **Our Vision:**
>
> Ever wanted to eat at another hall or RC? Bored of your own dining hall food? Looking to socialize — but without a forced reason?
>
> NUS MealExchange lets NUS students exchange meal credits across halls, RCs, and NUSC through a secure, token-based marketplace. It’s safe, campus-exclusive, and turns unused meal credits into meals, conversations, and new connections.

## What it does

**NUS MealExchange** essentially gamifies the dining experience by turning meal credits into a flexible currency.

1.  **The Marketplace:** Students can browse _Offers_ (someone willing to host a guest) or post _Requests_ (someone looking for a host).
2.  **Token Economy:** We introduced a custom "Meal Token" system to facilitate fair exchange between different tiers (Halls vs. RCs vs. NUSC).
3.  **Secure Escrow:** When a deal is struck, tokens are held in a secure escrow. They are only released when both parties verify the meal exchange has happened.
4.  **Social Connection:** It’s not just a transaction. The app facilitates a chat between students from different faculties and backgrounds who might never meet otherwise. You meet up, exchange a meal, and maybe make a new friend.
5.  **Trust & Safety:** Verified heavily through `@u.nus.edu` email authentication and a trust-based rating system.

## Built with

*   **Frontend:** [React 19](https://react.dev/), [Vite](https://vitejs.dev/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS](https://tailwindcss.com/)
*   **Backend:** [Node.js](https://nodejs.org/), [Express](https://expressjs.com/)
*   **Database & Auth:** [Supabase](https://supabase.com/) (PostgreSQL, Realtime, Auth, Storage)
*   **Deployment:** [Vercel](https://vercel.com/)


## How we built it

We aimed for a "Premium" feel with a robust, scalable architecture.

*   **Frontend:** Built with **React 19** and **Vite** for lightning-fast performance. We used **Tailwind CSS** to craft a modern, glassmorphic UI that feels native and responsive.
*   **Backend & Database:** We leveraged **Supabase** for its powerful PostgreSQL database and Realtime capabilities.
*   **Security:** This was paramount. We implemented **Row Level Security (RLS)** policies in Postgres to ensure data privacy. We also built a custom API with **Node.js/Express** to handle sensitive logic like the token escrow and email OTP verification (using **Resend**).
*   **Real-time:** We used Supabase Realtime subscriptions to power the instant chat and live deal status updates, so users know the second their offer is accepted.

## Challenges we ran into

**The "Double Don't" Problem:**
One of the biggest headaches was managing the state of a deal. What if two people accept an offer at the exact same millisecond? We had to implement strict database transactions and atomic updates to ensure that once a deal is locked, no one else can snag it, preventing "double spending" of meal credits.

**Balancing Security vs. UX:**
We wanted the app to feel casual and fun, but it deals with real value (meal credits). Finding the right balance between a friction-less signup and a secure, verified identity (handling OTPs and NUS email validation) took several iterations to get right.

**The "Flake" Factor:**
Human behavior is unpredictable. What if someone cancels at the last minute? We had to design an Escrow logic that fairly handles cancellations—refunding tokens if a deal is cancelled early, but protecting the provider if the guest simply doesn't show up.

**The "Deserter" Dilemma:**
What if people spend tokens but never pay them back? To prevent bad debt, we set a strict **credit floor of -2 tokens**. We also enforced accountability by linking accounts to official NUS emails—if you try to game the system, you get **blacklisted**, ensuring our community remains trustworthy.

## Accomplishments that we're proud of

*   **Bank-Grade Escrow Logic:** Successfully implementing a secure token escrow system that protects users from fraud.
*   **Real-Time "Magic":** Seeing the chat and status updates happen instantaneously across devices without a page reload feels incredibly satisfying.
*   **The UI Polish:** We spent extra time on micro-interactions and the visual design. The app doesn't just work; it feels good to use. Use of glassmorphism and smooth transitions makes it stand out from typical utility apps.
*   **Community Focus:** We didn't just build a tool; we built a platform for connection. The "Social" aspect is baked into the meaningful interactions the app encourages.

## What we learned

*   **Trust is a Feature:** In a peer-to-peer marketplace, trust isn't just about code security; it's about UI cues, ratings, and transparent processes that make users feel safe interacting with strangers.
*   **State Management is Key:** With complex deal flows (Pending -> Accepted -> Verified -> Completed), managing state on both the frontend and backend requires rigorous planning to avoid "zombie" states.
*   **Supabase is Powerful:** We learned to lean on the database for heavy lifting (RLS, Triggers) which simplified our backend code significantly.

## What's next for MealExchange

*   **Mobile App:** Launching a native iOS/Android version using React Native for better notifications and location services.
*   **Smart Matching:** Implementing an AI algorithm to suggest dining partners based on shared interests or course schedules.
*   **Official Integration:** Partnering with NUS Dining to streamline the credit transfer process directly, removing the need for physical meetups for credit redemption.