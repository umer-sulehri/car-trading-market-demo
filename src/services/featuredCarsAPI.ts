// API Service for Featured Cars
import apiClient from "@/src/lib/api/apiClient";

export const featuredCarsAPI = {
    // Get all feature plans (Public)
    getPlans: async () => {
        return apiClient.get('/feature-plans');
    },

    // Get single plan
    getPlan: async (planId: number) => {
        return apiClient.get(`/feature-plans/${planId}`);
    },

    // Purchase a plan and get credits
    purchasePlan: async (planId: number) => {
        return apiClient.post(`/feature-plans/${planId}/purchase`);
    },

    // Get user's featured listings
    getUserFeaturedListings: async () => {
        return apiClient.get('/featured-listings');
    },

    // Get specific car's featured details
    getCarFeaturedDetails: async (carId: number) => {
        return apiClient.get(`/featured-listings/${carId}`);
    },

    // Create featured listing using credits
    createFeatureWithCredits: async (carId: number, planId?: number) => {
        const payload: any = { car_id: carId };
        // Only include plan_id if it's provided and not 0
        if (planId && planId > 0) {
            payload.plan_id = planId;
        }
        return apiClient.post('/featured-listings', payload);
    },

    // Get Stripe payment intent
    createPaymentIntent: async (carId: number, planId: number, email: string, name: string) => {
        return apiClient.post('/stripe/payment-intent', {
            car_id: carId,
            plan_id: planId,
            email,
            name
        });
    },

    // Confirm Stripe payment
    confirmPayment: async (paymentIntentId: string, carId: number, planId: number) => {
        return apiClient.post('/stripe/confirm-payment', {
            payment_intent_id: paymentIntentId,
            car_id: carId,
            plan_id: planId
        });
    },

    // Process payment callback
    processPaymentCallback: async (
        carId: number,
        planId: number,
        stripePaymentId: string,
        stripeTransactionId: string
    ) => {
        return apiClient.post('/stripe/process-callback', {
            car_id: carId,
            plan_id: planId,
            stripe_payment_id: stripePaymentId,
            stripe_transaction_id: stripeTransactionId
        });
    },

    // Renew featured listing
    renewFeatured: async (featuredId: number) => {
        return apiClient.put(`/featured-listings/${featuredId}/renew`);
    },

    // Cancel featured listing
    cancelFeatured: async (featuredId: number) => {
        return apiClient.delete(`/featured-listings/${featuredId}`);
    },

    // Get user's feature credits
    getUserCredits: async () => {
        return apiClient.get('/feature-credits');
    },

    // Admin: Get all plans
    adminGetPlans: async () => {
        return apiClient.get('/admin/feature-plans');
    },

    // Admin: Create plan
    adminCreatePlan: async (planData: any) => {
        return apiClient.post('/admin/feature-plans', planData);
    },

    // Admin: Update plan
    adminUpdatePlan: async (planId: number, planData: any) => {
        return apiClient.put(`/admin/feature-plans/${planId}`, planData);
    },

    // Admin: Toggle plan status
    adminTogglePlanStatus: async (planId: number) => {
        return apiClient.put(`/admin/feature-plans/${planId}/toggle-status`);
    },

    // Admin: Delete plan
    adminDeletePlan: async (planId: number) => {
        return apiClient.delete(`/admin/feature-plans/${planId}`);
    }
};
