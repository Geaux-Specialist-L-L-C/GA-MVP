const config = {
  AZURE_ENDPOINT: process.env.REACT_APP_AZURE_ENDPOINT || 'https://ai-geauxacademy8942ai219453410909.openai.azure.com/',
  AZURE_COGNITIVE_ENDPOINT: process.env.REACT_APP_AZURE_COGNITIVE_ENDPOINT || 'https://ai-geauxacademy8942ai219453410909.cognitiveservices.azure.com/',
  AZURE_DEPLOYMENT_ENDPOINT: process.env.REACT_APP_AZURE_DEPLOYMENT_ENDPOINT || 'https://ai-geauxacademy8942ai219453410909.services.ai.azure.com/models',
  MODEL_NAME: process.env.REACT_APP_MODEL_NAME || 'gpt-4',
  AZURE_API_KEY: process.env.REACT_APP_AZURE_API_KEY || process.env.VITE_OPENAI_API_KEY
};

export default config;
