"use client";
import {
    useEffect,
    useState,
} from "react";
type Detection = {
    class: string;
    confidence: number;
    bbox: {
        x1: number;
        y1: number;
        x2: number;
        y2: number;
    };
};
export function DetectionPanel() {
    // ==================================
    // 1. STATE
    // ==================================
    const [selectedFile, setSelectedFile] =
        useState<File | null>(null);
    const [previewUrl, setPreviewUrl] =
        useState<string | null>(null);
    const [detections, setDetections] =
        useState<Detection[]>([]);
    const [loading, setLoading] =
        useState(false);
    const [error, setError] =
        useState("");
    const [hasAnalyzed, setHasAnalyzed] =
        useState(false);
    // ==================================
    // 2. IMAGE PREVIEW
    // ==================================
    useEffect(() => {
        if (!selectedFile) {
            setPreviewUrl(null);
            return;
        }
        const url =
            URL.createObjectURL(selectedFile);
        setPreviewUrl(url);
        return () => {
            URL.revokeObjectURL(url);
        };
    }, [selectedFile]);
    // ==================================
    // 3. FILE SELECTION
    // ==================================
    function handleFileChange(
        event: React.ChangeEvent<HTMLInputElement>
    ) {
        const file =
            event.target.files?.[0];
        if (!file) {
            return;
        }
        if (!file.type.startsWith("image/")) {
            setError("Please select an image file");
            return;
        }
        setSelectedFile(file);
        // Clear results from previous image.
        setDetections([]);
        setHasAnalyzed(false);
        setError("");
    }
    // ==================================
    // 4. API REQUEST
    // ==================================
    async function detectObjects() {
        if (!selectedFile) {
            setError("Please select an image");
            return;
        }
        try {
            setLoading(true);
            setError("");
            setHasAnalyzed(false);
            setDetections([]);
            const formData = new FormData();
            // Keep the original API contract.
            formData.append(
                "image",
                selectedFile
            );
            const response = await fetch(
                "http://127.0.0.1:5000/predict",
                {
                    method: "POST",
                    body: formData,
                }
            );
            if (!response.ok) {
                throw new Error("Detection failed");
            }
            const data = await response.json();
            if (!Array.isArray(
                data.detected_objects
            )) {
                throw new Error(
                    "Invalid API response"
                );
            }
            setDetections(
                data.detected_objects
            );
            setHasAnalyzed(true);
        } catch {
            setError("Cannot detect objects");
        } finally {
            setLoading(false);
        }
    }
    // ==================================
    // 5. JSX / USER INTERFACE
    // ==================================
    return (
        <section className="ux-card ux-detection">
            {/* HEADER */}
            <div className="ux-section-heading">
                <p className="ux-eyebrow">
                    AI IMAGE ANALYSIS
                </p>
                <h2>Object Detection</h2>
                <p className="ux-muted">
                    Upload an image to identify
                    objects using the YOLO model.
                </p>
            </div>
            {/* FILE UPLOAD */}
            <div className="ux-upload">
                <label className="ux-file-button">
                    <input
                        className="ux-file-input"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={loading}
                    />
                    <span>Choose Image</span>
                </label>
                <span className="ux-file-name">
                    {selectedFile
                        ? selectedFile.name
                        : "No image selected"}
                </span>
            </div>
            {/* IMAGE PREVIEW */}
            {previewUrl && (
                <div className="ux-preview">
                    {/* eslint-disable-next-line
@next/next/no-img-element */}
                    <img
                        src={previewUrl}
                        alt="Selected image preview"
                    />
                </div>
            )}
            {/* DETECT BUTTON */}
            <button
                type="button"
                className="ux-button"
                onClick={detectObjects}
                disabled={
                    !selectedFile || loading
                }
            >
                {loading
                    ? "Detecting..."
                    : "Detect Objects"}
            </button>
            {/* ERROR */}
            {error && (
                <div
                    className="ux-error"
                    role="alert"
                >
                    {error}
                </div>
            )}
            {/* RESULT HEADER */}
            <div className="ux-result-heading">
                <h3>Detection Result</h3>
                <p className="ux-muted">
                    Objects identified in your image
                </p>
            </div>
            {/* EMPTY STATE */}
            {!loading &&
                !error &&
                !hasAnalyzed && (
                    <p className="ux-muted">
                        Select an image and click
                        Detect Objects to begin.
                    </p>
                )}
            {/* NO OBJECTS */}
            {!loading &&
                !error &&
                hasAnalyzed &&
                detections.length === 0 && (
                    <p className="ux-muted">
                        No objects detected.
                    </p>
                )}
            {/* DETECTION RESULTS */}
            <div className="ux-results">
                {detections.map(
                    (item, index) => (
                        <article
                            className="ux-result-item"
                            key={index}
                        >
                            <strong>
                                {item.class}
                            </strong>
                            <p>
                                Confidence:
                                {" "}
                                {item.confidence}%
                            </p>
                            <div
                                className="ux-confidence-track"
                            >
                                <div
                                    className="ux-confidence-fill"
                                    style={{
                                        width: `${Math.max(
                                            0,
                                            Math.min(
                                                100,
                                                item.confidence
                                            )
                                        )
                                            }%`,
                                    }}
                                />
                            </div>
                        </article>
                    )
                )}
            </div>
        </section>
    );
}