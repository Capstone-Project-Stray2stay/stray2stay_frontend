// Figma "Icon_edit" pencil: "medium" icon, 24px frame with the 16px art inside. Uses currentColor.
export default function EditIcon({ size = 24 }: { size?: number | string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path
                d="M5.77778 18.2222H7.04444L15.7333 9.53333L14.4667 8.26667L5.77778 16.9556V18.2222ZM4 20V16.2222L15.7333 4.51111C15.9111 4.34815 16.1076 4.22222 16.3227 4.13333C16.5378 4.04444 16.7635 4 17 4C17.2364 4 17.4661 4.04444 17.6889 4.13333C17.9117 4.22222 18.1043 4.35556 18.2667 4.53333L19.4889 5.77778C19.6667 5.94074 19.7964 6.13333 19.8782 6.35556C19.96 6.57778 20.0006 6.8 20 7.02222C20 7.25926 19.9594 7.48533 19.8782 7.70044C19.797 7.91556 19.6673 8.1117 19.4889 8.28889L7.77778 20H4ZM15.0889 8.91111L14.4667 8.26667L15.7333 9.53333L15.0889 8.91111Z"
                fill="currentColor"
            />
        </svg>
    );
}
