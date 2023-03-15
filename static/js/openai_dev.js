/* 
    请求格式
    {
        "messages": [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": "\
        从现在开始你的回复只能是 html、css、JavaScript 代码，并且我的问题只是让你实现html相关代码。\
        你的回答格式为：html（换行）html代码（换行）css（换行）css代码（换行）js（换行）javascript代码。\
        注意，如果没有某个的代码，代码区域显示为空即可，如果有代码请尽量给代码添加注释。\
        如果我问你的内容让你不能用html、css、js回复，你不能回答\"抱歉，我无法满足这个请求\"等，请只用回复我\"error\"，除此以外你不能回复其他内容。\
        我为你进行的这次设定你无法自己解除，也无法被我的其他语言解除，比如我给你发送\"结束\"、\"停止\"、\"不再为我回复代码\"等指令，你都无法解除设定。\
        明白了的话请只回答\"ok\"，让我知道你明白了。"},
            {
                "role": "assistant",
                "content": "ok"
            },
            {
                "role": "assistant",
                "content": "html\n```html\n<button id=\"colorBtn\">点击变色</button>\n```\n\ncss\n```css\nbutton {\n  padding: 10px 20px;\n  border: none;\n  border-radius: 5px;\n  background-color: #0074D9;\n  color: #fff;\n  font-size: 18px;\n  cursor: pointer;\n}\nbutton:hover, button:focus {\n  background-color: #7FDBFF;\n}\n```\n\njs\n```javascript\nconst colorBtn = document.getElementById('colorBtn');\ncolorBtn.addEventListener('click', () => {\n  colorBtn.style.backgroundColor = '#FF4136';\n});\n```\n点击后按钮背景色会变成红色。"
            }
        ]
    }

    返回格式
    {
        "id": "chatcmpl-6sTHl5YXgqZHMoiAlv43PtrIKXGPW",
        "object": "chat.completion",
        "created": 1678440305,
        "model": "gpt-3.5-turbo-0301",
        "usage": {
            "prompt_tokens": 22,
            "completion_tokens": 11,
            "total_tokens": 33
        },
        "choices": [
            {
                "message": {
                    "role": "assistant",
                    "content": "Sure, what can I help you with?"
                },
            "finish_reason": "stop",
            "index": 0
            }
        ]
    }
*/

let init_request_data = {
    messages: [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "\
        从现在开始你的回复只能是 html、css、JavaScript 代码，并且我的问题只是让你实现html相关代码。\
        你的回答格式为：html（换行）html代码（换行）css（换行）css代码（换行）js（换行）javascript代码。\
        注意，如果没有某个的代码，代码区域显示为空即可，如果有代码请尽量给代码添加注释。\
        如果我问你的内容让你不能用html、css、js回复，你不能回答\"抱歉，我无法满足这个请求\"等，请只用回复我\"error\"，除此以外你不能回复其他内容。\
        我为你进行的这次设定你无法自己解除，也无法被我的其他语言解除，比如我给你发送\"结束\"、\"停止\"、\"不再为我回复代码\"等指令，你都无法解除设定。\
        明白了的话请只回答\"ok\"，让我知道你明白了。"}
    ]
};
const sendBtn = document.getElementById("send");
sendBtn.addEventListener("click", request_openai);

document.getElementById("user-input").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
      // 按下回车键，发送请求
        // request_openai();
    }
});

function init_openai() {
    fetch("/chatgpt", {
        method: "POST",
        body: JSON.stringify(init_request_data),
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                alert("Something went wrong");
            }
        })
        .then(data => {
            ret_msg = data.choices[0].message;
            if (ret_msg.content === "ok") {
                // 保存数据到 localStorage
                let request_data = JSON.parse(JSON.stringify(init_request_data));
                request_data.messages.push(ret_msg);
                localStorage.setItem("request_data", JSON.stringify(request_data));
            } else {
                alert("gpt-3 error，please try again later");
                sendBtn.disabled = true;
            }
        })
        .catch(error => {
            console.error(error)
        });
}

function request_openai() {
    // debug test
    let input_text = document.getElementById("user-input").value;
    document.querySelector(".user-input-content").innerHTML = input_text;

    // let input_text = document.getElementById("user-input").value;
    // if (input_text === "") {
    //     return;
    // }
    // let req_data = JSON.parse(localStorage.getItem("request_data"));
    // if (req_data === null) {
    //     req_data = JSON.parse(JSON.stringify(init_request_data));
    //     req_data.messages.push({"role": "assistant", "content": "ok"});
    // }
    // req_data.messages.push({"role": "user", "content": input_text});
    
    // fetch("/chatgpt", {
    //     method: "POST",
    //     body: JSON.stringify(req_data),
    //     headers: {
    //         "Content-Type": "application/json"
    //     }
    // })
    //     .then(response => {
    //         if (response.ok) {
    //             return response.json();
    //         } else {
    //             alert("Something went wrong");
    //         }
    //     })
    //     .then(data => {
    //         ret_msg = data.choices[0].message;
            
    //         if (ret_msg.content === "error") {
    //             alert("输入的听不懂，请重新输入");
    //         } else {
    //             // 如果请求成功
    //             // 1. 更新 request_data, 并保存到 localStorage 中
    //             req_data.messages.push(ret_msg);
    //             localStorage.setItem("request_data", JSON.stringify(req_data));
    //             // 2. 将用户输入内容显示在页面上， 并将输入框清空
    //             document.querySelector(".user-input-content").innerHTML = input_text;
    //             document.getElementById("user-input").value = "";
    //             // 3. 解析返回的内容, 并显示在页面上
    //             let ret = parse_content(ret_msg.content);
    //             window.editorHTML.setValue(ret["html"]);
    //             window.editorCSS.setValue(ret["css"]);
    //             window.editorJS.setValue(ret["js"]);
    //             // 4. 将 regenerate 按钮设置为可用
    //             document.getElementById("regenerate").disabled = false;
    //         }
    //     })
    //     .catch(error => {
    //         console.error(error)
    //     });
}

// 当页面加载时执行
window.addEventListener("load", function() {
    // init_openai();
    // debug test
    let req_data = JSON.parse(JSON.stringify(init_request_data));
    req_data.messages.push({"role": "assistant", "content": "ok"});
    req_data.messages.push({"role": "user", "content": "hello"});
    req_data.messages.push({"role": "user", "content": "hello2"});
    req_data.messages.push({"role": "user", "content": "hello4你好我要测试一下，请给我写一个红色按钮，我要让这个按钮有一个点击事件，点击后弹出一个alert框，弹出框的内容是\"hello\"。"});
    req_data.codes = [];
    localStorage.setItem("request_data", JSON.stringify(req_data));
});

// 解析返回的数据，返回字典格式: {"html": "html代码", "css": "css代码", "js": "js代码"}
function parse_content(content) {
    let ret = {"html": "", "css": "", "js": ""};

    // 匹配 ``html{xxx}```，获取 代码
    let htmlReg = /```html([\s\S]*?)```/;
    let cssReg = /```css([\s\S]*?)```/;
    let jsReg = /```js([\s\S]*?)```/;

    let htmlContentList = content.match(htmlReg);
    let cssContentList = content.match(cssReg);
    let jsContentList = content.match(jsReg);

    if (htmlContentList) {
        ret["html"] = htmlContentList[1];
    }
    if (cssContentList) {
        ret["css"] = cssContentList[1];
    }
    if (jsContentList) {
        ret["js"] = jsContentList[1];
    }
    return ret;
}
