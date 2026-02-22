/**
 * src/lib/cloudinary.ts
 *
 * This utility transforms standard Cloudinary image URLs into highly optimized WebP/AVIF
 * edge-rendered URLs. This totally bypasses Next.js / Vercel Serverless Image Optimization,
 * saving both bandwidth and costs, while forcing f_auto and q_auto parameters.
 */

export const getOptimizedImageUrl = (originalUrl: string, width: number = 800): string => {
    if (!originalUrl || !originalUrl.includes('res.cloudinary.com')) {
        return originalUrl;
    }

    // Split at the upload/ directory to inject transform params
    const uploadPathIndex = originalUrl.indexOf('/upload/');
    if (uploadPathIndex === -1) {
        return originalUrl;
    }

    const basePath = originalUrl.slice(0, uploadPathIndex + 8); // keeps "/upload/"
    const imagePath = originalUrl.slice(uploadPathIndex + 8);

    // f_auto: Automatically deliver the best format based on browser (WebP, AVIF)
    // q_auto: Automatically adjust compression to barely visible loss, maximizing speed
    // c_limit: Only downscale, never upscale
    const transformParams = `f_auto,q_auto,w_${width},c_limit/`;

    return `${basePath}${transformParams}${imagePath}`;
};
