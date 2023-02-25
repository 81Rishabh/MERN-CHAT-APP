import React from 'react';
import './Loading.scss';

function Loading() {
  return (
    <div className="w-full h-1 absolute inset-x-0 bottom-0 rounded-md loading-container">
      <div className="loader"></div>
    </div>
  )
}

export default Loading