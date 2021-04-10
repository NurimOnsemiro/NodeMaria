export async function sleepMs(ms: number): Promise<void> {
    return new Promise((resolve, reject) => {
        if (ms === 0) {
            resolve();
        }
        setTimeout(() => {
            resolve();
        }, ms);
    });
}

export function filetimeFromDate() {
    return Date.now() * 1e4 + 116444736e9;
}
