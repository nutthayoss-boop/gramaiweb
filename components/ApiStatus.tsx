"use client";
import { useState } from "react";

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:5000").replace(/\/\$/, "");

type State = "idle" | "ok" | "error";

export function ApiStatus() {
    const [state, setState] = useState<State>("idle");
    const [loading, setLoading] = useState(false);

    async function checkApi() {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/health`);
            if (!response.ok) throw new Error("API request failed");
            const data = await response.json();
            setState(data.status === "ok" ? "ok" : "error");
        } catch {
            setState("error");
        } finally {
            setLoading(false);
        }
    }

    const text =
        state === "ok" ? "เชื่อมต่อ Flask API ได้แล้ว"
        : state === "error" ? "เชื่อมต่อไม่ได้ ตรวจสอบว่า Flask กำลังทำงานอยู่"
        : "ยังไม่ได้ตรวจสอบ";

    return (
        <section className="rd-card rd-status">
            <div>
                <h2>สถานะ Backend API</h2>
                <p className="rd-state" role="status">
                    <span className="rd-dot" data-state={state} aria-hidden="true" />
                    {text}
                </p>
            </div>
            <button type="button" className="rd-button" onClick={checkApi} disabled={loading}>
                {loading ? "กำลังตรวจสอบ..." : "ตรวจสอบ API"}
            </button>
        </section>
    );
}