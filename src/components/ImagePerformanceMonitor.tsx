import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ImagePerformanceMonitor } from '@/services/optimizedImageService';

interface PerformanceStats {
  totalImages: number;
  totalSizeBefore: number;
  totalSizeAfter: number;
  averageCompressionRatio: number;
  averageProcessingTime: number;
  compressionSavings: number;
}

const ImagePerformanceDisplay: React.FC = () => {
  const [stats, setStats] = useState<PerformanceStats>({
    totalImages: 0,
    totalSizeBefore: 0,
    totalSizeAfter: 0,
    averageCompressionRatio: 0,
    averageProcessingTime: 0,
    compressionSavings: 0
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development or when explicitly enabled
    const isDev = process.env.NODE_ENV === 'development';
    const showMonitor = localStorage.getItem('showImagePerformanceMonitor') === 'true';
    setIsVisible(isDev || showMonitor);

    if (isDev || showMonitor) {
      const updateStats = () => {
        const performanceData = ImagePerformanceMonitor.getStats();
        setStats({
          totalImages: performanceData.totalImages,
          totalSizeBefore: performanceData.totalSizeBefore,
          totalSizeAfter: performanceData.totalSizeAfter,
          averageCompressionRatio: performanceData.averageCompressionRatio,
          averageProcessingTime: performanceData.averageProcessingTime,
          compressionSavings: performanceData.totalSizeBefore - performanceData.totalSizeAfter
        });
      };

      // Update stats every 5 seconds
      const interval = setInterval(updateStats, 5000);
      updateStats(); // Initial update

      return () => clearInterval(interval);
    }
  }, []);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getCompressionColor = (ratio: number): string => {
    if (ratio >= 0.7) return 'bg-green-500';
    if (ratio >= 0.5) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const clearStats = () => {
    ImagePerformanceMonitor.reset();
    setStats({
      totalImages: 0,
      totalSizeBefore: 0,
      totalSizeAfter: 0,
      averageCompressionRatio: 0,
      averageProcessingTime: 0,
      compressionSavings: 0
    });
  };

  if (!isVisible || stats.totalImages === 0) {
    return null;
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 z-50 shadow-lg border-2 border-blue-200 bg-white/95 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center justify-between">
          <span>🚀 Image Performance Monitor</span>
          <div className="flex gap-1">
            <button
              onClick={clearStats}
              className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
              title="Clear Stats"
            >
              Clear
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="text-xs px-2 py-1 bg-red-100 hover:bg-red-200 rounded transition-colors"
              title="Hide Monitor"
            >
              ×
            </button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-xs">
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-blue-50 p-2 rounded">
            <div className="font-semibold text-blue-700">Images Processed</div>
            <div className="text-lg font-bold text-blue-900">{stats.totalImages}</div>
          </div>
          <div className="bg-green-50 p-2 rounded">
            <div className="font-semibold text-green-700">Space Saved</div>
            <div className="text-lg font-bold text-green-900">
              {formatFileSize(stats.compressionSavings)}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-medium">Compression Ratio:</span>
            <Badge className={`${getCompressionColor(stats.averageCompressionRatio)} text-white`}>
              {(stats.averageCompressionRatio * 100).toFixed(1)}%
            </Badge>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-medium">Avg Processing Time:</span>
            <span className="font-mono">{stats.averageProcessingTime.toFixed(0)}ms</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-medium">Original Size:</span>
            <span className="font-mono">{formatFileSize(stats.totalSizeBefore)}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-medium">Optimized Size:</span>
            <span className="font-mono">{formatFileSize(stats.totalSizeAfter)}</span>
          </div>
        </div>

        <div className="text-xs text-gray-500 border-t pt-2">
          💡 Tip: Higher compression ratio = better performance
        </div>
      </CardContent>
    </Card>
  );
};

export default ImagePerformanceDisplay;