import React from 'react';
import { X } from 'lucide-react';
import FeaturePlans from './FeaturePlans';

interface FeatureModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectPlan: (plan: any) => void;
    selectedPlanId?: number;
}

export const FeatureModal: React.FC<FeatureModalProps> = ({
    isOpen,
    onClose,
    onSelectPlan,
    selectedPlanId
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Feature Your Car</h2>
                        <p className="text-gray-500 text-sm">Select a plan to get 10x more reach</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6 text-gray-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
                    <FeaturePlans
                        onSelectPlan={onSelectPlan}
                        selectedPlanId={selectedPlanId}
                    />
                </div>

                {/* Footer */}
                <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        Maybe Later
                    </button>
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
                        disabled={!selectedPlanId}
                    >
                        Confirm Plan
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FeatureModal;
