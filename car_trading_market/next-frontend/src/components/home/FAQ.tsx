"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Is it free to post a car?",
    a: "Yes, posting your car is completely free. There are no hidden charges or commissions.",
  },
  {
    q: "How long does it take to get buyer responses?",
    a: "Most sellers start receiving buyer inquiries within 24 hours of posting their car.",
  },
  {
    q: "Do you verify car listings?",
    a: "Yes, all listings go through a basic verification process to ensure authenticity.",
  },
  {
    q: "Can I edit or remove my listing later?",
    a: "Absolutely. You can update or remove your car listing anytime from your dashboard.",
  },
  {
    q: "Is my contact information safe?",
    a: "Your information is shared only with interested buyers. We never sell your data.",
  },
];

export default function FAQ() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-white border rounded-xl p-5 shadow-sm"
            >
              <button
                onClick={() => setActive(active === i ? null : i)}
                className="flex justify-between items-center w-full text-left"
              >
                <span className="font-semibold text-lg">{faq.q}</span>
                <ChevronDown
                  className={`transition-transform ${
                    active === i ? "rotate-180" : ""
                  }`}
                />
              </button>

              {active === i && (
                <p className="text-gray-600 mt-3 leading-relaxed">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
