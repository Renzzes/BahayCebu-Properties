import { uploadPropertyImage, deletePropertyImage } from './src/services/imageService';

async function testStorage() {
  try {
    console.log('🔍 Testing Supabase storage connection...');

    // Create a test file
    const blob = new Blob(['test'], { type: 'text/plain' });
    const testFile = new File([blob], 'test.txt', { type: 'text/plain' });

    // Test upload
    console.log('📤 Testing file upload...');
    const uploadedUrl = await uploadPropertyImage(testFile);
    console.log('✅ File uploaded successfully:', uploadedUrl);

    // Extract path from URL
    const path = uploadedUrl.split('/').pop();
    if (!path) throw new Error('Could not extract path from URL');

    // Test deletion
    console.log('🗑️ Testing file deletion...');
    await deletePropertyImage(path);
    console.log('✅ File deleted successfully');

    console.log('✅ All storage tests passed!');
  } catch (error) {
    console.error('❌ Storage test failed:', error);
  }
}

testStorage(); 