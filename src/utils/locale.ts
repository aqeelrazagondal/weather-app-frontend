// Convert ISO country code to flag emoji (fallback to code if unsupported)
export function countryCodeToFlag(code: string | undefined): string {
    if (!code) return '';
    try {
        const cc = code.trim().toUpperCase();
        if (cc.length !== 2) return cc;
        const A = 127397; // regional indicator symbol offset

        // Avoid string iteration (works with lower TS targets)
        const c0 = cc.charCodeAt(0);
        const c1 = cc.charCodeAt(1);

        // Ensure letters A-Z
        if (c0 < 65 || c0 > 90 || c1 < 65 || c1 > 90) return cc;

        return String.fromCodePoint(A + c0, A + c1);
    } catch {
        return code;
    }
}