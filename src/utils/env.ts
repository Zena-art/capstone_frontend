
// Get the value of an environment variable
export const getEnvVariable = (key: string): string => {
  if (import.meta.env && import.meta.env[key]) {
    return import.meta.env[key] as string;
  } else if (process.env && process.env[key]) {
    return process.env[key] as string;
  }
  throw new Error(`Environment variable ${key} is not set.`);
};

export const API_URL = getEnvVariable('VITE_API_URL') || 'http://localhost:3000/api';