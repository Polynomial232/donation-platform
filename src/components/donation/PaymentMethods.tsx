"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrisModal } from "@/components/donation/QrisModal";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";

import { CreatorSettings } from "@/types/discovery";
import type { DonationFormValues } from "./DonationWrapper";

interface PaymentMethodsProps {
  amount: number;
  settings: CreatorSettings;
}

export function PaymentMethods({ amount, settings }: PaymentMethodsProps) {
  const [isQrisModalOpen, setIsQrisModalOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(settings.paymentMethods[0]?.key || "");

  const { watch } = useFormContext<DonationFormValues>();
  const senderName = watch("senderName");
  const email = watch("email");
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const isFormValid =
    !!senderName?.trim() && !!email?.trim() && EMAIL_REGEX.test(email?.trim() ?? "") && amount > 0;

  return (
    <>
      <Card className="p-6 border-none shadow-sm">
        <h3 className="font-bold text-sm text-slate-800 mb-4">Metode Pembayaran</h3>
        <div className="space-y-3">
          {settings.paymentMethods.map((method) => (
            <div
              key={method.key}
              onClick={() => setSelectedMethod(method.key)}
              className={cn(
                "p-4 bg-slate-50 rounded-2xl flex items-center justify-between border-2 transition-all cursor-pointer",
                selectedMethod === method.key
                  ? "border-[var(--color-pastel-yellow)] bg-white shadow-sm"
                  : "border-transparent hover:bg-slate-100"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-6 bg-white rounded flex items-center justify-center font-bold text-[9px] text-slate-800 shadow-sm border border-slate-100 uppercase">
                  {method.key}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-700">{method.name}</span>
                  {method.description && (
                    <span className="text-[10px] text-slate-400 font-medium">
                      {method.description}
                    </span>
                  )}
                </div>
              </div>
              <div
                className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center transition-all",
                  selectedMethod === method.key
                    ? "bg-[var(--color-accent-yellow)] border-transparent"
                    : "border-2 border-slate-200"
                )}
              >
                {selectedMethod === method.key && (
                  <div className="w-2 h-2 rounded-full bg-white animate-in zoom-in duration-300"></div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 space-y-3">
          <div className="flex justify-between text-xs font-medium text-slate-400">
            <span>Dukungan Dasar</span>
            <span>IDR {settings.minAlertAmount.toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-bold text-slate-500">Total Pembayaran</span>
            <span className="text-xl font-black text-slate-900">
              IDR {amount.toLocaleString("id-ID")}
            </span>
          </div>
        </div>

        <Button
          disabled={!isFormValid}
          className={cn(
            "w-full bg-[var(--color-deep-purple)] text-white font-bold py-4 rounded-2xl shadow-lg shadow-purple-200 transition-all",
            isFormValid
              ? "hover:bg-[var(--color-deep-purple)]/90 hover:scale-[1.02] active:scale-[0.98]"
              : "opacity-50 cursor-not-allowed"
          )}
          onClick={() => isFormValid && selectedMethod === "QRIS" && setIsQrisModalOpen(true)}
        >
          DUKUNG SEKARANG
        </Button>

        <p className="text-[10px] text-center text-slate-400 mt-5 font-medium">
          Transaksi aman via DukuNasia Secure Checkout
        </p>
      </Card>

      <QrisModal
        isOpen={isQrisModalOpen}
        onClose={() => setIsQrisModalOpen(false)}
        amount={amount}
      />
    </>
  );
}
