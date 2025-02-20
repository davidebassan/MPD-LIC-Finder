(function openDevTools() {
    if (!window.devtoolsOpen) {
      console.log("Apertura DevTools...");
      const event = new KeyboardEvent('keydown', { key: 'F12', code: 'F12' });
      document.dispatchEvent(event);
      window.devtoolsOpen = true;
    }
  })();
  