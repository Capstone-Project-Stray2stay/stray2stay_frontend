// Figma "Vector (4)" check mark: 13.33x10 art with a 2px round stroke, drawn in a 20px icon frame.
// Uses currentColor so the caller sets the color.
export default function CheckIcon({ size = 20 }: { size?: number | string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            {/* Figma places the art at (3.33, 5); the source SVG's 1px stroke inset is folded into these points */}
            <path
                d="M3.33 10L8.33 15L16.67 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
