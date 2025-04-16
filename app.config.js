import 'dotenv/config';

export default ({ config }) => ({
  ...config,
  name: 'reactcumple',
  slug: 'reactcumple',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    backgroundColor: '#ffffff',
    resizeMode: 'contain'
  },
  assetBundlePatterns: [
    '**/*'
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.tucumpleapp',
    jsEngine: 'hermes',
    enableHermes: true
  },
  android: {
    adaptiveIcon: {
      backgroundColor: '#ffffff'
    },
    package: 'com.tucumpleapp',
    jsEngine: 'hermes',
    enableHermes: true
  },
  web: {
    favicon: './assets/favicon.png'
  },
  extra: {
    supabaseUrl: "https://rallpixftuphykuhowds.supabase.co",
    supabaseAnonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhbGxwaXhmdHVwaHlrdWhvd2RzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0ODM0OTMsImV4cCI6MjA2MDA1OTQ5M30._o48hNCSHFeIWkrKE_14wvKfpb2lzlsd8OWy7GgXAF0",
    eas: {
      projectId: "your-project-id"
    }
  },
  plugins: [
    [
      'expo-notifications',
      {
        icon: './assets/notification-icon.png',
        color: '#ffffff'
      }
    ]
  ],
  experiments: {
    tsconfigPaths: true,
    newArchEnabled: true
  }
}); 