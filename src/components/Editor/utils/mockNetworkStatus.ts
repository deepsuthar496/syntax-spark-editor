import { useToast } from '@/hooks/use-toast';

interface MockNetworkStatusProps {
  connected: boolean;
  setConnected: (connected: boolean) => void;
  toast: ReturnType<typeof useToast>['toast'];
}

export const mockNetworkStatus = ({
  connected,
  setConnected,
  toast
}: MockNetworkStatusProps) => {
  // Set up a random network status change for demo purposes
  const intervalId = setInterval(() => {
    // 5% chance of changing network status
    if (Math.random() < 0.05) {
      const newConnectedStatus = !connected;
      setConnected(newConnectedStatus);
      
      toast({
        title: newConnectedStatus ? 'Connection Restored' : 'Connection Lost',
        description: newConnectedStatus 
          ? 'Your network connection has been restored.'
          : 'You are currently working offline.',
        variant: newConnectedStatus ? 'default' : 'destructive',
      });
    }
  }, 30000); // Check every 30 seconds
  
  // Cleanup interval on unmount
  return () => {
    clearInterval(intervalId);
  };
};

// Function to get a formatted display for network status
export function getNetworkStatusDisplay(connected: boolean): {
  text: string;
  icon: string;
  className: string;
} {
  return connected
    ? {
        text: 'Connected',
        icon: '🟢',
        className: 'text-green-500',
      }
    : {
        text: 'Offline',
        icon: '🔴',
        className: 'text-red-500',
      };
}