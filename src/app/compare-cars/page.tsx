'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
    getPublicMakes,
    getPublicModels,
    getPublicVersions,
    getPublicVersionFeatures,
    getPublicVersionColors,
    getPublicVersionSpecifications,
} from '@/src/services/admin.lookup.service';
import { getPublicByModel as getModelMedia } from '@/src/services/newCarMedia.service';
import Link from 'next/link';
import Navbar from '@/src/components/Navbar';
import Footer from '@/src/components/Footer';
import { ChevronLeft, X } from 'lucide-react';

interface Make {
    id: number;
    name: string;
    logo?: string;
}

interface CarModel {
    id: number;
    name: string;
    media?: Array<{ id: number; url: string }>;
}

interface Version {
    id: number;
    name: string;
    make?: Make;
    model?: CarModel;
    year?: number;
    cc?: number;
    engine_type?: string;
    engineType?: { id: number; name: string };
    transmission?: { id: number; name: string };
   body_type?: { id: number; name: string } | string;

}

interface ComparisonCar {
    versionId: number;
    version: Version;
    make: Make | null;
    model: CarModel | null;
    media: Array<{ id: number; url: string }>;
    features: any[];
    colors: any[];
    specifications: any[];
}

const YEARS = [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018];

export default function CompareCarsPage() {
    const [makes, setMakes] = useState<Make[]>([]);
    const [models, setModels] = useState<CarModel[]>([]);
    const [versions, setVersions] = useState<Version[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [comparisonCars, setComparisonCars] = useState<ComparisonCar[]>([]);
    
    // Modal state
    const [showCarPopup, setShowCarPopup] = useState(false);
    const [step, setStep] = useState<number>(1);
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const [currentCarIndex, setCurrentCarIndex] = useState<number>(0);
    const [carInfo, setCarInfo] = useState<{ year: number | null; make_id: number | null; make_name: string; model_id: number | null; model_name: string; version_id: number | null; version_name: string }>({
        year: null,
        make_id: null,
        make_name: '',
        model_id: null,
        model_name: '',
        version_id: null,
        version_name: '',
    });

    const [isLoadingModels, setIsLoadingModels] = useState(false);
    const [isLoadingVersions, setIsLoadingVersions] = useState(false);


    const getStringFromValue = (value: any): string => {
        if (typeof value === 'string') return value;
        if (typeof value === 'object' && value?.name) return String((value as any).name);
        if (typeof value === 'number') return String(value);
        return '';
    };

    const maxCars = 3;
    
    // Memoize selected version IDs to prevent infinite loops
    const selectedVersionIds = useMemo(() => comparisonCars.map(c => c.versionId), [comparisonCars]);

    // Fetch makes
    useEffect(() => {
        const fetchMakes = async () => {
            try {
                setLoading(true);
                const makesList = await getPublicMakes();
                setMakes(makesList);
            } catch (err) {
                console.error('Error fetching makes:', err);
                setError('Failed to load car makes');
            } finally {
                setLoading(false);
            }
        };
        fetchMakes();
    }, []);

    // Check screen size (client-side only)
    useEffect(() => {
        // Set initial value on client
        setIsSmallScreen(window.innerWidth < 1024);

        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 1024);
        };
        
        // Add listener
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Fetch models when make is selected
    useEffect(() => {
        if (!carInfo.make_id) {
            setModels([]);
            setVersions([]);
            return;
        }

        let isMounted = true;

        const fetchModels = async () => {
            try {
                setIsLoadingModels(true);
                const modelsList = await getPublicModels(carInfo.make_id!);
                if (isMounted) {
                    setModels(modelsList);
                    setCarInfo(prev => ({ ...prev, model_id: null, model_name: '', version_id: null, version_name: '' }));
                    setVersions([]);
                }
            } catch (err) {
                console.error('Error fetching models:', err);
                if (isMounted) {
                    setError('Failed to load models');
                }
            } finally {
                if (isMounted) {
                    setIsLoadingModels(false);
                }
            }
        };
        
        fetchModels();
        
        return () => {
            isMounted = false;
        };
    }, [carInfo.make_id]);

    // Fetch versions when model is selected
    useEffect(() => {
        if (!carInfo.model_id) {
            setVersions([]);
            return;
        }

        let isMounted = true;

        const fetchVersions = async () => {
            try {
                setIsLoadingVersions(true);
                const versionsList = await getPublicVersions(carInfo.model_id!);
                if (isMounted) {
                    setVersions(versionsList.filter(v => !selectedVersionIds.includes(v.id)));
                    setCarInfo(prev => ({ ...prev, version_id: null, version_name: '' }));
                }
            } catch (err) {
                console.error('Error fetching versions:', err);
                if (isMounted) {
                    setError('Failed to load versions');
                }
            } finally {
                if (isMounted) {
                    setIsLoadingVersions(false);
                }
            }
        };
        
        fetchVersions();
        
        return () => {
            isMounted = false;
        };
    }, [carInfo.model_id, selectedVersionIds]);


    const handleSelectVersion = async (version: Version) => {
        if (comparisonCars.length >= maxCars) return;

        try {
            setLoading(true);

            // Get make and model info
            const selectedMake = makes.find(m => m.id === carInfo.make_id) || null;
            const selectedModel = models.find(m => m.id === carInfo.model_id) || null;

            // Get all details in parallel
            const [media, features, colors, specifications] = await Promise.all([
                getModelMedia(carInfo.model_id!),
                getPublicVersionFeatures(version.id),
                getPublicVersionColors(version.id),
                getPublicVersionSpecifications(version.id),
            ]);

            // Transform features - ensure only strings
            const transformedFeatures = (features || [])
                .map((feature: any) => {
                    if (typeof feature === 'string') return feature;
                    if (typeof feature === 'object' && feature?.name) {
                        const nameValue = typeof feature.name === 'string' ? feature.name : String(feature.name);
                        return nameValue && nameValue !== 'undefined' ? nameValue : null;
                    }
                    return null;
                })
                .filter((f: string | null): f is string => f !== null && f !== '');

            // Transform colors - ensure only strings
            const transformedColors = (colors || [])
                .map((color: any) => {
                    if (typeof color === 'string') return color;
                    if (typeof color === 'object') {
                        const colorName = color?.name || color?.colorName || color?.color?.name;
                        if (typeof colorName === 'string') {
                            return colorName && colorName !== 'undefined' ? colorName : null;
                        }
                        if (typeof colorName === 'object' && colorName?.name) {
                            const extracted = typeof colorName.name === 'string' ? colorName.name : String(colorName.name);
                            return extracted && extracted !== 'undefined' ? extracted : null;
                        }
                    }
                    return null;
                })
                .filter((c: string | null): c is string => c !== null && c !== '');

            // Transform specifications - ensure no objects in rendered output
            const transformedSpecifications = (specifications || [])
                .map((spec: any) => {
                    const getStringValue = (val: any): string => {
                        if (val === null || val === undefined) return '';
                        if (typeof val === 'string') return val;
                        if (typeof val === 'number') return String(val);
                        if (typeof val === 'object') {
                            if (val?.name) return String(val.name);
                            return '';
                        }
                        return '';
                    };

                    const specId = spec?.specification_id || spec?.id;
                    const specName = getStringValue(spec?.name);
                    const specValue = getStringValue(spec?.value);
                    
                    // Filter out invalid specifications
                    if (!specId || !specName) return null;

                    return {
                        id: specId,
                        name: specName || 'Specification',
                        value: specValue || '-',
                        type: getStringValue(spec?.type) || '',
                    };
                })
                .filter((s: any): s is any => s !== null);

            const newCar: ComparisonCar = {
                versionId: version.id,
                version,
                make: selectedMake,
                model: selectedModel,
                media: media || [],
                features: transformedFeatures,
                colors: transformedColors,
                specifications: transformedSpecifications,
            };

            setComparisonCars(prev => [...prev, newCar]);

            // Close modal and reset
            setShowCarPopup(false);
            setStep(1);
            setCarInfo({
                year: null,
                make_id: null,
                make_name: '',
                model_id: null,
                model_name: '',
                version_id: null,
                version_name: '',
            });
            setModels([]);
            setVersions([]);

        } catch (err) {
            console.error('Error selecting version:', err);
            setError('Failed to load car details');
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveCar = (index: number) => {
        setComparisonCars(prev => prev.filter((_, i) => i !== index));
    };

    const openCarModal = () => {
        setShowCarPopup(true);
        setStep(1);
        setCarInfo({
            year: null,
            make_id: null,
            make_name: '',
            model_id: null,
            model_name: '',
            version_id: null,
            version_name: '',
        });
        setModels([]);
        setVersions([]);
    };

    const handleSelectMake = (makeId: number) => {
        const selectedMake = makes.find(m => m.id === makeId);
        setCarInfo(prev => ({
            ...prev,
            make_id: makeId,
            make_name: selectedMake?.name || '',
            model_id: null,
            model_name: '',
            version_id: null,
            version_name: '',
        }));
    };

    const handleSelectModel = (modelId: number) => {
        const selectedModel = models.find(m => m.id === modelId);
        setCarInfo(prev => ({
            ...prev,
            model_id: modelId,
            model_name: selectedModel?.name || '',
            version_id: null,
            version_name: '',
        }));
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-white mt-20">
                {/* Header */}
                <div className="bg-white border-b border-gray-200 sticky top-20 z-40 shadow-sm">
                    <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
                        <Link href="/" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 font-semibold text-gray-700 transition">
                            ← Back
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Compare Cars
                            </h1>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 py-8">
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                            {error}
                        </div>
                    )}

                    {/* Add Car Button or Cars Display */}
                    {comparisonCars.length < maxCars && (
                        <div className="mb-8">
                            <button
                                onClick={openCarModal}
                                className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                            >
                                + Add Car {comparisonCars.length + 1}
                            </button>
                        </div>
                    )}

                    {/* Cars Overview */}
                    {comparisonCars.length > 0 && (
                        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
                            <div className={`grid gap-8 ${comparisonCars.length === 1 ? 'grid-cols-1' : comparisonCars.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
                                {comparisonCars.map((car, idx) => (
                                    <div key={idx} className="text-center">
                                        {/* Car Image */}
                                        <div className="h-48 bg-gray-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden border border-gray-200">
                                            {car.media.length > 0 ? (
                                                <img
                                                    src={car.media[0].url}
                                                    alt={car.version.name}
                                                    className="w-full h-full object-contain"
                                                />
                                            ) : (
                                                <div className="text-gray-400">No Image</div>
                                            )}
                                        </div>

                                        {/* Car Name */}
                                        <h2 className="text-2xl font-bold text-gray-900 mb-1">
                                            {car.make?.name || 'Unknown'}
                                        </h2>
                                        <p className="text-xl font-semibold text-gray-700 mb-1">
                                            {car.model?.name || 'Unknown'}
                                        </p>
                                        <p className="text-sm text-gray-600 mb-4">
                                            {car.version.name}
                                        </p>

                                        {/* Remove Button */}
                                        <button
                                            onClick={() => handleRemoveCar(idx)}
                                            className="text-red-600 hover:text-red-800 text-sm font-semibold"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Add 3rd Car Button */}
                            {comparisonCars.length === 2 && (
                                <div className="mt-8 pt-8 border-t border-gray-200 text-center">
                                    <button
                                        onClick={openCarModal}
                                        className="px-8 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition"
                                    >
                                        + Add 3rd Car to Compare
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Comparison View */}
                    {comparisonCars.length >= 2 && (
                        <div className="space-y-8">
                            {/* Specifications Section */}
                            <div className="bg-white border border-gray-200 rounded-lg p-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Compare Specifications</h2>

                                {/* Basic Specifications Table */}
                                <div className="overflow-x-auto mb-8">
                                    <table className="w-full border border-gray-200">
                                        <thead>
                                            <tr className="bg-gray-50 border-b border-gray-200">
                                                <th className="px-6 py-4 text-left font-semibold text-gray-900">Specification</th>
                                                {comparisonCars.map((car, idx) => (
                                                    <th key={idx} className="px-6 py-4 text-center font-semibold text-gray-900">
                                                        {car.make?.name} {car.model?.name}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {/* Year */}
                                            <tr className="border-b border-gray-200 hover:bg-gray-50">
                                                <td className="px-6 py-4 font-semibold text-gray-900">Year</td>
                                                {comparisonCars.map((car, idx) => (
                                                    <td key={idx} className="px-6 py-4 text-center text-gray-700">
                                                        {car.version.year || 'N/A'}
                                                    </td>
                                                ))}
                                            </tr>

                                            {/* Body Type */}
                                            <tr className="border-b border-gray-200 hover:bg-gray-50">
                                                <td className="px-6 py-4 font-semibold text-gray-900">Body Type</td>
                                                {comparisonCars.map((car, idx) => (
                                                    <td key={idx} className="px-6 py-4 text-center text-gray-700">
                                                       {typeof car.version.body_type === "string"
  ? car.version.body_type
  : car.version.body_type?.name || 'N/A'}

                                                    </td>
                                                ))}
                                            </tr>

                                            {/* Engine Type */}
                                            <tr className="border-b border-gray-200 hover:bg-gray-50">
                                                <td className="px-6 py-4 font-semibold text-gray-900">Engine Type</td>
                                                {comparisonCars.map((car, idx) => (
                                                    <td key={idx} className="px-6 py-4 text-center text-gray-700">
                                                        {car.version.engineType?.name || car.version.engine_type || 'N/A'}
                                                    </td>
                                                ))}
                                            </tr>

                                            {/* Engine Capacity */}
                                            <tr className="border-b border-gray-200 hover:bg-gray-50">
                                                <td className="px-6 py-4 font-semibold text-gray-900">Engine Capacity</td>
                                                {comparisonCars.map((car, idx) => (
                                                    <td key={idx} className="px-6 py-4 text-center text-gray-700 font-mono">
                                                        {car.version.cc ? `${car.version.cc} CC` : 'N/A'}
                                                    </td>
                                                ))}
                                            </tr>

                                            {/* Transmission */}
                                            <tr className="border-b border-gray-200 hover:bg-gray-50">
                                                <td className="px-6 py-4 font-semibold text-gray-900">Transmission</td>
                                                {comparisonCars.map((car, idx) => (
                                                    <td key={idx} className="px-6 py-4 text-center text-gray-700">
                                                        {car.version.transmission?.name || 'N/A'}
                                                    </td>
                                                ))}
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* Technical Specifications */}
                                {comparisonCars.some(car => car.specifications.length > 0) && (
                                    <div className="mb-8">
                                        <h3 className="text-lg font-bold text-gray-900 mb-4">Detailed Specifications</h3>
                                        <div className="overflow-x-auto">
                                            <table className="w-full border border-gray-200">
                                                <thead>
                                                    <tr className="bg-gray-50 border-b border-gray-200">
                                                        <th className="px-6 py-4 text-left font-semibold text-gray-900">Specification</th>
                                                        {comparisonCars.map((car, idx) => (
                                                            <th key={idx} className="px-6 py-4 text-center font-semibold text-gray-900">
                                                                {car.model?.name || 'Model'}
                                                            </th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {comparisonCars[0].specifications.map((spec, specIdx) => {
                                                        let specName = 'Specification';
                                                        if (typeof spec === 'string') {
                                                            specName = spec;
                                                        } else if (typeof spec === 'object' && spec?.name) {
                                                            specName = typeof spec.name === 'string' ? spec.name : String(spec.name);
                                                        }
                                                        return (
                                                            <tr key={spec.id || specIdx} className="border-b border-gray-200 hover:bg-gray-50">
                                                                <td className="px-6 py-4 font-semibold text-gray-900">{specName}</td>
                                                                {comparisonCars.map((car, carIdx) => {
                                                                    const carSpec = car.specifications.find(s => {
                                                                        let sName = 'Specification';
                                                                        if (typeof s === 'string') sName = s;
                                                                        else if (typeof s === 'object' && s?.name) sName = typeof s.name === 'string' ? s.name : String(s.name);
                                                                        return sName === specName;
                                                                    });
                                                                    let specValue = '';
                                                                    if (carSpec) {
                                                                        if (typeof carSpec === 'string') {
                                                                            specValue = carSpec;
                                                                        } else if (typeof carSpec === 'object' && carSpec.value !== undefined && carSpec.value !== null) {
                                                                            if (typeof carSpec.value === 'string') {
                                                                                specValue = carSpec.value;
                                                                            } else if (typeof carSpec.value === 'object') {
                                                                                specValue = carSpec.value?.name ? String(carSpec.value.name) : '';
                                                                            } else if (typeof carSpec.value === 'number') {
                                                                                specValue = String(carSpec.value);
                                                                            }
                                                                        }
                                                                    }
                                                                    return (
                                                                        <td key={carIdx} className="px-6 py-4 text-center text-gray-700">
                                                                            {specValue || '-'}
                                                                        </td>
                                                                    );
                                                                })}
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                {/* Features */}
                                {comparisonCars.some(car => car.features.length > 0) && (
                                    <div className="mb-8">
                                        <h3 className="text-lg font-bold text-gray-900 mb-4">Features & Amenities</h3>
                                        <div className={`grid gap-8 ${comparisonCars.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
                                            {comparisonCars.map((car, idx) => (
                                                <div key={idx}>
                                                    <h4 className="font-semibold text-gray-900 mb-3">
                                                        {getStringFromValue(car.model?.name) || 'Model'}
                                                    </h4>
                                                    {car.features.length > 0 ? (
                                                        <ul className="space-y-2">
                                                            {car.features
                                                                .map((feature, featureIdx) => {
                                                                    let featureName = '';
                                                                    if (typeof feature === 'string') {
                                                                        featureName = feature;
                                                                    } else if (typeof feature === 'object' && feature?.name) {
                                                                        featureName = typeof feature.name === 'string' ? feature.name : String(feature.name);
                                                                    }
                                                                    return featureName ? { key: featureIdx, name: featureName } : null;
                                                                })
                                                                .filter(Boolean)
                                                                .map((featureData: any, idx: number) => (
                                                                    <li key={idx} className="flex items-start gap-2 text-gray-700">
                                                                        <span className="text-green-600 font-bold mt-0.5">✓</span>
                                                                        <span>{featureData?.name}</span>
                                                                    </li>
                                                                ))
                                                            }
                                                        </ul>
                                                    ) : (
                                                        <p className="text-gray-400 italic">No features listed</p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Colors */}
                                {comparisonCars.some(car => car.colors.length > 0) && (
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-4">Available Colors</h3>
                                        <div className={`grid gap-8 ${comparisonCars.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
                                            {comparisonCars.map((car, idx) => (
                                                <div key={idx}>
                                                    <h4 className="font-semibold text-gray-900 mb-3">
                                                        {getStringFromValue(car.model?.name) || 'Model'}
                                                    </h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {car.colors.length > 0 ? (
                                                            car.colors
                                                                .map((vc, colorIdx) => {
                                                                    let colorName = '';
                                                                    if (typeof vc === 'string') {
                                                                        colorName = vc;
                                                                    } else if (typeof vc === 'object') {
                                                                        const nameValue = vc?.color?.name || vc?.name || vc?.colorName;
                                                                        if (typeof nameValue === 'string') {
                                                                            colorName = nameValue;
                                                                        } else if (typeof nameValue === 'object' && nameValue?.name) {
                                                                            colorName = String(nameValue.name);
                                                                        }
                                                                    }
                                                                    return colorName ? { key: colorIdx, name: colorName } : null;
                                                                })
                                                                .filter(Boolean)
                                                                .map((colorData: any, idx: number) => (
                                                                    <span key={idx} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                                                                        {colorData?.name}
                                                                    </span>
                                                                ))
                                                        ) : (
                                                            <p className="text-gray-400 italic">No colors listed</p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Empty State */}
                    {comparisonCars.length === 0 && (
                        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                            <p className="text-gray-600 text-lg mb-6">Start comparing by selecting cars</p>
                            <button
                                onClick={openCarModal}
                                className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition inline-block"
                            >
                                Select Car 1
                            </button>
                        </div>
                    )}
                </div>

                {/* ===== Car Selection Modal ===== */}
                {showCarPopup && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-96 overflow-hidden flex flex-col">
                            {/* Small Screen: Step-by-Step Design */}
                            {isSmallScreen ? (
                                <>
                                    {/* Header */}
                                    <div className="flex justify-between items-center border-b border-gray-200 p-6">
                                        <div>
                                            <h3 className="text-2xl font-semibold text-gray-900">
                                                Select Car
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                Step {step} of 4 • {step === 1 ? "Year" : step === 2 ? "Make" : step === 3 ? "Model" : "Version"}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setShowCarPopup(false)}
                                            className="w-10 h-10 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
                                        >
                                            ✕
                                        </button>
                                    </div>

                                    {/* Body - Step by Step */}
                                    <div className="flex-1 overflow-y-auto p-6">
                                        {step === 1 && (
                                            <StepGrid
                                                title="Select Model Year"
                                                subtitle="Choose the manufacturing year of your car"
                                                data={YEARS}
                                                onSelect={(v: number) => {
                                                    setCarInfo({
                                                        year: v,
                                                        make_id: null,
                                                        make_name: "",
                                                        model_id: null,
                                                        model_name: "",
                                                        version_id: null,
                                                        version_name: "",
                                                    });
                                                    setStep(2);
                                                }}
                                            />
                                        )}
                                        {step === 2 && (
                                            <StepGrid
                                                title="Select Make"
                                                subtitle="Choose the brand of your car"
                                                data={makes}
                                                onBack={() => setStep(1)}
                                                isMakeStep={true}
                                                onSelect={(make: Make) => {
                                                    handleSelectMake(make.id);
                                                    setStep(3);
                                                }}
                                            />
                                        )}
                                        {step === 3 && (
                                            isLoadingModels ? (
                                                <div className="flex items-center justify-center py-8">
                                                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                                    <span className="ml-3 text-gray-600">Loading models...</span>
                                                </div>
                                            ) : (
                                                <StepGrid
                                                    title="Select Model"
                                                    subtitle="Choose your car model"
                                                    data={models}
                                                    onBack={() => setStep(2)}
                                                    onSelect={(model: CarModel) => {
                                                        handleSelectModel(model.id);
                                                        setStep(4);
                                                    }}
                                                />
                                            )
                                        )}
                                        {step === 4 && (
                                            isLoadingVersions ? (
                                                <div className="flex items-center justify-center py-8">
                                                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                                    <span className="ml-3 text-gray-600">Loading versions...</span>
                                                </div>
                                            ) : (
                                                <StepGrid
                                                    title="Select Version"
                                                    subtitle="Choose your car version"
                                                    data={versions}
                                                    onBack={() => setStep(3)}
                                                    onSelect={(version: Version) => {
                                                        handleSelectVersion(version);
                                                    }}
                                                />
                                            )
                                        )}
                                    </div>

                                    {/* Footer Back Button */}
                                    {step > 1 && (
                                        <div className="border-t border-gray-200 p-6">
                                            <button
                                                onClick={() => setStep(step - 1)}
                                                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                            >
                                                ← Back
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <>
                                    {/* Large Screen: Multi Column Layout */}
                                    {/* Header */}
                                    <div className="flex justify-between items-center border-b border-gray-200 p-6">
                                        <div>
                                            <h3 className="text-2xl font-semibold text-gray-900">
                                                Select Your Car
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                Choose Year, Make, Model & Version
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setShowCarPopup(false)}
                                            className="w-10 h-10 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
                                        >
                                            ✕
                                        </button>
                                    </div>

                                    {/* Body - Multi Column Layout */}
                                    <div className="flex-1 overflow-y-auto p-6">
                                        <div className="grid grid-cols-5 gap-4">
                                            {/* Column 1: Year Selection */}
                                            <div className="flex flex-col">
                                                <div className="mb-4">
                                                    <h4 className="text-lg font-semibold text-gray-900 mb-1">Year</h4>
                                                    <p className="text-sm text-gray-600">Select year</p>
                                                </div>
                                                <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                                                    {YEARS.map((year) => (
                                                        <button
                                                            key={year}
                                                            onClick={() => {
                                                                setCarInfo(prev => ({
                                                                    ...prev,
                                                                    year: year,
                                                                    make_id: null,
                                                                    make_name: "",
                                                                    model_id: null,
                                                                    model_name: "",
                                                                    version_id: null,
                                                                    version_name: "",
                                                                }));
                                                            }}
                                                            className={`w-full px-3 py-2 rounded-lg border-2 transition-all text-left font-medium text-sm ${
                                                                carInfo.year === year
                                                                    ? 'border-blue-600 bg-blue-50 text-blue-900'
                                                                    : 'border-gray-200 hover:border-blue-400 text-gray-700'
                                                            }`}
                                                        >
                                                            {year}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Column 2: Make Selection */}
                                            {carInfo.year && (
                                                <div className="flex flex-col">
                                                    <div className="mb-4">
                                                        <h4 className="text-lg font-semibold text-gray-900 mb-1">Make</h4>
                                                        <p className="text-sm text-gray-600">Select brand</p>
                                                    </div>
                                                    <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                                                        {makes.map((make) => (
                                                            <button
                                                                key={make.id}
                                                                onClick={() => handleSelectMake(make.id)}
                                                                className={`w-full px-3 py-2 rounded-lg border-2 transition-all flex items-center gap-2 ${
                                                                    carInfo.make_id === make.id
                                                                        ? 'border-blue-600 bg-blue-50'
                                                                        : 'border-gray-200 hover:border-blue-400'
                                                                }`}
                                                            >
                                                                {make.logo && (
                                                                    <img src={make.logo} alt={make.name} className="w-6 h-6 object-contain" />
                                                                )}
                                                                <span className={`font-medium text-sm ${carInfo.make_id === make.id ? 'text-blue-900' : 'text-gray-700'}`}>
                                                                    {make.name}
                                                                </span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Column 3: Model Selection */}
                                            {carInfo.make_id && (
                                                <div className="flex flex-col">
                                                    <div className="mb-4">
                                                        <h4 className="text-lg font-semibold text-gray-900 mb-1">Model</h4>
                                                        <p className="text-sm text-gray-600">Select model</p>
                                                    </div>
                                                    {isLoadingModels ? (
                                                        <div className="flex items-center justify-center py-8">
                                                            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                                                            {models.map((model) => (
                                                                <button
                                                                    key={model.id}
                                                                    onClick={() => handleSelectModel(model.id)}
                                                                    className={`w-full px-3 py-2 rounded-lg border-2 transition-all text-left font-medium text-sm ${
                                                                        carInfo.model_id === model.id
                                                                            ? 'border-blue-600 bg-blue-50 text-blue-900'
                                                                            : 'border-gray-200 hover:border-blue-400 text-gray-700'
                                                                    }`}
                                                                >
                                                                    {model.name}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Column 4: Version Selection */}
                                            {carInfo.model_id && (
                                                <div className="flex flex-col">
                                                    <div className="mb-4">
                                                        <h4 className="text-lg font-semibold text-gray-900 mb-1">Version</h4>
                                                        <p className="text-sm text-gray-600">Select version</p>
                                                    </div>
                                                    {isLoadingVersions ? (
                                                        <div className="flex items-center justify-center py-8">
                                                            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                                                            {versions.map((version) => (
                                                                <button
                                                                    key={version.id}
                                                                    onClick={() => {
                                                                        setCarInfo(prev => ({
                                                                            ...prev,
                                                                            version_id: version.id,
                                                                            version_name: version.name,
                                                                            year: version.year || prev.year,
                                                                        }));
                                                                    }}
                                                                    className={`w-full px-3 py-2 rounded-lg border-2 transition-all text-left font-medium text-sm ${
                                                                        carInfo.version_id === version.id
                                                                            ? 'border-blue-600 bg-blue-50 text-blue-900'
                                                                            : 'border-gray-200 hover:border-blue-400 text-gray-700'
                                                                    }`}
                                                                >
                                                                    <div>{version.name}</div>
                                                                    <div className="text-xs text-gray-600 font-normal">{version.cc} CC</div>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Column 5: Summary & Confirm */}
                                            {carInfo.version_id && (
                                                <div className="flex flex-col">
                                                    <div className="mb-4">
                                                        <h4 className="text-lg font-semibold text-gray-900 mb-1">Summary</h4>
                                                        <p className="text-sm text-gray-600">Confirm</p>
                                                    </div>
                                                    <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-lg p-4 border-2 border-blue-200 grow flex flex-col">
                                                        <div className="space-y-3 grow">
                                                            <div className="border-b border-blue-200 pb-2">
                                                                <div className="text-xs text-gray-600 font-medium">YEAR</div>
                                                                <div className="text-sm font-semibold text-gray-900">{carInfo.year}</div>
                                                            </div>
                                                            <div className="border-b border-blue-200 pb-2">
                                                                <div className="text-xs text-gray-600 font-medium">MAKE</div>
                                                                <div className="text-sm font-semibold text-gray-900 truncate">{carInfo.make_name}</div>
                                                            </div>
                                                            <div className="border-b border-blue-200 pb-2">
                                                                <div className="text-xs text-gray-600 font-medium">MODEL</div>
                                                                <div className="text-sm font-semibold text-gray-900 truncate">{carInfo.model_name}</div>
                                                            </div>
                                                            <div className="pb-2">
                                                                <div className="text-xs text-gray-600 font-medium">VERSION</div>
                                                                <div className="text-sm font-semibold text-gray-900 truncate">{carInfo.version_name}</div>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => {
                                                                const selectedVersion = versions.find(v => v.id === carInfo.version_id);
                                                                if (selectedVersion) {
                                                                    handleSelectVersion(selectedVersion);
                                                                }
                                                            }}
                                                            className="w-full mt-4 bg-linear-to-r from-blue-600 to-blue-500 text-white py-2 rounded-lg font-semibold text-sm hover:from-blue-700 hover:to-blue-600 transition-all"
                                                        >
                                                            ✓ Confirm
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
}

/* StepGrid Component */
interface StepGridProps<T = any> {
    title: string;
    subtitle?: string;
    data: T[];
    onSelect: (value: T) => void;
    onBack?: () => void;
    isMakeStep?: boolean;
}

function StepGrid<T = any>({ title, subtitle, data, onSelect, isMakeStep = false }: StepGridProps<T>) {
    const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

    const handleImageError = (itemId: string) => {
        setFailedImages(prev => new Set([...prev, itemId]));
    };

    return (
        <>
            <div className="mb-6">
                <h4 className="text-2xl font-semibold text-gray-900 mb-1">{title}</h4>
                {subtitle && <p className="text-gray-600 text-sm">{subtitle}</p>}
            </div>

            <div className={`${isMakeStep ? 'grid grid-cols-2 gap-4 overflow-y-auto max-h-[60vh]' : 'flex flex-col space-y-3 overflow-y-auto max-h-[60vh] pr-2'}`}>
                {Array.isArray(data) && data.map((item: any) => {
                    const displayText = typeof item === 'object' && item !== null && 'name' in item ? item.name : String(item);
                    const logoUrl = isMakeStep && item.logo ? item.logo : null;
                    const itemKey = String(item.id ?? item);
                    const imageFailed = failedImages.has(itemKey);

                    return (
                        <button
                            key={itemKey}
                            onClick={() => onSelect(item)}
                            className={`rounded-xl p-4 text-left hover:border-blue-600 hover:bg-blue-50 hover:shadow-md transition-all active:scale-[0.98] border-2 border-gray-200 ${isMakeStep ? 'flex flex-col items-center justify-center h-36' : 'w-full'}`}
                        >
                            {logoUrl && !imageFailed ? (
                                <>
                                    <img
                                        src={logoUrl}
                                        alt={displayText}
                                        className="h-12 w-12 object-contain mb-2"
                                        onError={() => handleImageError(itemKey)}
                                    />
                                    <div className="text-center">
                                        <div className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors">
                                            {displayText}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors">
                                    {displayText}
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
        </>
    );
}
