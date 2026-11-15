// Figma "icon_camera" (24px frame, filled body with a lens dot). Exported white; drawn in currentColor
// so it follows the button text colour.
export default function CameraIcon({ size = 24 }: { size?: number | string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M11.5 16C13.433 16 15 14.433 15 12.5C15 10.567 13.433 9 11.5 9C9.567 9 8 10.567 8 12.5C8 14.433 9.567 16 11.5 16Z" fill="currentColor" />
            <path d="M8.65 3L6.9115 4.88889H3.9C2.855 4.88889 2 5.73889 2 6.77778V18.1111C2 19.15 2.855 20 3.9 20H19.1C20.145 20 21 19.15 21 18.1111V6.77778C21 5.73889 20.145 4.88889 19.1 4.88889H16.0885L14.35 3H8.65ZM11.5 17.1667C8.878 17.1667 6.75 15.0511 6.75 12.4444C6.75 9.83778 8.878 7.72222 11.5 7.72222C14.122 7.72222 16.25 9.83778 16.25 12.4444C16.25 15.0511 14.122 17.1667 11.5 17.1667Z" fill="currentColor" />
        </svg>
    );
}
