# Donation Platform Dashboard

A modern, responsive, and feature-rich donation platform dashboard built with **Next.js 14**, **Tailwind CSS**, and **shadcn/ui**. This dashboard helps creators manage their donations, withdrawals, and payout accounts efficiently.

![Dashboard Preview](https://via.placeholder.com/800x400.png?text=Dashboard+Preview)

## 🚀 Features

### 1. Dashboard Overview
-   **Dynamic Data**: Real-time visualization of donation statistics.
-   **Transaction History**: View recent donations with pagination and filtering capabilities.
-   **Date Filtering**: Filter transactions by custom date ranges.

### 2. Support History (`/dashboard/history`)
-   **Interactive Graphs**: 
    -   **Daily Trend**: Line chart showing income for the *Last 30 Days*.
    -   **Monthly Trend**: Line chart showing income for the *Last 12 Months*.
-   **Top 15 Supporters**: A ranked list of top supporters in the *Last 30 Days*, highlighting the top 3 (Gold, Silver, Bronze).
-   **Pinned Support**: Pin up to **3 favorite donations** to a dedicated "Donasi Tersemat" section.
-   **Transaction Table**: Detailed list including:
    -   Supporter Name & Email (if available).
    -   Donation Amount & Message.
    -   Media Attachments (Sound/Video) with "Replay" action.
    -   Donation ID (e.g., `TX-001`).

### 3. Withdrawal Management (`/dashboard/withdrawals`)
-   **Balance Tracking**: View current available balance.
-   **Withdrawal Request**: 
    -   Secure modal for requesting withdrawals.
    -   Automatic calculation of **Service Fee (3%)** and **Admin Fee (Rp 5.000)**.
    -   Input validation (Minimum limit, strict numeric input).
-   **History**: Track statuses of past withdrawal requests.

### 4. Payout Accounts (`/dashboard/payouts`)
-   **Account Management**: Link multiple Bank Accounts or E-wallets (e.g., GoPay, OVO, Dana).
-   **CRUD Actions**: Add, Edit, or Remove payout methods easily.

## 🛠 Tech Stack

-   **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
-   **Charts**: [Recharts](https://recharts.org/)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **Date Handling**: [Moment.js](https://momentjs.com/)
-   **State Management**: React Hooks (`useState`, `useMemo`)

## 📦 Getting Started

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/donation-platform.git
    cd donation-platform
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Run the development server**:
    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```

4.  **Open the app**:
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure

```bash
src/
├── app/
│   ├── (dashboard)/       # Dashboard Layout & Pages
│   │   ├── dashboard/
│   │   │   ├── page.tsx          # Main Dashboard Overview
│   │   │   ├── history/          # Support History Page
│   │   │   ├── withdrawals/      # Withdrawal History Page
│   │   │   └── payouts/          # Payout Accounts Page
│   ├── layout.tsx         # Root Layout
│   └── page.tsx           # Landing Page
├── components/
│   ├── ui/                # Reusable UI Components (shadcn)
│   └── ...
└── lib/                   # Utilities & Helpers
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the [MIT License](LICENSE).
