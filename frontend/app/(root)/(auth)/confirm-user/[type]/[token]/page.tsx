'use client';

import React from 'react';
import { useParams } from 'next/navigation';

const ConfirmUser: React.FC = () => {
  const params = useParams();
  const { type, token } = params as { type: string; token: string };

  console.log('Type:', type);
  console.log('Token:', token);

  console.log(type, token, 'GGGGGG');

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Confirm User</h1>
      {type && (
        <p>
          <strong>Type:</strong> {type}
        </p>
      )}
      {token && (
        <p>
          <strong>Token:</strong> {token}
        </p>
      )}
    </div>
  );
};

export default ConfirmUser;
