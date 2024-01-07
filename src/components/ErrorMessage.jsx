import React from "react";

const ErrorMessage = ({ onRetry }) => {
  return (
    <div className="error-screen">
      <p>
        Oops! Location not found. Please try again with valid location name.
      </p>
      <button onClick={onRetry}>Retry</button>
    </div>
  );
};

export default ErrorMessage;
