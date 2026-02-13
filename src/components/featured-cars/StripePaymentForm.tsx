import React, { useState } from 'react';
import styles from './StripePaymentForm.module.css';

interface StripePaymentFormProps {
    carId: number;
    planId: number;
    planName: string;
    amount: number;
    onSuccess: (paymentData: any) => void;
    onError: (error: string) => void;
    isLoading?: boolean;
}

export const StripePaymentForm: React.FC<StripePaymentFormProps> = ({
    carId,
    planId,
    planName,
    amount,
    onSuccess,
    onError,
    isLoading = false
}) => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvc, setCvc] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsProcessing(true);

        try {
            // Validate inputs
            if (!email || !name || !cardNumber || !expiryDate || !cvc) {
                throw new Error('Please fill in all fields');
            }

            // Get payment intent
            const intentResponse = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/stripe/payment-intent`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                        car_id: carId,
                        plan_id: planId,
                        email,
                        name
                    })
                }
            );

            if (!intentResponse.ok) throw new Error('Failed to create payment intent');

            const intentData = await intentResponse.json();

            // In production, use @stripe/react-stripe-js instead
            // For now, simulate Stripe payment
            const token = `tok_visa_${Date.now()}`;

            // Confirm payment
            const confirmResponse = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/stripe/confirm-payment`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                        payment_intent_id: intentData.payment_intent_id,
                        car_id: carId,
                        plan_id: planId
                    })
                }
            );

            if (!confirmResponse.ok) throw new Error('Payment confirmation failed');

            const paymentData = await confirmResponse.json();
            onSuccess(paymentData);

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Payment failed';
            setError(errorMessage);
            onError(errorMessage);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3>Complete Your Payment</h3>
                <div className={styles.summary}>
                    <p className={styles.plan}>{planName} Plan</p>
                    <p className={styles.amount}>Rs. {amount.toLocaleString()}</p>
                </div>
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="name">Full Name</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        disabled={isProcessing || isLoading}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="email">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        disabled={isProcessing || isLoading}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="cardNumber">Card Number</label>
                    <input
                        type="text"
                        id="cardNumber"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value.slice(0, 16))}
                        placeholder="1234 5678 9012 3456"
                        disabled={isProcessing || isLoading}
                        maxLength={16}
                    />
                </div>

                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label htmlFor="expiryDate">Expiry Date</label>
                        <input
                            type="text"
                            id="expiryDate"
                            value={expiryDate}
                            onChange={(e) => setExpiryDate(e.target.value.slice(0, 5))}
                            placeholder="MM/YY"
                            disabled={isProcessing || isLoading}
                            maxLength={5}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="cvc">CVC</label>
                        <input
                            type="text"
                            id="cvc"
                            value={cvc}
                            onChange={(e) => setCvc(e.target.value.slice(0, 3))}
                            placeholder="123"
                            disabled={isProcessing || isLoading}
                            maxLength={3}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={isProcessing || isLoading || !email || !name}
                >
                    {isProcessing || isLoading ? 'Processing...' : `Pay Rs. ${amount.toLocaleString()}`}
                </button>
            </form>

            <div className={styles.disclaimer}>
                <p>Your payment is secure and encrypted. This is a test interface.</p>
            </div>
        </div>
    );
};

export default StripePaymentForm;
