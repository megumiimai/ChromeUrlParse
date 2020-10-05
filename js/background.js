chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.result) {
        sendResponse({
            farewell: "ok"
        });
    }

    localStorage.setItem("key", request.msg);
});
chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.sendMessage(
        tab.id,
        {},
        function(response) {
        }
    );
});
