chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === "start") {
        start();
    }
    sendResponse({});
});

function send(request) {
    chrome.extension.sendMessage(request, function(response) {});
}

var BORDER_THICKNESS = 4;
var overlay, outline;

function start() {
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "el_capture_overlay";
        overlay.style.position = "absolute";
        overlay.style.top = "0px";
        overlay.style.left = "0px";
        overlay.style.width = "100%";
        overlay.style.height = "100%";
        overlay.style.pointerEvents = "none";
        outline = document.createElement("div");
        outline.style.position = "fixed";
        outline.style.zIndex = "9";
        outline.style.border = BORDER_THICKNESS + "px dotted rgb(244, 67, 54)";
        overlay.appendChild(outline);
    }
    if (!overlay.parentNode) {
        document.body.appendChild(overlay);
        document.body.addEventListener("mousemove", mousemove, false);
        document.body.addEventListener("mouseup", mouseup, false);
    }

    var element, dimensions = {};
    function mousemove(e) {
        if (element !== e.target) {
            element = e.target;
            dimensions.top = -window.scrollY;
            dimensions.left = -window.scrollX;
            var elem = e.target;
            console.log(elem);
            while (elem !== document.body && elem !== null) {
                dimensions.top += elem.offsetTop;
                dimensions.left += elem.offsetLeft;
                elem = elem.offsetParent;
            }
            dimensions.width = element.offsetWidth;
            dimensions.height = element.offsetHeight

            outline.style.top = (dimensions.top - BORDER_THICKNESS) + "px";
            outline.style.left = (dimensions.left - BORDER_THICKNESS) + "px";
            outline.style.width = dimensions.width + "px";
            outline.style.height = dimensions.height + "px";
        }
    }
    function mouseup() {
        document.body.removeChild(overlay);
        document.body.removeEventListener("mousemove", mousemove, false);
        document.body.removeEventListener("mouseup", mouseup, false);
        dimensions.devicePixelRatio = window.devicePixelRatio;
        setTimeout(function() { send({ type: "up", dimensions: dimensions }); }, 100);
    }
}

send({ type: "enable" });
