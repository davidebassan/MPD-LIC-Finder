chrome.webRequest.onCompleted.addListener(
    function (details) {
      let url = details.url;
  
      // Trova la scheda attiva
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (tabs.length === 0) return;
        let tabId = tabs[0].id; // ID della scheda attiva
  
        // Salva i file .mpd associati alla scheda
        if (url.match(/\.mpd$/)) {
          console.log("Trovato file MPD:", url);
          chrome.storage.local.get({ mpdData: {} }, function (data) {
            let mpdData = data.mpdData;
            if (!mpdData[tabId]) mpdData[tabId] = { mpdLinks: [], psshValue: "", licLinks: [] };
            if (!mpdData[tabId].mpdLinks.includes(url)) {
              mpdData[tabId].mpdLinks.push(url);
              chrome.storage.local.set({ mpdData: mpdData });
            }
          });
        }
  
        // Salva i file .lic associati alla scheda
        if (url.toLowerCase().includes("lic")) {
          console.log("Trovato file LIC:", url);
          chrome.storage.local.get({ mpdData: {} }, function (data) {
            let mpdData = data.mpdData;
            if (!mpdData[tabId]) mpdData[tabId] = { mpdLinks: [], psshValue: "", licLinks: [] };
            if (!mpdData[tabId].licLinks.includes(url)) {
              mpdData[tabId].licLinks.push(url);
              chrome.storage.local.set({ mpdData: mpdData });
            }
          });
        }
      });
    },
    { urls: ["<all_urls>"] }
  );
  