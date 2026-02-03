"use client";

import { useEffect, useState } from "react";
import {
  getMakes,
  getModels,
  getVersions,
  getVersionFeatures,
  getVersionColors,
  getVersionSpecifications,
} from "@/src/services/admin.lookup.service";
import { getByModel as getModelMedia } from "@/src/services/newCarMedia.service";
import { Make, CarModel, Version } from "@/src/types/lookups";

interface Media {
  id: number;
  url: string;
}

type ViewStep = "makes" | "models" | "versions" | "details";

export default function CarCatalogPage() {
  const [viewStep, setViewStep] = useState<ViewStep>("makes");
  const [makes, setMakes] = useState<Make[]>([]);
  const [models, setModels] = useState<CarModel[]>([]);
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedMake, setSelectedMake] = useState<Make | null>(null);
  const [selectedModel, setSelectedModel] = useState<CarModel | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<Version | null>(null);
  const [versionMedia, setVersionMedia] = useState<Media[]>([]);
  const [versionFeatures, setVersionFeatures] = useState<any[]>([]);
  const [versionColors, setVersionColors] = useState<any[]>([]);
  const [versionSpecifications, setVersionSpecifications] = useState<any[]>([]);

  useEffect(() => {
    const loadMakes = async () => {
      try {
        setLoading(true);
        const data = await getMakes();
        setMakes(data);
      } catch (e) {
        console.error("Failed to load makes", e);
      } finally {
        setLoading(false);
      }
    };
    loadMakes();
  }, []);

  const selectMake = async (make: Make) => {
    setSelectedMake(make);
    setSearchQuery("");
    try {
      setLoading(true);
      const allModels = await getModels();
      const filtered = allModels.filter((m) => m.make_id === make.id);
      setModels(filtered);
      setViewStep("models");
    } catch (e) {
      console.error("Failed to load models", e);
    } finally {
      setLoading(false);
    }
  };

  const selectModel = async (model: CarModel) => {
    setSelectedModel(model);
    setSearchQuery("");
    try {
      setLoading(true);
      const allVersions = await getVersions();
      const filtered = allVersions.filter((v) => v.model_id === model.id);
      setVersions(filtered);
      setViewStep("versions");
    } catch (e) {
      console.error("Failed to load versions", e);
    } finally {
      setLoading(false);
    }
  };

  const selectVersion = async (version: Version) => {
    setSelectedVersion(version);
    try {
      setLoading(true);
      const [media, features, colors, specifications] = await Promise.all([
        getModelMedia(version.model_id),
        getVersionFeatures(version.id),
        getVersionColors(version.id),
        getVersionSpecifications(version.id),
      ]);
      setVersionMedia(media || []);
      setVersionFeatures(features || []);
      setVersionColors(colors || []);
      setVersionSpecifications(specifications || []);
      setViewStep("details");
    } catch (e) {
      console.error("Failed to load version details", e);
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    if (viewStep === "details") setViewStep("versions");
    else if (viewStep === "versions") setViewStep("models");
    else if (viewStep === "models") {
      setViewStep("makes");
      setSelectedMake(null);
    }
  };

  const filteredMakes = makes.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredModels = models.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredVersions = versions.filter((v) =>
    v.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {viewStep !== "makes" && (
              <button
                onClick={goBack}
                className="flex items-center gap-2 px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 font-semibold text-gray-700 transition"
              >
                ← Back
              </button>
            )}
            <h1 className="text-2xl font-bold text-gray-900">
              {viewStep === "makes" && "Select Make"}
              {viewStep === "models" && `${selectedMake?.name} Models`}
              {viewStep === "versions" && `${selectedModel?.name} Versions`}
              {viewStep === "details" && "Version Details"}
            </h1>
          </div>
        </div>
      </div>

      {viewStep !== "details" && (
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="max-w-7xl mx-auto">
            <input
              type="text"
              placeholder={`Search ${
                viewStep === "makes"
                  ? "makes"
                  : viewStep === "models"
                  ? "models"
                  : "versions"
              }...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 mt-4">Loading...</p>
          </div>
        )}

        {viewStep === "makes" && !loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredMakes.map((make) => (
              <button
                key={make.id}
                onClick={() => selectMake(make)}
                className="bg-white p-6 rounded-lg shadow hover:shadow-lg border border-gray-200 hover:border-blue-500 transition flex flex-col items-center gap-3 cursor-pointer"
              >
                {make.logo && (
                  <img
                    src={make.logo}
                    alt={make.name}
                    className="h-12 w-12 object-contain"
                  />
                )}
                <span className="text-sm font-semibold text-gray-900 text-center">
                  {make.name}
                </span>
              </button>
            ))}
          </div>
        )}

        {viewStep === "models" && !loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filteredModels.map((model) => (
              <button
                key={model.id}
                onClick={() => selectModel(model)}
                className="bg-white p-6 rounded-lg shadow hover:shadow-lg border border-gray-200 hover:border-blue-500 transition flex flex-col items-center gap-3 cursor-pointer"
              >
                {model.media && model.media.length > 0 && (
                  <img
                    src={model.media[0].url}
                    alt={model.name}
                    className="h-20 w-full object-cover rounded"
                  />
                )}
                <span className="font-semibold text-gray-900 text-center">
                  {model.name}
                </span>
              </button>
            ))}
          </div>
        )}

        {viewStep === "versions" && !loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredVersions.map((version) => (
              <button
                key={version.id}
                onClick={() => selectVersion(version)}
                className="bg-white p-6 rounded-lg shadow hover:shadow-lg border border-gray-200 hover:border-blue-500 transition text-left cursor-pointer"
              >
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {version.name}
                  </h3>
                  <p className="text-sm text-gray-600">Year: {version.year}</p>
                  {version.cc && (
                    <p className="text-sm text-gray-600">CC: {version.cc}</p>
                  )}
                  {version.engineType && (
                    <p className="text-sm text-gray-600">
                      Engine: {version.engineType.name}
                    </p>
                  )}
                  {version.transmission && (
                    <p className="text-sm text-gray-600">
                      Transmission: {version.transmission.name}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}

        {viewStep === "details" && selectedVersion && !loading && (
          <div className="bg-white rounded-lg shadow">
            <div className="bg-gray-100 p-6">
              {versionMedia.length > 0 ? (
                <div className="space-y-4">
                  <div className="h-96 bg-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={versionMedia[0].url}
                      alt={selectedVersion.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {versionMedia.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {versionMedia.map((media) => (
                        <div key={media.id} className="h-20 rounded overflow-hidden bg-gray-300">
                          <img
                            src={media.url}
                            alt="thumbnail"
                            className="w-full h-full object-cover cursor-pointer hover:opacity-75 transition"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-96 rounded-lg flex items-center justify-center text-gray-500">
                  No images available
                </div>
              )}
            </div>

            <div className="p-8">
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {selectedVersion.make?.name} {selectedVersion.model?.name}
                </h1>
                <p className="text-2xl font-semibold text-blue-600 mb-4">
                  {selectedVersion.name}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-4 rounded">
                    <p className="text-gray-600 text-sm font-semibold">YEAR</p>
                    <p className="text-xl font-bold text-gray-900 mt-1">
                      {selectedVersion.year}
                    </p>
                  </div>
                  {selectedVersion.cc && (
                    <div className="bg-gray-50 p-4 rounded">
                      <p className="text-gray-600 text-sm font-semibold">ENGINE</p>
                      <p className="text-xl font-bold text-gray-900 mt-1">
                        {selectedVersion.cc} CC
                      </p>
                    </div>
                  )}
                  {selectedVersion.engineType && (
                    <div className="bg-gray-50 p-4 rounded">
                      <p className="text-gray-600 text-sm font-semibold">
                        ENGINE TYPE
                      </p>
                      <p className="text-xl font-bold text-gray-900 mt-1">
                        {selectedVersion.engineType.name}
                      </p>
                    </div>
                  )}
                  {selectedVersion.transmission && (
                    <div className="bg-gray-50 p-4 rounded">
                      <p className="text-gray-600 text-sm font-semibold">
                        TRANSMISSION
                      </p>
                      <p className="text-xl font-bold text-gray-900 mt-1">
                        {selectedVersion.transmission.name}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {versionColors.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Colors</h2>
                  <div className="flex flex-wrap gap-3">
                    {versionColors.map((vc) => (
                      <div
                        key={vc.id}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg"
                      >
                        <div
                          className="w-6 h-6 rounded border border-gray-300"
                          style={{
                            backgroundColor: `#${Math.floor(
                              Math.random() * 16777215
                            ).toString(16)}`,
                          }}
                        />
                        <span className="font-semibold text-gray-900">
                          {vc.color?.name || vc.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {versionFeatures.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Features
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {versionFeatures.map((feature) => (
                      <div
                        key={feature.id}
                        className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg"
                      >
                        <span className="text-green-600 text-xl">✓</span>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {feature.name}
                          </p>
                          {feature.type && (
                            <p className="text-sm text-gray-600">
                              {feature.type.name}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {versionSpecifications.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Specifications
                  </h2>
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <tbody>
                        {versionSpecifications.map((spec, idx) => (
                          <tr
                            key={spec.id || idx}
                            className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                          >
                            <td className="px-6 py-4 font-semibold text-gray-900 border-b border-gray-200">
                              {spec.name}
                            </td>
                            <td className="px-6 py-4 text-gray-600 border-b border-gray-200">
                              {spec.value || "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
