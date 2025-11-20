import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

const NotFound = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="text-9xl font-bold text-ocubyte-accent">404</h1>
      <h2 className="mt-4 text-4xl font-medium">Page Not Found</h2>
      <p className="mt-2 text-lg">The page you are looking for does not exist.</p>
      <Link to="/" className="mt-8">
        <Button>Go Home</Button>
      </Link>
    </div>
  );
};

export default NotFound;
