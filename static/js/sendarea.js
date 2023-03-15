let expandBtn = document.getElementById('expand-btn');
let lineTop = document.querySelector('.line-top');
let lineBottom = document.querySelector('.line-bottom');
let textareaContainer = document.getElementById('textarea-container');
let textarea = document.getElementById('user-input');
let tools = document.querySelector('.tools');

let openFlag = false;

expandBtn.addEventListener('click', function () {
    if (openFlag) {
        lineTop.style.transform = 'rotate(47deg)';
        lineTop.style.height = '15px';
        lineTop.style.top = '11px';
        lineBottom.style.transform = 'rotate(-47deg)';
        lineBottom.style.height = '15px';
        lineBottom.style.top = '25px';
        textareaContainer.style.height = '0';
        tools.style.visibility = 'hidden';
        tools.style.opacity = '0';

        openFlag = false;
    } else {
        lineTop.style.transform = 'rotate(45deg)';
        lineTop.style.height = '24px';
        lineTop.style.top = '10px';
        lineBottom.style.transform = 'rotate(-45deg)';
        lineBottom.style.height = '24px';
        lineBottom.style.top = '17.4px';
        textareaContainer.style.height = '22vh';
        textarea.focus();
        tools.style.visibility = 'visible';
        tools.style.opacity = '1';

        openFlag = true;
    }
});

// textarea.addEventListener('blur', function () {
//     lineTop.style.transform = 'rotate(47deg)';
//     lineTop.style.height = '15px';
//     lineTop.style.top = '11px';
//     lineBottom.style.transform = 'rotate(-47deg)';
//     lineBottom.style.height = '15px';
//     lineBottom.style.top = '25px';
//     textareaContainer.style.height = '0';
    
//     if (openFlag) {
//         openFlag = false;
//     }
// });

let themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', function () {
    let theme = document.documentElement.getAttribute('data-theme');
    let editorTheme = 'monokai';
    if (theme === 'dark') {
        theme = 'light';
        editorTheme = 'base16-light';
    } else if (theme === 'light') {
        theme = 'dark';
        editorTheme = 'monokai';
    } else {
        theme = 'light';
        editorTheme = 'base16-light';
    }
    
    window.editorHTML.setOption('theme', editorTheme);
    window.editorCSS.setOption('theme', editorTheme);
    window.editorJS.setOption('theme', editorTheme);

    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
});

// 读取网页主题，默认为 dark
window.addEventListener('load', function() {
    let theme = localStorage.getItem('theme');
    let editorTheme = 'monokai';
    if (theme === 'dark') {
        editorTheme = 'monokai';
    } else if (theme === 'light') {
        editorTheme = 'base16-light';
    } else {
        theme = 'dark';
        editorTheme = 'monokai';
    }

    window.editorHTML.setOption('theme', editorTheme);
    window.editorCSS.setOption('theme', editorTheme);
    window.editorJS.setOption('theme', editorTheme);

    document.documentElement.setAttribute('data-theme', theme);
});
