type FeatureCardProps = {
    icon: string;
    title: string;
    description: string;
};

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
    return (
        <div className="rd-card rd-feature">
            <div className="rd-icon" aria-hidden="true">{icon}</div>
            <div>
                <h2>{title}</h2>
                <p>{description}</p>
            </div>
        </div>
    );
}