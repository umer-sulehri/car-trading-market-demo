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
import { ChevronLeft, X, Plus, Search, Car, CheckCircle2, AlertCircle, Trash2, HelpCircle, Info, ArrowLeftRight, Star, ChevronDown } from 'lucide-react';

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

const getStringFromValue = (value: any): string => {
    if (typeof value === 'string') return value;
    if (typeof value === 'object' && value?.name) return String((value as any).name);
    if (typeof value === 'number') return String(value);
    return '';
};

export default function CompareCars() {
    const [makes, setMakes] = useState<Make[]>([]);
    const [models, setModels] = useState<CarModel[]>([]);
    const [versions, setVersions] = useState<Version[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showDifferencesOnly, setShowDifferencesOnly] = useState(false);

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
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #cbd5e1;
                }
            `}</style>
            <div className="min-h-screen bg-white mt-20">
                {/* Header */}
                <div className="bg-white border-b border-gray-100 py-8">
                    <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <Link href="/" className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-600 transition-all border border-gray-200">
                                <ChevronLeft size={20} />
                            </Link>
                            <div>
                                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                                    Compare <span className="text-blue-600">Cars</span>
                                </h1>
                                <p className="text-gray-500 text-sm mt-1">Side-by-side technical specification comparison</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-gray-400">Slots used:</span>
                            <div className="flex gap-1.5">
                                {[1, 2, 3].map(i => (
                                    <div
                                        key={i}
                                        className={`w-3 h-3 rounded-full ${i <= comparisonCars.length ? 'bg-blue-600' : 'bg-gray-200'}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 py-10">
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                            {error}
                        </div>
                    )}

                    {/* Cars Overview Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        {[0, 1, 2].map((idx) => (
                            <div key={idx} className="relative group">
                                {comparisonCars[idx] ? (
                                    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col">
                                        {/* Remove Button */}
                                        <button
                                            onClick={() => handleRemoveCar(idx)}
                                            className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 shadow-md text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                                            title="Remove Car"
                                        >
                                            <Trash2 size={18} />
                                        </button>

                                        {/* Image Area */}
                                        <div className="h-44 bg-linear-to-b from-gray-50 to-white flex items-center justify-center p-4 border-b border-gray-100 relative overflow-hidden">
                                            {comparisonCars[idx].media.length > 0 ? (
                                                <img
                                                    src={comparisonCars[idx].media[0].url}
                                                    alt={comparisonCars[idx].version.name}
                                                    className="max-w-full max-h-full object-contain drop-shadow-lg scale-110"
                                                />
                                            ) : (
                                                <div className="flex flex-col items-center justify-center text-gray-300">
                                                    <Car size={48} className="mb-2 opacity-20" />
                                                    <span className="text-xs uppercase tracking-wider font-bold opacity-30">No Preview</span>
                                                </div>
                                            )}

                                            <div className="absolute bottom-3 left-3">
                                                <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-tighter">
                                                    Car {idx + 1}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Info Area */}
                                        <div className="p-5 flex-1 flex flex-col">
                                            <div className="mb-3">
                                                <div className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-1">
                                                    {comparisonCars[idx].make?.name}
                                                </div>
                                                <h3 className="text-xl font-extrabold text-gray-900 leading-tight">
                                                    {comparisonCars[idx].model?.name}
                                                </h3>
                                            </div>
                                            <div className="mt-auto">
                                                <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">
                                                    {comparisonCars[idx].version.name}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        onClick={openCarModal}
                                        className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 h-full flex flex-col items-center justify-center p-8 cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all duration-300 group/btn"
                                    >
                                        <div className="w-16 h-16 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center mb-4 group-hover/btn:scale-110 group-hover/btn:text-blue-600 transition-all">
                                            <Plus size={32} strokeWidth={1.5} />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-gray-900 font-bold mb-1">Add Car {idx + 1}</p>
                                            <p className="text-gray-400 text-xs px-4">Select a vehicle to start side-by-side comparison</p>
                                        </div>
                                    </div>
                                )}

                                {idx < 2 && idx < (comparisonCars.length || 0) && (
                                    <div className="hidden lg:flex absolute -right-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white shadow-lg border border-gray-100 items-center justify-center pointer-events-none">
                                        <span className="text-blue-600 font-black italic tracking-tighter text-lg">VS</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Comparison View */}
                    {comparisonCars.length >= 2 && (
                        <div className="relative">
                            {/* Sticky Header for Table */}
                            <div className="sticky top-[80px] z-30 bg-white/95 backdrop-blur-sm border-y border-gray-100 shadow-md -mx-6 px-6 py-4 flex items-center transition-all">
                                <div className="w-1/4 pr-6">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2 text-gray-400">
                                            <ArrowLeftRight size={16} />
                                            <span className="text-[10px] font-bold uppercase tracking-widest">Comparison</span>
                                        </div>
                                        {comparisonCars.length > 1 && (
                                            <button
                                                onClick={() => setShowDifferencesOnly(!showDifferencesOnly)}
                                                className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 border ${showDifferencesOnly
                                                    ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                                                    : 'bg-white border-gray-100 text-gray-400 hover:border-blue-200 hover:text-blue-600'
                                                    }`}
                                            >
                                                <div className={`w-1.5 h-1.5 rounded-full ${showDifferencesOnly ? 'bg-white animate-pulse' : 'bg-gray-200'}`} />
                                                Show Differences
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-6">
                                    {comparisonCars.map((car, idx) => (
                                        <div key={idx} className="flex items-center gap-3 overflow-hidden">
                                            <div className="w-8 h-8 rounded bg-gray-100 flex-shrink-0 flex items-center justify-center p-1">
                                                {car.media.length > 0 ? (
                                                    <img src={car.media[0].url} className="w-full h-full object-contain" />
                                                ) : <Car size={14} className="text-gray-400" />}
                                            </div>
                                            <div className="truncate">
                                                <div className="text-[10px] font-bold text-blue-600 truncate uppercase tracking-tighter">{car.make?.name}</div>
                                                <div className="text-xs font-black text-gray-900 truncate">{car.model?.name}</div>
                                            </div>
                                        </div>
                                    ))}
                                    {comparisonCars.length === 2 && <div className="hidden md:block"></div>}
                                </div>
                            </div>

                            {/* Specification Table */}
                            <div className="mt-8 space-y-12">
                                {/* Basic Specs */}
                                <section>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                            <Info size={20} />
                                        </div>
                                        <h2 className="text-xl font-black text-gray-900">General Overview</h2>
                                    </div>

                                    <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                                        {[
                                            { label: 'Year', key: 'year', icon: <Star size={14} /> },
                                            { label: 'Body Type', key: 'body_type', icon: <Car size={14} /> },
                                            { label: 'Engine', key: 'engine_type', icon: <Info size={14} /> },
                                            { label: 'Capacity', key: 'cc', icon: <ArrowLeftRight size={14} /> },
                                            { label: 'Transmission', key: 'transmission', icon: <ChevronDown size={14} /> }
                                        ].map((row, rowIdx) => {
                                            const values = comparisonCars.map(car => {
                                                if (row.key === 'year') return car.version.year?.toString() || '-';
                                                if (row.key === 'body_type') return getStringFromValue(car.version.body_type) || '-';
                                                if (row.key === 'engine_type') return getStringFromValue(car.version.engine_type) || '-';
                                                if (row.key === 'cc') return car.version.cc?.toString() || '-';
                                                if (row.key === 'transmission') return getStringFromValue(car.version.transmission) || '-';
                                                return '-';
                                            });
                                            const isDifferent = comparisonCars.length > 1 && new Set(values).size > 1;

                                            return (
                                                <div key={rowIdx} className={`flex items-stretch border-b last:border-0 border-gray-50 transition-colors ${showDifferencesOnly && isDifferent ? 'bg-orange-50/50' : rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50/20'} hover:bg-gray-100/50`}>
                                                    <div className="w-1/4 p-5 flex items-center gap-3 border-r border-gray-50">
                                                        <span className={`${showDifferencesOnly && isDifferent ? 'text-orange-500' : 'text-gray-400'}`}>{row.icon}</span>
                                                        <span className={`text-sm font-bold ${showDifferencesOnly && isDifferent ? 'text-orange-900' : 'text-gray-600'}`}>{row.label}</span>
                                                    </div>
                                                    <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-6 p-5">
                                                        {comparisonCars.map((car, carIdx) => (
                                                            <div key={carIdx} className={`text-sm font-bold ${showDifferencesOnly && isDifferent ? 'text-orange-900 italic' : 'text-gray-900'}`}>
                                                                {values[carIdx]}
                                                            </div>
                                                        ))}
                                                        {comparisonCars.length === 2 && <div className="hidden md:block"></div>}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </section>

                                {/* Features Comparison */}
                                <section>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                                            <CheckCircle2 size={20} />
                                        </div>
                                        <h2 className="text-xl font-black text-gray-900">Features & Amenities</h2>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {comparisonCars.map((car, carIdx) => (
                                            <div key={carIdx} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
                                                <div className="flex items-center gap-2 mb-4">
                                                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                                                    <span className="text-xs font-black uppercase text-gray-400 tracking-tighter">{car.model?.name}</span>
                                                </div>
                                                <div className="space-y-3">
                                                    {car.features.length > 0 ? (
                                                        car.features.slice(0, 15).map((f, i) => (
                                                            <div key={i} className="flex items-center gap-3">
                                                                <CheckCircle2 size={14} className="text-green-500 flex-shrink-0" />
                                                                <span className="text-sm text-gray-700 font-medium truncate">{getStringFromValue(f)}</span>
                                                            </div>
                                                        ))
                                                    ) : <p className="text-gray-400 italic text-sm">No data</p>}
                                                    {car.features.length > 15 && (
                                                        <p className="text-xs text-blue-600 font-bold">+{car.features.length - 15} more</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                        {comparisonCars.length === 1 && <div className="hidden md:block"></div>}
                                        {comparisonCars.length === 2 && <div className="hidden md:block"></div>}
                                    </div>
                                </section>

                                {/* Technical Specs Table (Detailed) */}
                                {comparisonCars.some(car => car.specifications.length > 0) && (
                                    <section>
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                                                <ArrowLeftRight size={20} />
                                            </div>
                                            <h2 className="text-xl font-black text-gray-900">Technical Data</h2>
                                        </div>

                                        <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                                            {/* Get unique spec names */}
                                            {Array.from(new Set(comparisonCars.flatMap(c => c.specifications.map(s => s.name)))).map((specName, rowIdx) => {
                                                const values = comparisonCars.map(car => {
                                                    const spec = car.specifications.find(s => s.name === specName);
                                                    return getStringFromValue(spec?.value) || '-';
                                                });
                                                const isDifferent = comparisonCars.length > 1 && new Set(values).size > 1;

                                                return (
                                                    <div key={rowIdx} className={`flex items-stretch border-b last:border-0 border-gray-50 transition-colors ${showDifferencesOnly && isDifferent ? 'bg-orange-50/50' : rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50/20'} hover:bg-gray-100/50`}>
                                                        <div className="w-1/4 p-5 flex items-center gap-3 border-r border-gray-50">
                                                            <span className={`text-sm font-bold ${showDifferencesOnly && isDifferent ? 'text-orange-900' : 'text-gray-600'}`}>{specName}</span>
                                                        </div>
                                                        <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-6 p-5">
                                                            {comparisonCars.map((car, carIdx) => (
                                                                <div key={carIdx} className={`text-sm font-bold ${showDifferencesOnly && isDifferent ? 'text-orange-900 italic' : 'text-gray-900'}`}>
                                                                    {values[carIdx]}
                                                                </div>
                                                            ))}
                                                            {comparisonCars.length === 2 && <div className="hidden md:block"></div>}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </section>
                                )}

                                {/* Features Section */}
                                {comparisonCars.length > 0 && (
                                    <section>
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                                                <CheckCircle2 size={20} />
                                            </div>
                                            <h2 className="text-xl font-black text-gray-900">Standard Features</h2>
                                        </div>

                                        <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                                            {/* Get unique feature names */}
                                            {Array.from(new Set(comparisonCars.flatMap(c => c.features))).map((featureName, rowIdx) => {
                                                const featureValues = comparisonCars.map(car => car.features.includes(featureName));
                                                const isDifferent = comparisonCars.length > 1 && new Set(featureValues).size > 1;

                                                return (
                                                    <div key={rowIdx} className={`flex items-stretch border-b last:border-0 border-gray-50 transition-colors ${showDifferencesOnly && isDifferent ? 'bg-orange-50/50' : rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50/20'} hover:bg-gray-100/50`}>
                                                        <div className="w-1/4 p-5 flex items-center gap-3 border-r border-gray-50">
                                                            <span className={`text-sm font-bold ${showDifferencesOnly && isDifferent ? 'text-orange-900' : 'text-gray-600'}`}>{featureName}</span>
                                                        </div>
                                                        <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-6 p-5">
                                                            {comparisonCars.map((car, carIdx) => (
                                                                <div key={carIdx} className="flex justify-center md:justify-start">
                                                                    {car.features.includes(featureName) ? (
                                                                        <div className={`flex items-center gap-2 ${showDifferencesOnly && isDifferent ? 'text-orange-600 font-black' : 'text-green-600'}`}>
                                                                            <CheckCircle2 size={18} />
                                                                            <span className="text-xs uppercase tracking-tighter">Available</span>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="flex items-center gap-2 text-gray-200">
                                                                            <X size={18} />
                                                                            <span className="text-xs uppercase tracking-tighter">N/A</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ))}
                                                            {comparisonCars.length === 2 && <div className="hidden md:block"></div>}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </section>
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
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[85vh] max-h-[900px] overflow-hidden flex flex-col">
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
                                    <div className="flex-1 overflow-hidden">
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
                                    {/* Large Screen: Premium Selection Layout */}
                                    <div className="flex-1 flex flex-col min-h-0 bg-linear-to-b from-gray-50 to-white">
                                        {/* Header */}
                                        <div className="flex justify-between items-center bg-white border-b border-gray-100 p-6 shadow-xs">
                                            <div>
                                                <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                                                    Build Your <span className="text-blue-600">Comparison</span>
                                                </h3>
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                                                    Step 1-4: Select Vehicle Details
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => setShowCarPopup(false)}
                                                className="w-12 h-12 rounded-full border border-gray-100 hover:bg-gray-100 flex items-center justify-center transition-all bg-white shadow-sm"
                                            >
                                                <X size={20} className="text-gray-400" />
                                            </button>
                                        </div>

                                        <div className="flex-1 min-h-0 overflow-hidden p-8">
                                            <div className="grid grid-cols-5 gap-8 h-full min-h-0">
                                                {/* Column 1: Year */}
                                                <div className="flex flex-col h-full min-h-0">
                                                    <div className="mb-6">
                                                        <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-black mb-3">1</div>
                                                        <h4 className="text-lg font-black text-gray-900 leading-tight">Model Year</h4>
                                                        <div className="h-1 w-8 bg-blue-600 rounded-full mt-2"></div>
                                                    </div>
                                                    <div className="flex-1 overflow-y-auto pr-3 space-y-2 custom-scrollbar">
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
                                                                className={`w-full px-4 py-3 rounded-xl border-2 transition-all text-left font-bold text-sm ${carInfo.year === year
                                                                    ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-md'
                                                                    : 'border-white bg-white hover:border-gray-200 text-gray-500 hover:text-gray-900 shadow-sm'
                                                                    }`}
                                                            >
                                                                {year}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Column 2: Make */}
                                                <div className="flex flex-col h-full min-h-0 bg-white/50 rounded-2xl p-1">
                                                    <div className="p-3 mb-3">
                                                        <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-400 flex items-center justify-center text-xs font-black mb-3 group-data-[active=true]:bg-blue-600 group-data-[active=true]:text-white transition-colors">2</div>
                                                        <h4 className="text-lg font-black text-gray-300 data-[active=true]:text-gray-900 transition-colors" data-active={!!carInfo.year}>Manufacturer</h4>
                                                    </div>
                                                    <div className="flex-1 overflow-y-auto pr-3 space-y-2 custom-scrollbar opacity-50 data-[active=true]:opacity-100 transition-opacity" data-active={!!carInfo.year}>
                                                        {carInfo.year && makes.map((make) => (
                                                            <button
                                                                key={make.id}
                                                                onClick={() => handleSelectMake(make.id)}
                                                                className={`w-full px-4 py-3 rounded-xl border-2 transition-all flex items-center gap-3 ${carInfo.make_id === make.id
                                                                    ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-md'
                                                                    : 'border-white bg-white hover:border-gray-200 text-gray-500 hover:text-gray-900 shadow-sm'
                                                                    }`}
                                                            >
                                                                {make.logo && (
                                                                    <img src={make.logo} alt={make.name} className="w-6 h-6 object-contain grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all" />
                                                                )}
                                                                <span className="font-bold text-sm truncate">{getStringFromValue(make.name)}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Column 3: Model */}
                                                <div className="flex flex-col h-full min-h-0">
                                                    <div className="p-3 mb-3">
                                                        <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-400 flex items-center justify-center text-xs font-black mb-3">3</div>
                                                        <h4 className="text-lg font-black text-gray-300 data-[active=true]:text-gray-900 transition-colors" data-active={!!carInfo.make_id}>Model</h4>
                                                    </div>
                                                    <div className="flex-1 overflow-y-auto pr-3 space-y-2 custom-scrollbar opacity-50 data-[active=true]:opacity-100 transition-opacity" data-active={!!carInfo.make_id}>
                                                        {carInfo.make_id && (
                                                            isLoadingModels ? (
                                                                <div className="flex items-center justify-center py-8">
                                                                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                                                </div>
                                                            ) : models.map((model) => (
                                                                <button
                                                                    key={model.id}
                                                                    onClick={() => handleSelectModel(model.id)}
                                                                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all text-left font-bold text-sm ${carInfo.model_id === model.id
                                                                        ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-md'
                                                                        : 'border-white bg-white hover:border-gray-200 text-gray-500 hover:text-gray-900 shadow-sm'
                                                                        }`}
                                                                >
                                                                    {getStringFromValue(model.name)}
                                                                </button>
                                                            ))
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Column 4: Version */}
                                                <div className="flex flex-col h-full min-h-0 bg-white/50 rounded-2xl p-1">
                                                    <div className="p-3 mb-3">
                                                        <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-400 flex items-center justify-center text-xs font-black mb-3">4</div>
                                                        <h4 className="text-lg font-black text-gray-300 data-[active=true]:text-gray-900 transition-colors" data-active={!!carInfo.model_id}>Variant</h4>
                                                    </div>
                                                    <div className="flex-1 overflow-y-auto pr-3 space-y-2 custom-scrollbar opacity-50 data-[active=true]:opacity-100 transition-opacity" data-active={!!carInfo.model_id}>
                                                        {carInfo.model_id && (
                                                            isLoadingVersions ? (
                                                                <div className="flex items-center justify-center py-8">
                                                                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                                                </div>
                                                            ) : versions.map((version) => (
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
                                                                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all text-left ${carInfo.version_id === version.id
                                                                        ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-md'
                                                                        : 'border-white bg-white hover:border-gray-200 text-gray-500 hover:text-gray-900 shadow-sm'
                                                                        }`}
                                                                >
                                                                    <div className="font-extrabold text-sm">{getStringFromValue(version.name)}</div>
                                                                    <div className="text-[10px] text-gray-400 font-black uppercase mt-1">{version.cc} CC • {getStringFromValue(version.engine_type)}</div>
                                                                </button>
                                                            ))
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Column 5: Summary */}
                                                <div className="flex flex-col h-full">
                                                    <div className="p-3 mb-3 text-center">
                                                        <div className="inline-flex w-8 h-8 rounded-lg bg-green-500 text-white items-center justify-center text-xs font-black mb-3">✓</div>
                                                        <h4 className="text-lg font-black text-gray-900 leading-tight">Summary</h4>
                                                    </div>
                                                    <div className="flex-1 flex flex-col opacity-50 data-[active=true]:opacity-100 transition-opacity" data-active={!!carInfo.version_id}>
                                                        <div className="bg-linear-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl flex-1 flex flex-col">
                                                            <div className="flex-1 space-y-6">
                                                                <div className="space-y-1">
                                                                    <div className="text-[10px] font-black uppercase text-blue-200 tracking-[0.2em]">Manufacturer</div>
                                                                    <div className="text-lg font-extrabold leading-none">{getStringFromValue(carInfo.make_name) || '...'}</div>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <div className="text-[10px] font-black uppercase text-blue-200 tracking-[0.2em]">Vehicle Model</div>
                                                                    <div className="text-lg font-extrabold leading-none">{getStringFromValue(carInfo.model_name) || '...'}</div>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <div className="text-[10px] font-black uppercase text-blue-200 tracking-[0.2em]">Selected Variant</div>
                                                                    <div className="text-lg font-extrabold leading-none">{getStringFromValue(carInfo.version_name) || '...'}</div>
                                                                </div>
                                                                <div className="pt-4 border-t border-white/10 flex items-baseline gap-2">
                                                                    <span className="text-3xl font-black">{carInfo.year || '----'}</span>
                                                                    <span className="text-xs font-bold text-blue-300 uppercase">Model Year</span>
                                                                </div>
                                                            </div>
                                                            <button
                                                                disabled={!carInfo.version_id}
                                                                onClick={() => {
                                                                    const selectedVersion = versions.find(v => v.id === carInfo.version_id);
                                                                    if (selectedVersion) {
                                                                        handleSelectVersion(selectedVersion);
                                                                    }
                                                                }}
                                                                className="w-full mt-6 bg-white text-blue-600 py-4 rounded-2xl font-black text-sm hover:bg-blue-50 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center gap-2"
                                                            >
                                                                Add to Compare
                                                                <CheckCircle2 size={18} className="transition-transform group-hover:scale-110" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
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

function StepGrid<T = any>({ title, subtitle, data, onSelect, onBack, isMakeStep = false }: StepGridProps<T>) {
    const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

    const handleImageError = (itemId: string) => {
        setFailedImages(prev => new Set([...prev, itemId]));
    };

    return (
        <div className="flex flex-col h-full">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white">
                <div className="flex items-center gap-4">
                    {onBack && (
                        <button
                            onClick={onBack}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <ChevronLeft size={20} className="text-gray-600" />
                        </button>
                    )}
                    <div>
                        <h4 className="text-xl font-black text-gray-900 leading-tight">{title}</h4>
                        {subtitle && <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{subtitle}</p>}
                    </div>
                </div>
                {!onBack && <div className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase rounded-full">Select One</div>}
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                <div className={`${isMakeStep ? 'grid grid-cols-2 gap-3 pb-6' : 'flex flex-col gap-2 pb-6'}`}>
                    {Array.isArray(data) && data.map((item: any) => {
                        const displayText = getStringFromValue(item);
                        const logoUrl = isMakeStep && item.logo ? item.logo : null;
                        const itemKey = String(item.id ?? item);
                        const imageFailed = failedImages.has(itemKey);

                        return (
                            <button
                                key={itemKey}
                                onClick={() => onSelect(item)}
                                className={`rounded-2xl p-4 text-left hover:border-blue-600 hover:bg-blue-50 transition-all border-2 border-gray-100 bg-white group shadow-sm active:scale-[0.98] ${isMakeStep ? 'flex flex-col items-center justify-center min-h-[120px]' : 'w-full flex items-center justify-between'
                                    }`}
                            >
                                {logoUrl && !imageFailed ? (
                                    <>
                                        <div className="h-16 w-full flex items-center justify-center mb-3">
                                            <img
                                                src={logoUrl}
                                                alt={displayText}
                                                className="h-12 w-12 object-contain group-hover:scale-110 transition-transform"
                                                onError={() => handleImageError(itemKey)}
                                            />
                                        </div>
                                        <div className="text-center">
                                            <div className="text-xs font-black text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                                                {displayText}
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="text-sm font-black text-gray-900 group-hover:text-blue-600 transition-colors">
                                            {displayText}
                                        </div>
                                        {!isMakeStep && <ArrowLeftRight size={14} className="text-gray-200 group-hover:text-blue-400" />}
                                    </>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

