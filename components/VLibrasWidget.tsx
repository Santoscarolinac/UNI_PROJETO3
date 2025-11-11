import { useEffect } from 'react';

const VLibrasWidget = () => {
  useEffect(() => {
    const scriptId = 'vlibras-plugin-script';
    
    if (document.getElementById(scriptId)) {
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
    script.async = true;

    script.onload = () => {
      // @ts-ignore
      if (window.VLibras) {
        // @ts-ignore
        new window.VLibras.Widget('https://vlibras.gov.br/app');
      }
    };

    document.body.appendChild(script);

  }, []);

  return null;
};

export default VLibrasWidget;
