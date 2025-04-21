const https = require('https');
const FormData = require('form-data');
const fetch = require('node-fetch');

const API_URL = 'https://health-detective-api.onrender.com';

async function testRoot() {
  console.log('Testing root endpoint...');
  try {
    const response = await fetch(`${API_URL}/`);
    const data = await response.json();
    console.log('Root endpoint response:', data);
  } catch (error) {
    console.error('Error testing root endpoint:', error.message);
  }
}

async function testDiseases() {
  console.log('Testing diseases endpoint...');
  try {
    const response = await fetch(`${API_URL}/diseases`);
    const data = await response.json();
    console.log('Diseases endpoint response (first item):', 
      Object.keys(data).length > 0 ? Object.entries(data)[0] : 'No data');
  } catch (error) {
    console.error('Error testing diseases endpoint:', error.message);
  }
}

async function testPredict() {
  console.log('Testing predict endpoint...');
  try {
    const formData = new FormData();
    formData.append('symptoms', 'fever');
    formData.append('symptoms', 'cough');
    
    const response = await fetch(`${API_URL}/predict`, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Predict endpoint response:', data);
  } catch (error) {
    console.error('Error testing predict endpoint:', error.message);
  }
}

async function runTests() {
  console.log('Starting API tests...');
  await testRoot();
  await testDiseases();
  await testPredict();
  console.log('Tests completed.');
}

runTests(); 