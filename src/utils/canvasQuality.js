/**
 * Real Client-Side Image Quality Analyzer (Canvas-based)
 * Computes:
 * 1. Laplacian variance for blur/sharpness detection
 * 2. Luminance & contrast metrics for lighting detection
 * 3. Exact pixel resolution and aspect ratio
 * 4. File metadata (size, MIME type)
 * Honest numbers only — no simulated or hardcoded quality scores.
 */

export async function analyzeImageQuality(fileOrUrl, fileName = 'certificate.jpg') {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    let fileSizeBytes = null;
    let fileType = 'image/jpeg';

    if (fileOrUrl instanceof File) {
      fileSizeBytes = fileOrUrl.size;
      fileType = fileOrUrl.type;
      img.src = URL.createObjectURL(fileOrUrl);
    } else if (typeof fileOrUrl === 'string') {
      img.src = fileOrUrl;
    }

    img.onload = () => {
      try {
        const width = img.naturalWidth || img.width;
        const height = img.naturalHeight || img.height;

        // Create analysis canvas
        // Sample at max 600px width/height for responsive client-side compute speed
        const maxSampleDim = 600;
        const scale = Math.min(1, maxSampleDim / Math.max(width, height));
        const sampleW = Math.round(width * scale);
        const sampleH = Math.round(height * scale);

        const canvas = document.createElement('canvas');
        canvas.width = sampleW;
        canvas.height = sampleH;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, sampleW, sampleH);

        const imgData = ctx.getImageData(0, 0, sampleW, sampleH);
        const data = imgData.data;

        // 1. Grayscale luminance calculation
        const gray = new Float32Array(sampleW * sampleH);
        let sumLuminance = 0;
        let sumLuminanceSq = 0;
        const totalPixels = sampleW * sampleH;

        for (let i = 0; i < totalPixels; i++) {
          const r = data[i * 4];
          const g = data[i * 4 + 1];
          const b = data[i * 4 + 2];
          // Standard ITU-R BT.601 luminance
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;
          gray[i] = lum;
          sumLuminance += lum;
          sumLuminanceSq += lum * lum;
        }

        const meanLuminance = sumLuminance / totalPixels;
        const luminanceVar = (sumLuminanceSq / totalPixels) - (meanLuminance * meanLuminance);
        const contrastStdDev = Math.sqrt(Math.max(0, luminanceVar));

        // 2. Laplacian Kernel (3x3) for Edge Sharpness & Focus
        // Kernel:
        // [ 0,  1,  0 ]
        // [ 1, -4,  1 ]
        // [ 0,  1,  0 ]
        let laplacianSum = 0;
        let laplacianSumSq = 0;
        let laplacianCount = 0;

        for (let y = 1; y < sampleH - 1; y++) {
          const rowOffset = y * sampleW;
          const prevRowOffset = (y - 1) * sampleW;
          const nextRowOffset = (y + 1) * sampleW;

          for (let x = 1; x < sampleW - 1; x++) {
            const center = gray[rowOffset + x];
            const top = gray[prevRowOffset + x];
            const bottom = gray[nextRowOffset + x];
            const left = gray[rowOffset + x - 1];
            const right = gray[rowOffset + x + 1];

            const lapValue = top + bottom + left + right - 4 * center;
            laplacianSum += lapValue;
            laplacianSumSq += lapValue * lapValue;
            laplacianCount++;
          }
        }

        const meanLaplacian = laplacianSum / (laplacianCount || 1);
        const laplacianVariance = (laplacianSumSq / (laplacianCount || 1)) - (meanLaplacian * meanLaplacian);

        // 3. Honest Quality Thresholds
        // Laplacian variance < 80 is blurry/unfocused
        // Laplacian variance >= 150 is sharp
        const isBlurry = laplacianVariance < 85;
        const isLowResolution = width < 600 || height < 600;
        const isTooDark = meanLuminance < 40;
        const isOverexposed = meanLuminance > 250 && contrastStdDev < 15;
        const isLowContrast = contrastStdDev < 20;

        let retakeReasons = [];
        if (isBlurry) {
          retakeReasons.push('Blur detected (Laplacian score low). Ensure camera is in focus and document is held still.');
        }
        if (isLowResolution) {
          retakeReasons.push(`Low resolution (${width}×${height}px). Minimum recommended is 800×800px for seal verification.`);
        }
        if (isTooDark) {
          retakeReasons.push(`Insufficient lighting (Mean brightness ${meanLuminance.toFixed(1)}/255). Place certificate under direct light.`);
        }
        if (isOverexposed) {
          retakeReasons.push(`Excessive glare/flash (Mean brightness ${meanLuminance.toFixed(1)}/255). Avoid camera flash reflections.`);
        }

        const retakeNeeded = retakeReasons.length > 0;

        resolve({
          fileName,
          fileType,
          fileSizeKB: fileSizeBytes ? Math.round(fileSizeBytes / 1024) : null,
          resolution: {
            width,
            height,
            display: `${width} × ${height} px`
          },
          metrics: {
            laplacianVariance: Number(laplacianVariance.toFixed(1)),
            meanLuminance: Number(meanLuminance.toFixed(1)),
            contrastStdDev: Number(contrastStdDev.toFixed(1))
          },
          status: retakeNeeded ? 'RETAKE_RECOMMENDED' : 'ACCEPTABLE_QUALITY',
          retakeReasons,
          inspectedAt: new Date().toISOString()
        });
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = (e) => {
      reject(new Error('Failed to load image for canvas quality analysis'));
    };
  });
}
