"use client";

import { FC } from "react";
import { useRouter } from "next/navigation";
import { Handshake, UserCircle2, ArrowRight, ShieldCheck, Zap, Coins } from "lucide-react";

const SellOptions: FC = () => {
    const router = useRouter();

    const options = [
        {
            title: "Sell it Yourself",
            description: "Post your ad for free and sell your car directly to buyers. You handle the negotiation and paperwork.",
            icon: <UserCircle2 className="w-10 h-10 text-blue-600" />,
            link: "/sell-car",
            features: ["Post for free", "Direct communication", "Handle your own deal"],
            buttonText: "Post an Ad",
            color: "blue"
        },
        {
            title: "We Sell for You",
            description: "Let Kaar4u experts handle everything — from inspection to paperwork. We guarantee the best price.",
            icon: <Handshake className="w-10 h-10 text-orange-600" />,
            link: "/managed-selling",
            features: ["Professional Inspection", "Verified buyers only", "Hassle-free process"],
            buttonText: "Managed Selling",
            color: "orange"
        }
    ];

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-50 rounded-full blur-[120px] -z-10 opacity-60" />
            <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-orange-50 rounded-full blur-[120px] -z-10 opacity-60" />

            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
                        How would you like to <span className="text-blue-600">Sell?</span>
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Choose the selling method that fits your needs. Whether you want full control or a completely hands-off experience, we've got you covered.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                    {options.map((option, idx) => (
                        <div
                            key={idx}
                            className={`group relative p-8 md:p-12 rounded-[2.5rem] border-2 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 flex flex-col h-full
                ${option.color === 'blue'
                                    ? 'bg-blue-50/30 border-blue-100 hover:border-blue-400'
                                    : 'bg-orange-50/30 border-orange-100 hover:border-orange-400'}`}
                        >
                            <div className={`w-20 h-20 rounded-[1.5rem] flex items-center justify-center mb-8 transition-transform group-hover:scale-110 duration-500
                ${option.color === 'blue'
                                    ? 'bg-blue-100'
                                    : 'bg-orange-100'}`}
                            >
                                {option.icon}
                            </div>

                            <h3 className="text-3xl font-bold text-gray-900 mb-4">{option.title}</h3>
                            <p className="text-gray-600 text-lg mb-8 flex-grow">
                                {option.description}
                            </p>

                            <ul className="space-y-4 mb-10">
                                {option.features.map((feature, fIdx) => (
                                    <li key={fIdx} className="flex items-center gap-3 text-gray-700 font-medium text-lg">
                                        {option.color === 'blue'
                                            ? <Zap className="w-5 h-5 text-blue-500" />
                                            : <ShieldCheck className="w-5 h-5 text-orange-500" />}
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => router.push(option.link)}
                                className={`w-full py-5 rounded-2xl text-xl font-bold flex items-center justify-center gap-3 transition-all duration-300 transform active:scale-95
                  ${option.color === 'blue'
                                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200'
                                        : 'bg-orange-600 text-white hover:bg-orange-700 shadow-lg shadow-orange-200'}`}
                            >
                                {option.buttonText}
                                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                            </button>

                            {/* Decorative Corner Icon */}
                            <div className="absolute top-8 right-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                {option.color === 'blue'
                                    ? <Coins className="w-24 h-24 text-blue-600" />
                                    : <Handshake className="w-24 h-24 text-orange-600" />}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SellOptions;
