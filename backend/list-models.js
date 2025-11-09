// list-models.js
// This will show you exactly which models your API key has access to
// Run with: node list-models.js

require('dotenv').config();
const axios = require('axios');

async function listAvailableModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error('❌ GEMINI_API_KEY not found in .env file');
    return;
  }

  console.log('✓ API Key found:', apiKey.substring(0, 15) + '...\n');
  console.log('Fetching available models from Google AI...\n');

  const versions = ['v1beta', 'v1'];
  
  for (const version of versions) {
    try {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`Checking API version: ${version}`);
      console.log('='.repeat(60));
      
      const url = `https://generativelanguage.googleapis.com/${version}/models?key=${apiKey}`;
      
      const response = await axios.get(url, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000
      });

      if (response.data?.models) {
        const models = response.data.models;
        console.log(`\n✅ Found ${models.length} models in ${version}:\n`);
        
        models.forEach((model, index) => {
          console.log(`${index + 1}. ${model.name}`);
          if (model.displayName) {
            console.log(`   Display Name: ${model.displayName}`);
          }
          if (model.description) {
            console.log(`   Description: ${model.description.substring(0, 80)}...`);
          }
          if (model.supportedGenerationMethods) {
            console.log(`   Supported Methods: ${model.supportedGenerationMethods.join(', ')}`);
          }
          console.log('');
        });

        // Filter models that support generateContent
        const contentGenModels = models.filter(m => 
          m.supportedGenerationMethods?.includes('generateContent')
        );

        if (contentGenModels.length > 0) {
          console.log(`\n✨ Models that support generateContent (${contentGenModels.length}):\n`);
          contentGenModels.forEach(model => {
            // Extract just the model name (remove the "models/" prefix)
            const modelName = model.name.replace('models/', '');
            console.log(`   ✓ ${modelName}`);
          });
        }
      } else {
        console.log(`❌ No models found in ${version}`);
      }
    } catch (error) {
      const status = error.response?.status || 'N/A';
      const message = error.response?.data?.error?.message || error.message;
      console.log(`\n❌ Error fetching ${version} models:`);
      console.log(`   Status: ${status}`);
      console.log(`   Message: ${message}\n`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('NEXT STEPS:');
  console.log('='.repeat(60));
  console.log('\nIf no models were found:');
  console.log('1. Go to: https://aistudio.google.com/app/apikey');
  console.log('2. Click "Create API Key"');
  console.log('3. Select "Create API key in new project"');
  console.log('4. Copy the new API key');
  console.log('5. Replace GEMINI_API_KEY in your .env file');
  console.log('6. Make sure you\'re using Google AI Studio (not Google Cloud Console)');
  console.log('\nGoogle AI Studio API keys are FREE and have access to Gemini models.');
}

listAvailableModels().catch(console.error);