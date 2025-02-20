document.addEventListener("DOMContentLoaded", function () {
    let select = document.getElementById("mpd-select");
    let loadButton = document.getElementById("load-mpd");
    let contentBox = document.getElementById("mpd-content");
    let licList = document.getElementById("lic-list");
    let clearButton = document.getElementById("clear");
    let copyPsshButton = document.getElementById("copy-pssh");
    let copyLicButton = document.getElementById("copy-lic");
    let saveNameInput = document.getElementById("save-name");
    let keyInput = document.getElementById("key-input");
    let generateBatButton = document.getElementById("generate-bat");

    function updatePopup(tabId) {
        chrome.storage.local.get({ mpdData: {} }, function (data) {
            let tabData = data.mpdData[tabId] || { mpdLinks: [], psshValue: "", licLinks: [] };

            // Load MPD files
            select.innerHTML = "";
            if (tabData.mpdLinks.length === 0) {
                let option = document.createElement("option");
                option.textContent = "No MPD files found";
                option.disabled = true;
                select.appendChild(option);
            } else {
                tabData.mpdLinks.forEach(link => {
                    let option = document.createElement("option");
                    option.value = link;
                    option.textContent = link;
                    select.appendChild(option);
                });
            }

            // Load extracted PSSH value
            contentBox.value = tabData.psshValue || "No PSSH value extracted";

            // Load LIC URLs
            licList.innerHTML = "";
            if (tabData.licLinks.length === 0) {
                let li = document.createElement("li");
                li.textContent = "No LIC URLs found";
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

    loadButton.addEventListener("click", function () {
        let selectedURL = select.value;

        if (!selectedURL) {
            alert("Please select an MPD file.");
            return;
        }

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
                    contentBox.value = "No <cenc:pssh> tag found in the MPD file.";
                }
            })
            .catch(error => {
                contentBox.value = "Error loading MPD file.";
                console.error("Error:", error);
            });
    });

    copyPsshButton.addEventListener("click", function () {
        navigator.clipboard.writeText(contentBox.value);
    });

    copyLicButton.addEventListener("click", function () {
        let allLicLinks = Array.from(licList.querySelectorAll("a")).map(a => a.href).join("\n");
        navigator.clipboard.writeText(allLicLinks);
    });

    generateBatButton.addEventListener("click", function () {
        let selectedMPD = select.value;
        let saveName = saveNameInput.value.trim();
        let key = keyInput.value.trim();

        if (!selectedMPD) {
            alert("Please select an MPD file.");
            return;
        }
        if (!saveName) {
            alert("Please enter a file name.");
            return;
        }
        if (!key) {
            alert("Please enter a decryption key.");
            return;
        }

        let batContent = `N_m3u8DL-RE "${selectedMPD}" --save-name "${saveName}" --sub-format srt -sv best -sa all -ss all --use-shaka-packager --key "${key}" -M format=mkv\npause`;

        let blob = new Blob([batContent], { type: "text/plain" });
        let link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${saveName}.bat`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

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

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        updatePopup(tabs[0].id);
    });
});
