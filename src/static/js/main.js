function updateFrame() {
    const html = window.editorHTML.getValue();
    const css = window.editorCSS.getValue();
    const js = window.editorJS.getValue();
    const iframeDoc = iframe.contentWindow.document;

    iframeDoc.open();
    iframeDoc.write(`
        <html>
            <head>
                <style>${css}</style>
            </head>
            <body>
                ${html}
                <script>${js}</script>
            </body>
        </html>
    `);
    iframeDoc.close();
}

// html css js tab switch
function openTab(tabName) {
    const tabcontent = document.getElementsByClassName("tabcontent");
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    const tablinks = document.getElementsByClassName("tablinks");
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    document.getElementById(tabName).style.display = "block";
    document.getElementById(tabName + "-tab").className += " active";
}

// when dom content loaded
document.addEventListener("DOMContentLoaded", function() {
    openTab("html");
    updateFrame();
});

// show history
document.getElementById("history").addEventListener("click", function() {
    const datas = JSON.parse(localStorage.getItem("request_data"));
    if (datas === null) {
        $.Toast("Message", "no history message.", "info", {
            stack: true,
            has_icon: true,
            has_close_btn: true,
            fullscreen: false,
            timeout: 3000,
            sticky: false,
            has_progress: true,
            rtl: false,
        });
        
        return;
    }
    
    let html = "";
    try {
        // 遍历 data.messages,
        // 从 {"role": "assistant", "content": "ok"} 开始，将后面所有的 role: user 的内容都显示出来
        let findTarget = false;
        let reqMsgArray = [];
        for (let i = 0; i < datas.messages.length; i++) {
            if (datas.messages[i].role === "assistant" && datas.messages[i].content === "ok") {
                findTarget = true;
                continue;
            }
            if (findTarget && datas.messages[i].role === "user") {
                reqMsgArray.push(datas.messages[i].content);
            }
        }
        if (!findTarget) {
            localStorage.removeItem("request_data");
            $.Toast("Message", "no history message.", "info", {
                stack: true,
                has_icon: true,
                has_close_btn: true,
                fullscreen: false,
                timeout: 3000,
                sticky: false,
                has_progress: true,
                rtl: false,
            });
            return;
        }
        if (reqMsgArray.length === 0) {
            $.Toast("Message", "no history message.", "info", {
                stack: true,
                has_icon: true,
                has_close_btn: true,
                fullscreen: false,
                timeout: 3000,
                sticky: false,
                has_progress: true,
                rtl: false,
            });
            return;
        }
        let msgCount = reqMsgArray.length;
        let startIndex = 0;
        if (msgCount > 10) {
            msgCount = 10;
            startIndex = reqMsgArray.length - 10;
        }
        for (let j = 0; j < msgCount; j++) {
            html += `<p class="history-item" onclick="onChooseHistoryItem(event)" data-index="${j}">${reqMsgArray[startIndex + j]}</p>`;
        }
    } catch (error) {
        localStorage.removeItem("request_data");
        $.Toast("Message", "no history message.", "info", {
            stack: true,
            has_icon: true,
            has_close_btn: true,
            fullscreen: false,
            timeout: 3000,
            sticky: false,
            has_progress: true,
            rtl: false,
        });
        return;
    }
    
    var popup = document.getElementById("popup");
    var content = document.querySelector(".popup-content");
    popup.classList.toggle("active");
    content.innerHTML = html;
});

document.getElementById("clear-history").addEventListener("click", function() {
    localStorage.removeItem("request_data");
    $.Toast("Message", "history messages cleared.", "success", {
        stack: true,
        has_icon: true,
        has_close_btn: true,
        fullscreen: false,
        timeout: 3000,
        sticky: false,
        has_progress: true,
        rtl: false,
    });
    closePopup();
});

function onChooseHistoryItem(event) {
    const request_data = JSON.parse(localStorage.getItem("request_data"));
    if (request_data === null) {
        $.Toast("Error", "Service error, please refresh the page.", "error", {
            stack: true,
            has_icon: true,
            has_close_btn: true,
            fullscreen: false,
            timeout: 10000,
            sticky: false,
            has_progress: true,
            rtl: false,
        });
        return;
    }
    const index = event.target.getAttribute("data-index");
    if (index === null || parseInt(index) >= request_data.codes.length) {
        $.Toast("Error", "Service error, please clean the history messages.", "error", {
            stack: true,
            has_icon: true,
            has_close_btn: true,
            fullscreen: false,
            timeout: 10000,
            sticky: false,
            has_progress: true,
            rtl: false,
        });
        return;
    }
    const data = request_data.codes[parseInt(index)];
    // 1. 将用户输入内容显示在页面上
    document.querySelector(".user-input-content").innerHTML = data["msg"];
    // 2. 将 code 显示到页面上
    window.editorHTML.setValue(data["html"]);
    window.editorCSS.setValue(data["css"]);
    window.editorJS.setValue(data["js"]);
    // 3. 将 regenerate 按钮设置为可用
    document.getElementById("regenerate").disabled = false;
}

function closePopup() {
    var popup = document.getElementById("popup");
    popup.classList.toggle("active");
}
