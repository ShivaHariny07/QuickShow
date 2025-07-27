import React, { useEffect, useState } from 'react';
import { testAPIConfiguration, testBackdropPath } from '../utils/apiTest';
import { useAppContext } from '../context/AppContext';

const APITestComponent = () => {
  const [testResults, setTestResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const { shows, image_base_url } = useAppContext();

  useEffect(() => {
    const runTests = async () => {
      console.log('🔍 Running API Configuration Tests...');
      
      try {
        const results = await testAPIConfiguration();
        setTestResults(results);
        
        // Log detailed results
        console.log('\n📊 Detailed Test Results:');
        console.log('==========================');
        console.log('1. TMDB Image Base URL:', results.tmdbImageBaseUrl);
        console.log('2. Backend URL:', results.backendUrl);
        console.log('3. Image Loading:', results.imageLoading);
        console.log('4. Backend Connection:', results.backendConnection);
        
        // Test backdrop path processing
        if (shows.length > 0) {
          console.log('\n🎬 Testing Backdrop Paths:');
          shows.slice(0, 3).forEach((movie, index) => {
            const pathTest = testBackdropPath(movie.backdrop_path, image_base_url);
            console.log(`Movie ${index + 1} (${movie.title}):`, pathTest);
          });
        }
        
      } catch (error) {
        console.error('❌ Test failed:', error);
        setTestResults({ error: error.message });
      } finally {
        setLoading(false);
      }
    };

    runTests();
  }, [shows, image_base_url]);

  if (loading) {
    return (
      <div className="fixed top-4 right-4 bg-blue-500 text-white p-4 rounded-lg shadow-lg">
        🔍 Running API Tests...
      </div>
    );
  }

  if (!testResults) return null;

  const getStatusIcon = (success) => success ? '✅' : '❌';
  const getStatusColor = (success) => success ? 'text-green-600' : 'text-red-600';

  return (
    <div className="fixed top-4 right-4 bg-white shadow-lg rounded-lg p-4 max-w-md border z-50">
      <h3 className="font-bold text-lg mb-3">🧪 API Configuration Test</h3>
      
      {testResults.error ? (
        <div className="text-red-600">❌ Test Error: {testResults.error}</div>
      ) : (
        <div className="space-y-2 text-sm">
          {/* TMDB Image Base URL */}
          <div className="flex items-center justify-between">
            <span>TMDB Image URL:</span>
            <span className={getStatusColor(testResults.tmdbImageBaseUrl?.configured)}>
              {getStatusIcon(testResults.tmdbImageBaseUrl?.configured)}
            </span>
          </div>

          {/* Backend URL */}
          <div className="flex items-center justify-between">
            <span>Backend URL:</span>
            <span className={getStatusColor(testResults.backendUrl?.configured)}>
              {getStatusIcon(testResults.backendUrl?.configured)}
            </span>
          </div>

          {/* Image Loading */}
          {testResults.imageLoading && (
            <div className="flex items-center justify-between">
              <span>Image Loading:</span>
              <span className={getStatusColor(testResults.imageLoading.success)}>
                {getStatusIcon(testResults.imageLoading.success)}
              </span>
            </div>
          )}

          {/* Backend Connection */}
          {testResults.backendConnection && (
            <div className="flex items-center justify-between">
              <span>Backend API:</span>
              <span className={getStatusColor(testResults.backendConnection.success)}>
                {getStatusIcon(testResults.backendConnection.success)}
              </span>
            </div>
          )}

          {/* Movie Count */}
          {testResults.backendConnection?.movieCount > 0 && (
            <div className="flex items-center justify-between">
              <span>Movies Loaded:</span>
              <span className="text-blue-600">
                {testResults.backendConnection.movieCount}
              </span>
            </div>
          )}

          {/* Shows fallback data if backend fails */}
          {shows.length > 0 && (
            <div className="flex items-center justify-between">
              <span>Shows Available:</span>
              <span className="text-green-600">
                ✅ {shows.length}
              </span>
            </div>
          )}
        </div>
      )}

      <div className="mt-3 text-xs text-gray-500">
        Check browser console for detailed logs
      </div>
    </div>
  );
};

export default APITestComponent;