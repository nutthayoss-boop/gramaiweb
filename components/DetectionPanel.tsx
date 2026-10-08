"use client";
import { useEffect, useState } from "react";

// ตัด / ท้าย URL ออกเพื่อป้องกัน URL ซ้ำซ้อน
const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:5000").replace(/\/\$/, "");

const VEHICLE_LABELS: Record<string, string> = {
    car: "รถยนต์",
    motorcycle: "มอเตอร์ไซค์",
    bus: "รถบัส",
    truck: "รถบรรทุก",
};

type DetectionResponse = {
    message: string;
    counts: Record<string, number>;
    total_vehicles: number;
    image_base64: string;
    error?: string;
};

export function DetectionPanel() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [resultImage, setResultImage] = useState<string | null>(null);
    const [counts, setCounts] = useState<Record<string, number>>({});
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [hasAnalyzed, setHasAnalyzed] = useState(false);

    useEffect(() => {
        if (!selectedFile) {
            setPreviewUrl(null);
            return;
        }
        const url = URL.createObjectURL(selectedFile);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [selectedFile]);

    function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (!file) return;
        setSelectedFile(file);
        setResultImage(null);
        setHasAnalyzed(false);
        setError("");
        event.target.value = ""; // เคลียร์เพื่อเปิดโอกาสให้เลือกไฟล์เดิมซ้ำได้
    }

    async function detectVehicles() {
        if (!selectedFile) {
            setError("เลือกรูปภาพก่อนเริ่มนับ");
            return;
        }
        try {
            setLoading(true);
            setError("");
            const formData = new FormData();
            formData.append("image", selectedFile);
            const response = await fetch(`${API_URL}/predict`, { method: "POST", body: formData });
            const data: DetectionResponse = await response.json();
            
            if (!response.ok || data.error) {
                throw new Error(data.error || "ประมวลผลรูปภาพไม่สำเร็จ");
            }

            // ตรวจสอบและเติม Data URI Prefix หาก Flask ส่งมาเป็น Base64 ดิบ
            const formattedImage = data.image_base64?.startsWith("data:")
                ? data.image_base64
                : `data:image/jpeg;base64,${data.image_base64}`;

            setResultImage(formattedImage);
            setCounts(data.counts || {});
            setTotal(data.total_vehicles || 0);
            setHasAnalyzed(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : "เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ ตรวจสอบว่า Flask กำลังทำงานอยู่");
        } finally {
            setLoading(false);
        }
    }

    const shownImage = resultImage || previewUrl;

    return (
        <section className="rd-panel" aria-labelledby="detect-title">
            <div className="rd-panel-head">
                <h2 id="detect-title">ระบบนับจำนวนยานพาหนะ</h2>
                <p>รองรับรถยนต์ มอเตอร์ไซค์ รถบัส และรถบรรทุก</p>
            </div>
            <div className="rd-panel-body">
                <div className="rd-split">
                    <div>
                        <label className="rd-drop">
                            <strong>{selectedFile ? "เปลี่ยนรูปภาพ" : "เลือกรูปถนนหรือลานจอดรถ"}</strong>
                            <span>{selectedFile ? selectedFile.name : "คลิกเพื่อเลือกไฟล์ภาพ"}</span>
                            <input type="file" accept="image/*" onChange={handleFileChange} disabled={loading} />
                        </label>
                        <button
                            type="button"
                            className="rd-button rd-button--block"
                            onClick={detectVehicles}
                            disabled={!selectedFile || loading}
                        >
                            {loading ? "กำลังนับจำนวน..." : "เริ่มนับรถ"}
                        </button>
                        {error && <div className="rd-alert rd-alert--error" role="alert">{error}</div>}
                    </div>

                    {shownImage && (
                        <div className="rd-preview">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={shownImage} alt={resultImage ? "ภาพผลการตรวจจับ" : "ภาพที่เลือก"} />
                        </div>
                    )}
                </div>

                {hasAnalyzed && (
                    <div className="rd-result" role="status">
                        <div className="rd-total">
                            <b>{total}</b>
                            <span>คัน ที่พบในภาพ</span>
                        </div>
                        {total > 0 ? (
                            <div className="rd-stats">
                                {Object.entries(counts).map(([type, count]) => (
                                    <div key={type} className="rd-stat">
                                        <p>{VEHICLE_LABELS[type] ?? type}</p>
                                        <b>{count}</b>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="rd-alert rd-alert--empty">ไม่พบยานพาหนะในภาพนี้ ลองใช้รูปที่เห็นรถชัดขึ้น</div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}