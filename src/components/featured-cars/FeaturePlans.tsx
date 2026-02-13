import React, { useState, useEffect } from 'react';
import styles from './FeaturePlans.module.css';

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

interface FeaturePlansProps {
    onSelectPlan: (plan: FeaturePlan) => void;
    selectedPlanId?: number;
    loading?: boolean;
}

export const FeaturePlans: React.FC<FeaturePlansProps> = ({
    onSelectPlan,
    selectedPlanId,
    loading = false
}) => {
    const [plans, setPlans] = useState<FeaturePlan[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/feature-plans`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) throw new Error('Failed to fetch plans');

            const data = await response.json();
            setPlans(data.data || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load plans');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading || loading) {
        return <div className={styles.loading}>Loading feature plans...</div>;
    }

    if (error) {
        return <div className={styles.error}>Error: {error}</div>;
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Choose Your Feature Plan</h2>
            <div className={styles.plansGrid}>
                {plans.map((plan) => (
                    <div
                        key={plan.id}
                        className={`${styles.planCard} ${selectedPlanId === plan.id ? styles.selected : ''}`}
                        style={{
                            borderColor: plan.border_color || '#ddd',
                            borderWidth: selectedPlanId === plan.id ? '3px' : '1px'
                        }}
                        onClick={() => onSelectPlan(plan)}
                    >
                        <div className={styles.planHeader}>
                            <h3 className={styles.planName}>{plan.name}</h3>
                            <div className={styles.price}>
                                <span className={styles.amount}>Rs. {plan.price.toLocaleString()}</span>
                                <span className={styles.duration}>for {plan.duration_days} days</span>
                            </div>
                        </div>

                        <div className={styles.planDetails}>
                            <p className={styles.featured}>
                                <strong>Featured Duration:</strong> {plan.duration_in_days_featured} days
                            </p>
                            <p className={styles.credits}>
                                <strong>Credits:</strong> {plan.credits_count} credit{plan.credits_count > 1 ? 's' : ''}
                            </p>
                        </div>

                        <div className={styles.features}>
                            <h4>Features Included:</h4>
                            <ul>
                                {plan.top_listing && <li>✓ Top of Listing</li>}
                                {plan.urgent_badge && <li>✓ Urgent Badge</li>}
                                {plan.homepage_slider && <li>✓ Homepage Slider</li>}
                                {plan.daily_renew && <li>✓ Daily Top Renewal</li>}
                                {!plan.top_listing && !plan.urgent_badge && !plan.homepage_slider && (
                                    <li>✓ Basic Featured Listing</li>
                                )}
                            </ul>
                        </div>

                        {selectedPlanId === plan.id && (
                            <div className={styles.selectedBadge}>SELECTED</div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeaturePlans;
