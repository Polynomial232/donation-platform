"use client";

import { useState, useEffect } from "react";
import { DonationForm } from "./DonationForm";
import { MediaShareForm } from "./MediaShareForm";
import { SoundList } from "./SoundList";
import { PaymentMethods } from "./PaymentMethods";
import { PowerUpEffects } from "./PowerUpEffects";

export function DonationWrapper() {
    const [activeTab, setActiveTab] = useState<"gift" | "sound" | "auction">("gift");
    const [amount, setAmount] = useState<number>(5000);

    // Listen for custom events from other widgets (e.g., VipPerksWidget)
    useEffect(() => {
        const handleUpdateAmount = (event: CustomEvent<number>) => {
            setAmount(event.detail);
        };

        window.addEventListener('update-donation-amount', handleUpdateAmount as EventListener);

        return () => {
            window.removeEventListener('update-donation-amount', handleUpdateAmount as EventListener);
        };
    }, []);

    return (
        <div id="donation-form" className="space-y-6">
            <DonationForm
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                amount={amount}
                setAmount={setAmount}
            />

            {/* <PowerUpEffects /> */}

            {activeTab === "gift" && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                    <MediaShareForm />
                </div>
            )}

            {activeTab === "sound" && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                    <SoundList selectedAmount={amount} onSelectAmount={setAmount} />
                </div>
            )}

            <PaymentMethods amount={amount} />
        </div>
    );
}
