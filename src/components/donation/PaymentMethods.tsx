"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrisModal } from "@/components/donation/QrisModal";
import { useState } from "react";

interface PaymentMethodsProps {
  amount: number;
}

export function PaymentMethods({ amount }: PaymentMethodsProps) {
  const [isQrisModalOpen, setIsQrisModalOpen] = useState(false);

  return (
    <>
      <Card className="p-6 border-none shadow-sm">
        <h3 className="font-bold text-sm text-slate-800 mb-4">Metode Pembayaran</h3>
        <div className="space-y-3">
          <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between border-2 border-[var(--color-pastel-yellow)] cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-6 bg-white rounded flex items-center justify-center font-bold text-[9px] text-slate-800 shadow-sm border border-slate-100">
                QRIS
              </div>
              <span className="text-xs font-bold text-slate-700">GoPay, OVO, Dana</span>
            </div>
            <div className="w-5 h-5 rounded-full bg-[var(--color-accent-yellow)] flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white"></div>
            </div>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between opacity-50 cursor-not-allowed">
            <div className="flex items-center gap-3">
              <div className="w-10 h-6 bg-white rounded flex items-center justify-center font-bold text-[9px] text-blue-600 border border-slate-100">
                PayPal
              </div>
              <span className="text-xs font-bold text-slate-700">International</span>
            </div>
            <div className="w-5 h-5 rounded-full border-2 border-slate-200"></div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 space-y-3">
          <div className="flex justify-between text-xs font-medium text-slate-400">
            <span>Dukungan Dasar</span>
            <span>IDR 5.000</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-bold text-slate-500">Total Pembayaran</span>
            <span className="text-xl font-black text-slate-900">
              IDR {amount.toLocaleString("id-ID")}
            </span>
          </div>
        </div>

        <Button
          className="w-full bg-[var(--color-deep-purple)] hover:bg-[var(--color-deep-purple)]/90 text-white font-bold py-4 rounded-2xl shadow-lg shadow-purple-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
          onClick={() => setIsQrisModalOpen(true)}
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
