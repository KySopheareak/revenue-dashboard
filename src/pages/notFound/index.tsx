import React from 'react';

const PageNotFound: React.FC = () => (
    <div style={{ textAlign: 'center', alignContent: 'center', marginTop: '300px', fontFamily: 'Arial, sans-serif', fontSize: '18px' }}>
        <img src='/404.gif' alt='404 Not Found' style={{ width: 'auto', height: 'auto' }} />
        <h1>404 - Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
    </div>
);

export default PageNotFound;