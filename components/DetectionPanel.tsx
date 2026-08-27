"use client";
export function DetectionPanel() {
    function handleClick() {
        alert(
            "Prepare object detection"
        );
    }
    return (
        <section>
            <h2>
                Object Detection
            </h2>
            <button
                onClick={handleClick}
            >
                Prepare Detection
            </button>
        </section>
    );
}

