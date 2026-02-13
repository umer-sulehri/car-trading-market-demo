import React, { useState } from 'react';
import FeaturePlans from '@/components/featured-cars/FeaturePlans';
import StripePaymentForm from '@/components/featured-cars/StripePaymentForm';
import styles from './FeatureCarFlow.module.css';

interface FeaturePlan {
    id: number;
    name: string;
    price: number;
    duration_days: number;
    credits_count: number;
    duration_in_days_featured: number;
    top_listing: boolean;
    urgent_badge: boolean;
    homepage_slider: boolean;
    daily_renew: boolean;
    border_color: string;
    status: string;
}

interface FeatureCarFlowProps {
    carId: number;
    userCredits?: number;
    onSuccess: (featuredData: any) => void;
    onCancel: () => void;
}

export const FeatureCarFlow: React.FC<FeatureCarFlowProps> = ({
    carId,
    userCredits = 0,
    onSuccess,
    onCancel
}) => {
    const [step, setStep] = useState<'select' | 'payment' | 'success'>('select');
    const [selectedPlan, setSelectedPlan] = useState<FeaturePlan | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<'credits' | 'stripe' | null>(null);
    const [successData, setSuccessData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSelectPlan = (plan: FeaturePlan) => {
        setSelectedPlan(plan);
        setError(null);

        // Check if user has enough credits
        if (userCredits >= plan.credits_count) {
            setPaymentMethod('credits');
        } else {
            setPaymentMethod('stripe');
        }
    };

    const handleProceed = async () => {
        if (!selectedPlan) {
            setError('Please select a plan');
            return;
        }

        if (paymentMethod === 'credits') {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/featured-listings`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        car_id: carId,
                        plan_id: selectedPlan.id
                    })
                });

                const data = await response.json();

                if (!response.ok) {
                    setError(data.message || 'Failed to create featured listing');
                    return;
                }

                setSuccessData(data.data);
                setStep('success');
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            }
        } else {
            setStep('payment');
        }
    };

    const handlePaymentSuccess = (paymentData: any) => {
        setSuccessData(paymentData.data);
        setStep('success');
    };

    const handlePaymentError = (error: string) => {
        setError(error);
    };

    if (step === 'select') {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2>Feature This Car</h2>
                    <button className={styles.closeBtn} onClick={onCancel}>✕</button>
                </div>

                {error && <div className={styles.error}>{error}</div>}

                <FeaturePlans
                    onSelectPlan={handleSelectPlan}
                    selectedPlanId={selectedPlan?.id}
                />

                {selectedPlan && (
                    <div className={styles.paymentMethodSelector}>
                        <h3>How would you like to pay?</h3>

                        {userCredits >= selectedPlan.credits_count && (
                            <label className={styles.methodOption}>
                                <input
                                    type="radio"
                                    value="credits"
                                    checked={paymentMethod === 'credits'}
                                    onChange={(e) => setPaymentMethod(e.target.value as 'credits' | 'stripe')}
                                />
                                <div>
                                    <strong>Use Available Credits</strong>
                                    <p>You have {userCredits} credits. This plan requires {selectedPlan.credits_count} credit(s)</p>
                                </div>
                            </label>
                        )}

                        <label className={styles.methodOption}>
                            <input
                                type="radio"
                                value="stripe"
                                checked={paymentMethod === 'stripe'}
                                onChange={(e) => setPaymentMethod(e.target.value as 'credits' | 'stripe')}
                            />
                            <div>
                                <strong>Pay with Card (Stripe)</strong>
                                <p>Rs. {selectedPlan.price.toLocaleString()}</p>
                            </div>
                        </label>
                    </div>
                )}

                <div className={styles.actions}>
                    <button className={styles.cancelBtn} onClick={onCancel}>
                        Cancel
                    </button>
                    <button
                        className={styles.proceedBtn}
                        onClick={handleProceed}
                        disabled={!selectedPlan || !paymentMethod}
                    >
                        Proceed to {paymentMethod === 'credits' ? 'Feature' : 'Payment'}
                    </button>
                </div>
            </div>
        );
    }

    if (step === 'payment') {
        return (
            <div className={styles.container}>
                <StripePaymentForm
                    carId={carId}
                    planId={selectedPlan?.id || 0}
                    planName={selectedPlan?.name || ''}
                    amount={selectedPlan?.price || 0}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                />
                <button className={styles.backBtn} onClick={() => setStep('select')}>
                    ← Back to Plan Selection
                </button>
            </div>
        );
    }

    if (step === 'success' && successData) {
        return (
            <div className={styles.succcessContainer}>
                <div className={styles.successCard}>
                    <div className={styles.checkmark}>✓</div>
                    <h2>Car Featured Successfully!</h2>
                    <p className={styles.plan}>{selectedPlan?.name} Plan</p>

                    <div className={styles.details}>
                        <div className={styles.detailRow}>
                            <span>Featured Duration:</span>
                            <strong>{selectedPlan?.duration_in_days_featured} days</strong>
                        </div>
                        <div className={styles.detailRow}>
                            <span>Featured Until:</span>
                            <strong>{new Date(successData.expires_at).toLocaleDateString('en-PK')}</strong>
                        </div>
                        {paymentMethod === 'credits' && (
                            <div className={styles.detailRow}>
                                <span>Credits Used:</span>
                                <strong>{selectedPlan?.credits_count}</strong>
                            </div>
                        )}
                        {paymentMethod === 'stripe' && (
                            <div className={styles.detailRow}>
                                <span>Amount Paid:</span>
                                <strong>Rs. {selectedPlan?.price.toLocaleString()}</strong>
                            </div>
                        )}
                    </div>

                    <div className={styles.features}>
                        <h3>Your car now includes:</h3>
                        <ul>
                            {selectedPlan?.top_listing && <li>✓ Top of Listing Position</li>}
                            {selectedPlan?.urgent_badge && <li>✓ Urgent Badge</li>}
                            {selectedPlan?.homepage_slider && <li>✓ Homepage Slider Visibility</li>}
                            {selectedPlan?.daily_renew && <li>✓ Daily Top Position Renewal</li>}
                        </ul>
                    </div>

                    <div className={styles.actions}>
                        <button className={styles.doneBtn} onClick={() => onSuccess(successData)}>
                            Done
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

export default FeatureCarFlow;
