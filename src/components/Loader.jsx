import * as React from 'react';

const Loader = ({ className, fixed }) => {
  return (
    <div id="loader-wrapper" className={`${className && className} ${fixed && 'popup-fixed'}`}>
          <div id="loader"></div>
    </div>
  );
}

export default Loader;

