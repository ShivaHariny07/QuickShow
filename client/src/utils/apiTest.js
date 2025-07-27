// Test utility to verify API configuration and backdrop_path functionality
export const testAPIConfiguration = async () => {
  const results = {
    tmdbImageBaseUrl: null,
    backendUrl: null,
    imageLoading: null,
    backendConnection: null,
    tmdbApiAccess: null
  };

  // Test 1: Check TMDB Image Base URL
  const imageBaseUrl = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;
  results.tmdbImageBaseUrl = {
    configured: !!imageBaseUrl,
    value: imageBaseUrl,
    expected: 'https://image.tmdb.org/t/p/original'
  };

  // Test 2: Check Backend URL
  const backendUrl = import.meta.env.VITE_BASE_URL;
  results.backendUrl = {
    configured: !!backendUrl,
    value: backendUrl,
    note: 'Should be your deployed server URL'
  };

  // Test 3: Test Image Loading
  if (imageBaseUrl) {
    try {
      const testImageUrl = `${imageBaseUrl}/8J6UlIFcU7eZfq9iCLbgc8Auklg.jpg`;
      const response = await fetch(testImageUrl, { method: 'HEAD' });
      results.imageLoading = {
        success: response.ok,
        status: response.status,
        testUrl: testImageUrl
      };
    } catch (error) {
      results.imageLoading = {
        success: false,
        error: error.message
      };
    }
  }

  // Test 4: Test Backend Connection
  if (backendUrl) {
    try {
      const response = await fetch(`${backendUrl}/api/show/all`);
      const data = await response.json();
      results.backendConnection = {
        success: response.ok,
        status: response.status,
        hasData: data.success && Array.isArray(data.shows),
        movieCount: data.shows ? data.shows.length : 0
      };
    } catch (error) {
      results.backendConnection = {
        success: false,
        error: error.message
      };
    }
  }

  return results;
};

// Function to test a specific backdrop path
export const testBackdropPath = (backdropPath, imageBaseUrl) => {
  if (!backdropPath) return { error: 'No backdrop path provided' };
  
  let finalUrl;
  
  if (backdropPath.startsWith('http')) {
    finalUrl = backdropPath;
  } else {
    if (!imageBaseUrl) {
      return { error: 'No image base URL configured' };
    }
    finalUrl = imageBaseUrl + backdropPath;
  }
  
  return {
    originalPath: backdropPath,
    finalUrl: finalUrl,
    isFullUrl: backdropPath.startsWith('http'),
    needsBaseUrl: !backdropPath.startsWith('http')
  };
};

// Function to log all test results
export const logAPITestResults = async () => {
  console.log('🔍 Testing API Configuration for backdrop_path...');
  
  const results = await testAPIConfiguration();
  
  console.log('\n📊 Test Results:');
  console.log('================');
  
  // TMDB Image Base URL
  console.log(`\n1. TMDB Image Base URL:`);
  console.log(`   ✅ Configured: ${results.tmdbImageBaseUrl.configured}`);
  console.log(`   📝 Value: ${results.tmdbImageBaseUrl.value || 'NOT SET'}`);
  console.log(`   🎯 Expected: ${results.tmdbImageBaseUrl.expected}`);
  
  // Backend URL
  console.log(`\n2. Backend URL:`);
  console.log(`   ✅ Configured: ${results.backendUrl.configured}`);
  console.log(`   📝 Value: ${results.backendUrl.value || 'NOT SET'}`);
  
  // Image Loading
  if (results.imageLoading) {
    console.log(`\n3. Image Loading Test:`);
    console.log(`   ✅ Success: ${results.imageLoading.success}`);
    console.log(`   📊 Status: ${results.imageLoading.status || 'ERROR'}`);
    console.log(`   🔗 Test URL: ${results.imageLoading.testUrl || 'N/A'}`);
  }
  
  // Backend Connection
  if (results.backendConnection) {
    console.log(`\n4. Backend Connection Test:`);
    console.log(`   ✅ Success: ${results.backendConnection.success}`);
    console.log(`   📊 Status: ${results.backendConnection.status || 'ERROR'}`);
    console.log(`   🎬 Has Movie Data: ${results.backendConnection.hasData || false}`);
    console.log(`   🔢 Movie Count: ${results.backendConnection.movieCount || 0}`);
  }
  
  console.log('\n🚀 Recommendations:');
  console.log('==================');
  
  if (!results.tmdbImageBaseUrl.configured) {
    console.log('❌ Set VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p/original');
  }
  
  if (!results.backendUrl.configured) {
    console.log('❌ Set VITE_BASE_URL to your deployed server URL');
  }
  
  if (results.imageLoading && !results.imageLoading.success) {
    console.log('❌ Image loading failed - check CORS or URL configuration');
  }
  
  if (results.backendConnection && !results.backendConnection.success) {
    console.log('❌ Backend connection failed - check server deployment and TMDB_API_KEY');
  }
  
  return results;
};