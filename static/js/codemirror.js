var editorHTML = CodeMirror.fromTextArea(document.getElementById("html-input"), {
    autoRefresh: true,      // 自动刷新
    lineNumbers: true,      // 显示行数
    indentUnit: 4,          // 缩进单位为4
    styleActiveLine: true,  // 当前行背景高亮
    matchBrackets: true,    // 括号匹配
    mode: "htmlmixed",      // HMTL混合模式
    lineWrapping: true,     // 自动换行
    theme: 'monokai',       // 使用monokai模版
});

var editorCSS = CodeMirror.fromTextArea(document.getElementById("css-input"), {
    autoRefresh: true,
    lineNumbers: true,
    indentUnit: 4,
    styleActiveLine: true,
    matchBrackets: true,
    mode: "css",
    lineWrapping: true,
    theme: 'monokai',
});

var editorJS = CodeMirror.fromTextArea(document.getElementById("js-input"), {
    autoRefresh: true,
    lineNumbers: true,
    indentUnit: 4,
    styleActiveLine: true,
    matchBrackets: true,
    mode: "javascript",
    lineWrapping: true,
    theme: 'monokai',
});

editorHTML.on("change", updateFrame);
editorCSS.on("change", updateFrame);
editorJS.on("change", updateFrame);

// codemirror 监测按键 ctrl +s 事件
editorHTML.addKeyMap({
    "Ctrl-S": function(cm) {
        updateFrame();
    }
});
editorCSS.addKeyMap({
    "Ctrl-S": function(cm) {
        updateFrame();
    }
});
editorJS.addKeyMap({
    "Ctrl-S": function(cm) {
        updateFrame();
    }
});

// 导出变量
window.editorHTML = editorHTML;
window.editorCSS = editorCSS;
window.editorJS = editorJS;
