const reportWebVitals = onPerfEntry => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP }) => { // cspell:ignore getTTFB
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      // getTTFB(onPerfEntry); // cspell:ignore getTTFB
    });
  }
};

export default reportWebVitals;
