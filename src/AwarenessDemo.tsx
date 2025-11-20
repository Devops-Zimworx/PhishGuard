import React from 'react';
import { SecurityAwarenessSuccess } from './components/SecurityAwarenessSuccess';

function AwarenessDemo() {
  return (
    <SecurityAwarenessSuccess
      variant="variant_a"
      submittedEmail="john.doe@example.com"
      submittedName="John Doe"
      onClose={() => console.log('Close clicked')}
    />
  );
}

export default AwarenessDemo;
