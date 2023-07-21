import * as React from 'react';

const FullPageLoader = ({ className, fixed }) => {
  return (
    <div id="loader-wrapper" style={{background:'#cecece9e'}} className={`${className && className} ${fixed && 'popup-fixed'}`}>
          <div id="loader"></div>
    </div>
  );
}

export default FullPageLoader;

