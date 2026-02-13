import React, { useState, useEffect } from 'react';
import styles from './FeaturedCarDisplay.module.css';

interface CarMedia {
    id: number;
    url: string;
}

interface SellCar {
    id: number;
    title?: string;
    price: number;
    mileage: number;
    media: CarMedia[];
    make?: { name: string };
    version?: { name: string };
    color?: { name: string };
}

interface FeaturePlan {
    id: number;
    name: string;
    top_listing?: boolean;
    urgent_badge?: boolean;
    homepage_slider?: boolean;
    daily_renew?: boolean;
    border_color?: string;
}

interface FeaturedCarDisplayProps {
    car: SellCar;
    plan: FeaturePlan;
    expiresAt: string;
    featured_id: number;
    onRenew?: (featuredId: number) => void;
    onCancel?: (featuredId: number) => void;
    isCompact?: boolean;
}

export const FeaturedCarDisplay: React.FC<FeaturedCarDisplayProps> = ({
    car,
    plan,
    expiresAt,
    featured_id,
    onRenew,
    onCancel,
    isCompact = false
}) => {
    const [daysRemaining, setDaysRemaining] = useState(0);
    const [thumbnailUrl, setThumbnailUrl] = useState('');

    useEffect(() => {
        const calculateDays = () => {
            const now = new Date();
            const expires = new Date(expiresAt);
            const diffTime = expires.getTime() - now.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            setDaysRemaining(Math.max(0, diffDays));
        };

        calculateDays();
        const interval = setInterval(calculateDays, 60000); // Update every minute
        return () => clearInterval(interval);
    }, [expiresAt]);

    useEffect(() => {
        if (car.media && car.media.length > 0) {
            setThumbnailUrl(car.media[0].url);
        }
    }, [car.media]);

    const carTitle = car.title || `${car.make?.name || ''} ${car.version?.name || ''}`.trim();

    if (isCompact) {
        return (
            <div
                className={styles.compactCard}
                style={{
                    borderColor: plan.border_color || '#FF6B6B',
                    borderLeftWidth: '6px'
                }}
            >
                <div className={styles.compactImage}>
                    {thumbnailUrl && <img src={thumbnailUrl} alt={carTitle} />}
                    {plan.urgent_badge && <span className={styles.urgentBadge}>URGENT</span>}                </div>
                <div className={styles.compactContent}>
                    <h4>{carTitle}</h4>
                    <p className={styles.price}>Rs. {car.price.toLocaleString()}</p>
                    <p className={styles.expiresIn}>Expires in {daysRemaining} days</p>
                </div>
            </div>
        );
    }

    return (
        <div
            className={styles.card}
            style={{
                borderColor: plan.border_color || '#FF6B6B',
                borderLeftWidth: '8px'
            }}
        >
            <div className={styles.badgeContainer}>
                {plan.top_listing && <span className={styles.topBadge}>TOP LISTING</span>}
                {plan.urgent_badge && <span className={styles.urgentBadge}>URGENT</span>}
                {plan.homepage_slider && <span className={styles.homepageBadge}>FEATURED</span>}
            </div>

            <div className={styles.imageContainer}>
                {thumbnailUrl && (
                    <img src={thumbnailUrl} alt={carTitle} className={styles.image} />
                )}
                <div className={styles.planLabel}>{plan.name} Plan</div>
            </div>

            <div className={styles.content}>
                <h3>{carTitle}</h3>
                <p className={styles.price}>Rs. {car.price.toLocaleString()}</p>
                <p className={styles.mileage}>{car.mileage?.toLocaleString() || 'N/A'} km</p>

                <div className={styles.features}>
                    <h4>Plan Features:</h4>
                    <ul>
                        {plan.top_listing && <li>✓ Top of Listing</li>}
                        {plan.urgent_badge && <li>✓ Urgent Badge</li>}
                        {plan.homepage_slider && <li>✓ Homepage Slider</li>}
                        {plan.daily_renew && <li>✓ Daily Top Renewal</li>}
                    </ul>
                </div>

                <div className={styles.expiryInfo}>
                    <div className={styles.daysRemaining}>
                        <span className={styles.label}>Days Remaining:</span>
                        <span className={styles.value}>{daysRemaining} days</span>
                    </div>
                    <p className={styles.expiresAt}>
                        Expires on {new Date(expiresAt).toLocaleDateString('en-PK')}
                    </p>
                </div>

                <div className={styles.actions}>
                    {onRenew && (
                        <button className={styles.renewBtn} onClick={() => onRenew(featured_id)}>
                            Renew Featured
                        </button>
                    )}
                    {onCancel && (
                        <button className={styles.cancelBtn} onClick={() => onCancel(featured_id)}>
                            Cancel Featured
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FeaturedCarDisplay;
