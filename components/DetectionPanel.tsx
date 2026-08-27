"use client";
import { useState }
    from "react";
export function DetectionPanel() {
    const [status, setStatus] = useState("Waiting");
    return (<section>
        <h2>
            Object Detection
        </h2>
        <p>
            Status: {status}
        </p>
        <button
            onClick={() =>
                setStatus("Ready")
            }
        >
            Prepare Detection
        </button>
        <br></br>

        <button
            onClick={() =>
                setStatus("Waiting")
            }
        >
            Reset
        </button>
        <br></br>
        <button
            onClick={() =>
                setStatus("Cancelled")
            }
        >
            Cancel
        </button>
        {status === "Ready" && (
            <p>
                Ready to select an image
            </p>
        )}
    </section>
    );
}
