document.addEventListener("DOMContentLoaded", function () {
    let select = document.getElementById("mpd-select");
    let loadButton = document.getElementById("load-mpd");
    let contentBox = document.getElementById("mpd-content");
    let licList = document.getElementById("lic-list");
    let clearButton = document.getElementById("clear");

    function updatePopup(tabId) {
        chrome.storage.local.get({ mpdData: {} }, function (data) {
            let tabData = data.mpdData[tabId] || { mpdLinks: [], psshValue: "", licLinks: [] };

            // Carica i file MPD
            select.innerHTML = "";
            if (tabData.mpdLinks.length === 0) {
                let option = document.createElement("option");
                option.textContent = "Nessun file MPD trovato";
                option.disabled = true;
                select.appendChild(option);
                select.disabled = true;
                loadButton.disabled = true;
            } else {
                select.disabled = false;
                loadButton.disabled = false;
                tabData.mpdLinks.forEach(link => {
                    let option = document.createElement("option");
                    option.value = link;
                    option.textContent = link;
                    select.appendChild(option);
                });
            }

            // Mostra il valore <cenc:pssh>
            contentBox.value = tabData.psshValue || "Nessun valore PSSH estratto";

            // Carica i file LIC
            licList.innerHTML = "";
            if (tabData.licLinks.length === 0) {
                let li = document.createElement("li");
                li.textContent = "Nessun file LIC trovato";
                licList.appendChild(li);
            } else {
                tabData.licLinks.forEach(link => {
                    let li = document.createElement("li");
                    let a = document.createElement("a");
                    a.href = link;
                    a.textContent = link;
                    a.target = "_blank";
                    li.appendChild(a);
                    licList.appendChild(li);
                });
            }
        });
    }

    // Carica i dati della scheda attiva
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (tabs.length > 0) updatePopup(tabs[0].id);
    });

    // Aggiorna i dati quando cambia scheda
    chrome.tabs.onActivated.addListener(activeInfo => updatePopup(activeInfo.tabId));

    // Carica e analizza il file MPD per trovare <cenc:pssh>
    loadButton.addEventListener("click", function () {
        let selectedURL = select.value;

        if (selectedURL) {
            fetch(selectedURL)
                .then(response => response.text())
                .then(text => {
                    let parser = new DOMParser();
                    let xmlDoc = parser.parseFromString(text, "application/xml");

                    let psshElements = xmlDoc.getElementsByTagName("cenc:pssh");

                    if (psshElements.length > 0) {
                        let extractedText = psshElements[0].textContent.trim();
                        contentBox.value = extractedText;

                        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                            let tabId = tabs[0].id;
                            chrome.storage.local.get({ mpdData: {} }, function (data) {
                                let mpdData = data.mpdData;
                                if (!mpdData[tabId]) mpdData[tabId] = { mpdLinks: [], psshValue: "", licLinks: [] };
                                mpdData[tabId].psshValue = extractedText;
                                chrome.storage.local.set({ mpdData: mpdData });
                            });
                        });

                    } else {
                        contentBox.value = "Tag <cenc:pssh> non trovato nel file MPD.";
                    }
                })
                .catch(error => {
                    contentBox.value = "Errore nel caricamento del file.";
                    console.error("Errore:", error);
                });
        }
    });

    // Cancella i dati della scheda attuale
    clearButton.addEventListener("click", function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            let tabId = tabs[0].id;
            chrome.storage.local.get({ mpdData: {} }, function (data) {
                let mpdData = data.mpdData;
                delete mpdData[tabId];
                chrome.storage.local.set({ mpdData: mpdData }, function () {
                    updatePopup(tabId);
                });
            });
        });
    });
});
