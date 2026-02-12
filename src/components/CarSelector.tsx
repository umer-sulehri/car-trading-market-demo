'use client';

import { useState, useEffect } from 'react';
import { GET } from '@/src/lib/api/get.service';
import { API } from '@/src/lib/api/endpoints';

interface CarSelectorProps {
    onSelect: (versionId: number) => void;
    excludeVersionIds?: number[];
}

interface Option {
    id: number;
    name: string;
}

export default function CarSelector({ onSelect, excludeVersionIds = [] }: CarSelectorProps) {
    const [makes, setMakes] = useState<Option[]>([]);
    const [models, setModels] = useState<Option[]>([]);
    const [versions, setVersions] = useState<Option[]>([]);

    const [selectedMake, setSelectedMake] = useState<number | ''>('');
    const [selectedModel, setSelectedModel] = useState<number | ''>('');
    const [selectedVersion, setSelectedVersion] = useState<number | ''>('');

    const [loading, setLoading] = useState({
        makes: false,
        models: false,
        versions: false,
    });

    useEffect(() => {
        fetchMakes();
    }, []);

    useEffect(() => {
        if (selectedMake) {
            fetchModels(selectedMake as number);
            setSelectedModel('');
            setSelectedVersion('');
            setVersions([]);
        } else {
            setModels([]);
            setVersions([]);
        }
    }, [selectedMake]);

    useEffect(() => {
        if (selectedModel) {
            fetchVersions(selectedModel as number);
            setSelectedVersion('');
        } else {
            setVersions([]);
        }
    }, [selectedModel]);

    const fetchMakes = async () => {
        try {
            setLoading(prev => ({ ...prev, makes: true }));
            const res = await GET<Option[]>(API.public.makes); // Assuming this endpoint exists and returns array
            if (res?.data && Array.isArray(res.data)) {
                setMakes(res.data);
            } else if (Array.isArray(res)) {
                setMakes(res);
            }
        } catch (error) {
            console.error('Failed to fetch makes', error);
        } finally {
            setLoading(prev => ({ ...prev, makes: false }));
        }
    };

    const fetchModels = async (makeId: number) => {
        try {
            setLoading(prev => ({ ...prev, models: true }));
            const res = await GET<Option[]>(`${API.public.models}?make_id=${makeId}`);
            if (res?.data && Array.isArray(res.data)) {
                setModels(res.data);
            } else if (Array.isArray(res)) {
                setModels(res);
            }
        } catch (error) {
            console.error('Failed to fetch models', error);
        } finally {
            setLoading(prev => ({ ...prev, models: false }));
        }
    };

    const fetchVersions = async (modelId: number) => {
        try {
            setLoading(prev => ({ ...prev, versions: true }));
            const res = await GET<Option[]>(`${API.public.versions}?model_id=${modelId}`);
            // Filter out versions that are already selected
            let fetchedVersions: Option[] = [];
            if (res?.data && Array.isArray(res.data)) {
                fetchedVersions = res.data;
            } else if (Array.isArray(res)) {
                fetchedVersions = res;
            }

            setVersions(fetchedVersions.filter(v => !excludeVersionIds.includes(v.id)));

        } catch (error) {
            console.error('Failed to fetch versions', error);
        } finally {
            setLoading(prev => ({ ...prev, versions: false }));
        }
    };

    const handleVersionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const versionId = Number(e.target.value);
        setSelectedVersion(versionId);
        if (versionId) {
            onSelect(versionId);
        }
    };

    return (
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="font-semibold text-gray-700 mb-3 text-center">Add Car to Compare</h3>

            <div className="space-y-3">
                {/* Make Selector */}
                <div>
                    <select
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                        value={selectedMake}
                        onChange={(e) => setSelectedMake(Number(e.target.value))}
                        disabled={loading.makes}
                    >
                        <option value="">Select Make</option>
                        {makes.map(make => (
                            <option key={make.id} value={make.id}>{make.name}</option>
                        ))}
                    </select>
                </div>

                {/* Model Selector */}
                <div>
                    <select
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none transition disabled:bg-gray-100 disabled:text-gray-400"
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(Number(e.target.value))}
                        disabled={!selectedMake || loading.models}
                    >
                        <option value="">Select Model</option>
                        {models.map(model => (
                            <option key={model.id} value={model.id}>{model.name}</option>
                        ))}
                    </select>
                </div>

                {/* Version Selector */}
                <div>
                    <select
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none transition disabled:bg-gray-100 disabled:text-gray-400"
                        value={selectedVersion}
                        onChange={handleVersionChange}
                        disabled={!selectedModel || loading.versions}
                    >
                        <option value="">Select Version</option>
                        {versions.map(version => (
                            <option key={version.id} value={version.id}>{version.name}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}
