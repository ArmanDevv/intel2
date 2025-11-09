// test-gemini-models.js
// Run this with: node test-gemini-models.js

require('dotenv').config();
const axios = require('axios');

async function testGeminiModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error('❌ GEMINI_API_KEY not found in .env file');
    return;
  }

  console.log('✓ API Key found:', apiKey.substring(0, 10) + '...');
  console.log('\nTesting available models...\n');

  const modelsToTest = [
    { name: 'gemini-pro', version: 'v1' },
    { name: 'gemini-pro-vision', version: 'v1' },
    { name: 'gemini-1.5-pro', version: 'v1beta' },
    { name: 'gemini-1.5-flash', version: 'v1beta' },
    { name: 'gemini-1.5-pro-latest', version: 'v1beta' },
    { name: 'gemini-1.5-flash-latest', version: 'v1beta' }
  ];

  const workingModels = [];

  for (const model of modelsToTest) {
    try {
      const url = `https://generativelanguage.googleapis.com/${model.version}/models/${model.name}:generateContent?key=${apiKey}`;
      
      const response = await axios.post(url, {
        contents: [{
          parts: [{ text: "Say 'Hello'" }]
        }]
      }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000
      });

      if (response.data?.candidates?.[0]) {
        const reply = response.data.candidates[0].content.parts[0].text;
        console.log(`✅ ${model.name} (${model.version}) - WORKS!`);
        console.log(`   Response: ${reply.substring(0, 50)}...\n`);
        workingModels.push(model);
      }
    } catch (error) {
      const status = error.response?.status || 'N/A';
      const message = error.response?.data?.error?.message || error.message;
      console.log(`❌ ${model.name} (${model.version}) - FAILED`);
      console.log(`   Error ${status}: ${message.substring(0, 100)}...\n`);
    }
  }

  console.log('\n' + '='.repeat(50));
  if (workingModels.length > 0) {
    console.log(`\n✅ Found ${workingModels.length} working model(s):`);
    workingModels.forEach(m => console.log(`   - ${m.name} (${m.version})`));
    console.log('\nUpdate your routes/content.js to use one of these models.');
  } else {
    console.log('\n❌ No working models found!');
    console.log('\nPossible issues:');
    console.log('1. Invalid API key');
    console.log('2. API key doesn\'t have access to Gemini models');
    console.log('3. Billing not enabled on your Google Cloud project');
    console.log('\nGet a new API key at: https://aistudio.google.com/app/apikey');
  }
}

testGeminiModels().catch(console.error);