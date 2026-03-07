"use client";

import { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { DonationForm } from "./DonationForm";
import { MediaShareForm } from "./MediaShareForm";
import { SoundList } from "./SoundList";
import { PaymentMethods } from "./PaymentMethods";

import { CreatorSettings, SoundBoardItem } from "@/types/discovery";

const donationSchema = z.object({
  senderName: z.string().min(1, "Nama pengirim diperlukan"),
  email: z.string().email("Email tidak valid").optional().or(z.literal("")),
  message: z.string().optional(),
  amount: z.number().min(1, "Jumlah minimal IDR 1"),
  isEmailPrivate: z.boolean(),
  activeTab: z.enum(["gift", "sound", "auction"]),
});

export type DonationFormValues = z.infer<typeof donationSchema>;

interface DonationWrapperProps {
  settings: CreatorSettings;
  soundBoard?: SoundBoardItem[];
}

export function DonationWrapper({ settings, soundBoard }: DonationWrapperProps) {
  const methods = useForm<DonationFormValues>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      activeTab: "gift",
      amount: settings.minAlertAmount || settings.fastAmounts[0] || 10000,
      isEmailPrivate: false,
      senderName: "",
      email: "",
      message: "",
    },
  });

  const activeTab = methods.watch("activeTab");
  const amount = methods.watch("amount");

  // Listen for custom events from other widgets (e.g., VipPerksWidget)
  useEffect(() => {
    const handleUpdateAmount = (event: CustomEvent<number>) => {
      methods.setValue("amount", event.detail);
    };

    window.addEventListener("update-donation-amount", handleUpdateAmount as EventListener);

    return () => {
      window.removeEventListener("update-donation-amount", handleUpdateAmount as EventListener);
    };
  }, [methods]);

  return (
    <FormProvider {...methods}>
      <div id="donation-form" className="space-y-6">
        <DonationForm settings={settings} />

        {settings.isMediaShareEnabled && activeTab === "gift" && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-300">
            <MediaShareForm />
          </div>
        )}

        {settings.isSoundEnabled && activeTab === "sound" && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-300">
            <SoundList
              data={soundBoard}
              selectedAmount={amount}
              onSelectAmount={(amt) => methods.setValue("amount", amt)}
            />
          </div>
        )}

        <PaymentMethods amount={amount} settings={settings} />
      </div>
    </FormProvider>
  );
}
