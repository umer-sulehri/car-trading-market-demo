import React, { useState, useEffect } from 'react';
import { FeaturedCarDisplay } from './FeaturedCarDisplay';
import styles from './FeaturedCarsDashboard.module.css';

interface FeaturedListing {
    id: number;
    car: any;
    plan: any;
    starts_at: string;
    expires_at: string;
    status: string;
}

interface UserCredits {
    available_credits: number;
    used_credits: number;
    total_credits: number;
}

export const FeaturedCarsDashboard: React.FC = () => {
    const [listings, setListings] = useState<FeaturedListing[]>([]);
    const [credits, setCredits] = useState<UserCredits | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
        // Refresh every 5 minutes
        const interval = setInterval(fetchData, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const token = localStorage.getItem('token');
            if (!token) {
                setError('Please login to view your featured listings');
                return;
            }

            const [listingsRes, creditsRes] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/featured-listings`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/feature-credits`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            ]);

            if (!listingsRes.ok) throw new Error('Failed to load featured listings');
            if (!creditsRes.ok) throw new Error('Failed to load credits');

            const listingsData = await listingsRes.json();
            const creditsData = await creditsRes.json();

            setListings(listingsData.data || []);
            setCredits(creditsData.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load data');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRenew = async (featuredId: number) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/featured-listings/${featuredId}/renew`,
                {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!response.ok) throw new Error('Failed to renew');

            setSuccessMessage('Featured listing renewed successfully!');
            setTimeout(() => setSuccessMessage(null), 3000);
            fetchData();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Renewal failed');
        }
    };

    const handleCancel = async (featuredId: number) => {
        if (!confirm('Are you sure you want to cancel this featured listing?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/featured-listings/${featuredId}`,
                {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );

            if (!response.ok) throw new Error('Failed to cancel');

            setSuccessMessage('Featured listing cancelled. Credits refunded.');
            setTimeout(() => setSuccessMessage(null), 3000);
            fetchData();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Cancellation failed');
        }
    };

    if (isLoading) {
        return <div className={styles.container}><div className={styles.loading}>Loading...</div></div>;
    }

    const activeListing = listings.find(l => l.status === 'active');
    const otherListings = listings.filter(l => l.status !== 'active');

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>My Featured Cars</h2>
                {credits && (
                    <div className={styles.creditsCard}>
                        <div className={styles.creditRow}>
                            <span>Available Credits:</span>
                            <strong>{credits.available_credits}</strong>
                        </div>
                        <div className={styles.creditRow}>
                            <span>Total Used:</span>
                            <strong>{credits.used_credits}</strong>
                        </div>
                    </div>
                )}
            </div>

            {error && <div className={styles.error}>{error}</div>}
            {successMessage && <div className={styles.success}>{successMessage}</div>}

            <section className={styles.section}>
                <h3>Currently Featured</h3>
                {activeListing ? (
                    <FeaturedCarDisplay
                        car={activeListing.car}
                        plan={activeListing.plan}
                        expiresAt={activeListing.expires_at}
                        featured_id={activeListing.id}
                        onRenew={handleRenew}
                        onCancel={handleCancel}
                    />
                ) : (
                    <div className={styles.emptyState}>
                        <p>No currently featured cars</p>
                        <p className={styles.subtext}>Select a plan and feature a car from your listings</p>
                    </div>
                )}
            </section>

            {otherListings.length > 0 && (
                <section className={styles.section}>
                    <h3>Previous Features</h3>
                    <div className={styles.listingsGrid}>
                        {otherListings.map(listing => (
                            <FeaturedCarDisplay
                                key={listing.id}
                                car={listing.car}
                                plan={listing.plan}
                                expiresAt={listing.expires_at}
                                featured_id={listing.id}
                                isCompact={true}
                            />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default FeaturedCarsDashboard;
