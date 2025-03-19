// Global TypeScript declarations for Node.js process and environment variables

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    REACT_APP_API_URL?: string;
    // Add other environment variables as needed
  }

  interface Process {
    env: ProcessEnv;
  }
}

declare var process: NodeJS.Process;

// Window environment variables for browser context
interface Window {
  ENV?: {
    NODE_ENV: string;
    REACT_APP_API_URL?: string;
    // Add other environment variables as needed
  };
}
