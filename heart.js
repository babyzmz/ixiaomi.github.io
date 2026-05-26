function clearPageSelection() {
    var selection = window.getSelection && window.getSelection();
    if (selection && selection.removeAllRanges) {
        selection.removeAllRanges();
    }
}

function sl() {
    clearPageSelection();
    var div = document.getElementsByClassName("text")[0];
    if (!div) return;

    if (div.style.display == "block") {
        if (window.gsap) {
            gsap.to(div, {
                opacity: 0,
                y: -14,
                scale: 0.98,
                duration: 0.28,
                ease: "power2.in",
                onComplete: function() {
                    div.style.display = "none";
                }
            });
        }
        else {
            div.style.display = "none";
        }
    } else {
        div.style.display = "block";
        if (window.gsap) {
            gsap.fromTo(
                div,
                {opacity: 0, y: -24, scale: 0.94},
                {opacity: 1, y: 0, scale: 1, duration: 0.72, ease: "back.out(1.6)"}
            );
            gsap.fromTo(
                ".love-line span",
                {y: 18, opacity: 0, filter: "blur(6px)"},
                {y: 0, opacity: 1, filter: "blur(0px)", duration: 0.7, delay: 0.12, ease: "power3.out"}
            );
            gsap.fromTo(
                ".love-line i",
                {scale: 0.2, rotation: -18, opacity: 0},
                {scale: 1, rotation: 0, opacity: 1, duration: 0.58, delay: 0.34, ease: "elastic.out(1, 0.45)"}
            );
        }
    }
}
function a(){
    if (window.miniPlayerControls && window.miniPlayerControls.togglePlay) {
        window.miniPlayerControls.togglePlay();
        return;
    }
    var audio = document.getElementById('music');
    if(!audio) return;
    if(audio.paused){
        var p = audio.play();
        if (p && p.catch) p.catch(function(){});
    }
    else{
         audio.pause();
    } 
}

function animateTimerDigit(el) {
    if (!el || !window.gsap) return;
    gsap.fromTo(
        el,
        {y: -4, scale: 1.045},
        {y: 0, scale: 1, duration: 0.24, ease: "power2.out", force3D: true}
    );
}

function initUiMotion() {
    if (!window.gsap) return;
    gsap.fromTo(
        ".box",
        {scale: 0.92, opacity: 0},
        {scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.5)"}
    );
    gsap.fromTo(
        ".timer-panel",
        {y: 24, opacity: 0, filter: "blur(8px)"},
        {y: 0, opacity: 1, filter: "blur(0px)", duration: 0.9, delay: 0.18, ease: "power3.out"}
    );
    gsap.fromTo(
        ".time-unit",
        {y: 16, opacity: 0},
        {y: 0, opacity: 1, duration: 0.46, stagger: 0.08, delay: 0.42, ease: "back.out(1.8)"}
    );
}

function initHeartInteractionGuards() {
    var heartBox = document.querySelector(".box");
    if (!heartBox) return;

    heartBox.addEventListener("mousedown", function(e) {
        e.preventDefault();
        clearPageSelection();
    });
    heartBox.addEventListener("touchstart", function() {
        clearPageSelection();
    }, {passive: true});
}

var heartTapState = {
    count: 0,
    timer: null,
    lastSpecialEffectKey: null
};

var loveStartDate = new Date(2022, 10, 11);

var loveWeatherList = [
    {
        title: "\u7c89\u8272\u591a\u4e91",
        desc: "\u9002\u5408\u8d34\u8d34\uff0c\u4e5f\u9002\u5408\u88ab\u5938\u3002",
        index: "99%",
        note: "\u4eca\u5929\u4e5f\u8981\u5077\u5077\u559c\u6b22\u8001\u5a46\u4e00\u4e0b\u3002"
    },
    {
        title: "\u751c\u5ea6\u8d85\u6807",
        desc: "\u7a7a\u6c14\u91cc\u6709\u8349\u8393\u5473\u548c\u60f3\u4f60\u7684\u5473\u9053\u3002",
        index: "100%",
        note: "\u4eca\u65e5\u4efb\u52a1\uff1a\u62b1\u62b1\u3001\u5938\u5938\u3001\u8d34\u8d34\u3002"
    },
    {
        title: "\u5c0f\u9e7f\u4e71\u649e",
        desc: "\u5fc3\u8df3\u901f\u5ea6\u7565\u9ad8\uff0c\u5efa\u8bae\u7275\u624b\u964d\u6e29\u3002",
        index: "95%",
        note: "\u4f60\u4e00\u51fa\u73b0\uff0c\u80cc\u666f\u97f3\u4e50\u90fd\u4f1a\u53d8\u751c\u3002"
    },
    {
        title: "\u8d34\u8d34\u9884\u8b66",
        desc: "\u4eca\u65e5\u4eb2\u5bc6\u5ea6\u504f\u9ad8\uff0c\u5efa\u8bae\u53ca\u65f6\u62b1\u62b1\u3002",
        index: "98%",
        note: "\u4eca\u5929\u4e5f\u8981\u8ba4\u771f\u8bf4\u4e00\u53e5\uff1a\u6211\u559c\u6b22\u4f60\u3002"
    },
    {
        title: "\u665a\u5b89\u6a21\u5f0f",
        desc: "\u6708\u4eae\u5df2\u7ecf\u4e0a\u7ebf\uff0c\u9002\u5408\u8bf4\u6084\u6084\u8bdd\u3002",
        index: "96%",
        note: "\u4eca\u665a\u4e5f\u8981\u5e26\u7740\u559c\u6b22\u4f60\u8fd9\u4ef6\u4e8b\u7761\u89c9\u3002"
    }
];

var specialDays = [
    {type:"days", value:1292, title:"\u7b2c 1292 \u5929", desc:"\u6211\u4eec\u5df2\u7ecf\u4e00\u8d77\u8d70\u5230\u8fd9\u91cc\u5566\u3002", note:"\u4eca\u5929\u4e5f\u4e0d\u662f\u666e\u901a\u7684\u4e00\u5929\uff0c\u56e0\u4e3a\u5b83\u5c5e\u4e8e\u6211\u4eec\u3002", effect:"soft"},
    {type:"days", value:1300, title:"\u7b2c 1300 \u5929", desc:"\u53c8\u4e00\u4e2a\u6574\u767e\u5929\u8fbe\u6210\u3002", note:"\u559c\u6b22\u4f60\u8fd9\u4ef6\u4e8b\uff0c\u5df2\u7ecf\u8ba4\u771f\u7d2f\u8ba1\u4e86 1300 \u5929\u3002", effect:"soft"},
    {type:"days", value:1314, title:"\u4e00\u751f\u4e00\u4e16\u6a21\u5f0f", desc:"\u4eca\u5929\u662f\u6211\u4eec\u5728\u4e00\u8d77\u7684\u7b2c 1314 \u5929\u3002", note:"\u4e00\u751f\u4e00\u4e16\u4e0d\u662f\u4e00\u53e5\u8bdd\uff0c\u662f\u6211\u4eec\u6bcf\u5929\u90fd\u5728\u4e00\u8d77\u8d70\u3002", effect:"big-heart"},
    {type:"days", value:1400, title:"\u7b2c 1400 \u5929", desc:"\u5e73\u51e1\u65e5\u5b50\u4e5f\u503c\u5f97\u7eaa\u5ff5\u3002", note:"\u56e0\u4e3a\u4f60\u5728\uff0c\u6240\u4ee5\u666e\u901a\u7684\u4e00\u5929\u4e5f\u4f1a\u53d1\u5149\u3002", effect:"soft"},
    {type:"days", value:1500, title:"\u7b2c 1500 \u5929", desc:"1500 \u5929\u7eaa\u5ff5\u3002", note:"\u6211\u4eec\u5df2\u7ecf\u628a\u559c\u6b22\uff0c\u6162\u6162\u8fc7\u6210\u4e86\u751f\u6d3b\u3002", effect:"soft"},
    {type:"days", value:1600, title:"\u7b2c 1600 \u5929", desc:"\u53c8\u4e00\u4e2a\u6574\u767e\u5929\u3002", note:"\u8c22\u8c22\u4f60\u4e00\u76f4\u5728\u6211\u7684\u65e5\u5b50\u91cc\u3002", effect:"soft"},
    {type:"days", value:1700, title:"\u7b2c 1700 \u5929", desc:"\u6574\u767e\u5929\u7eaa\u5ff5\u3002", note:"\u559c\u6b22\u4f60\u7684\u65e5\u5b50\uff0c\u53c8\u591a\u4e86\u4e00\u4e2a\u6e29\u67d4\u7684\u91cc\u7a0b\u7891\u3002", effect:"soft"},
    {type:"days", value:1800, title:"\u7b2c 1800 \u5929", desc:"\u6574\u767e\u5929\u7eaa\u5ff5\u3002", note:"\u5e73\u51e1\u7684\u6bcf\u4e00\u5929\uff0c\u90fd\u88ab\u4f60\u53d8\u5f97\u503c\u5f97\u8bb0\u4f4f\u3002", effect:"soft"},
    {type:"days", value:1888, title:"\u5e78\u8fd0\u66b4\u51fb\u65e5", desc:"\u4eca\u5929\u662f\u6211\u4eec\u5728\u4e00\u8d77\u7684\u7b2c 1888 \u5929\u3002", note:"\u604b\u7231\u8fd0\u52bf\uff1a\u8d85\u7ea7\u5927\u5409\u3002", effect:"lucky"},
    {type:"days", value:2000, title:"\u7b2c 2000 \u5929", desc:"\u4e24\u5343\u5929\u7eaa\u5ff5\u3002", note:"\u4e24\u5343\u5929\u4e0d\u662f\u7ec8\u70b9\uff0c\u662f\u4e0b\u4e00\u6bb5\u6545\u4e8b\u7684\u5f00\u5934\u3002", effect:"big-heart"},
    {type:"days", value:2022, title:"\u5199\u7ed9\u5f00\u59cb\u7684\u56de\u4fe1", desc:"\u4eca\u5929\u662f\u6211\u4eec\u5728\u4e00\u8d77\u7684\u7b2c 2022 \u5929\u3002", note:"2022 \u662f\u5f00\u59cb\uff0c2022 \u5929\u662f\u6211\u4eec\u7ed9\u5f00\u59cb\u7684\u56de\u4fe1\u3002", effect:"memory"},
    {type:"days", value:2222, title:"\u53cc\u4eba\u6210\u53cc\u65e5", desc:"\u4eca\u5929\u662f\u6211\u4eec\u5728\u4e00\u8d77\u7684\u7b2c 2222 \u5929\u3002", note:"\u4eca\u5929\u7684\u4e16\u754c\u521a\u597d\u6392\u6210\u4e86\u6211\u4eec\u4e24\u4e2a\u3002", effect:"lucky"},
    {type:"days", value:3000, title:"\u7b2c 3000 \u5929", desc:"\u8d85\u5927\u8282\u70b9\u8fbe\u6210\u3002", note:"3000 \u5929\u4ee5\u540e\uff0c\u6211\u8fd8\u662f\u60f3\u548c\u4f60\u7ee7\u7eed\u8d70\u4e0b\u53bb\u3002", effect:"big-heart"},
    {type:"date", month:11, day:11, title:"\u5468\u5e74\u7eaa\u5ff5\u65e5", desc:"\u4ece 2022.11.11 \u5230\u4eca\u5929\u3002", note:"\u6211\u4eec\u53c8\u4e00\u8d77\u8d70\u8fc7\u4e86\u4e00\u6574\u5e74\u3002", effect:"anniversary"},
    {type:"date", month:5, day:20, title:"520 \u6a21\u5f0f", desc:"\u4eca\u5929\u9002\u5408\u628a\u559c\u6b22\u8bf4\u5f97\u66f4\u660e\u663e\u4e00\u70b9\u3002", note:"520\uff0c\u4e0d\u53ea\u4eca\u5929\u559c\u6b22\u4f60\u3002", effect:"soft"},
    {type:"date", month:5, day:21, title:"521 \u6a21\u5f0f", desc:"\u4eca\u5929\u4e5f\u8981\u8ba4\u771f\u8bf4\u559c\u6b22\u4f60\u3002", note:"521\uff0c\u6bd4\u6628\u5929\u591a\u4e00\u70b9\u3002", effect:"soft"},
    {type:"date", month:2, day:14, title:"\u60c5\u4eba\u8282\u6a21\u5f0f", desc:"\u4eca\u5929\u662f\u5168\u4e16\u754c\u90fd\u9002\u5408\u604b\u7231\u7684\u65e5\u5b50\u3002", note:"\u4f46\u6211\u559c\u6b22\u4f60\uff0c\u4e0d\u53ea\u5728\u60c5\u4eba\u8282\u3002", effect:"soft"},
    {type:"date", month:3, day:14, title:"\u767d\u8272\u60c5\u4eba\u8282", desc:"\u4eca\u5929\u9002\u5408\u56de\u7b54\u559c\u6b22\uff0c\u4e5f\u9002\u5408\u7ee7\u7eed\u559c\u6b22\u3002", note:"\u6211\u7684\u56de\u7b54\u4e00\u76f4\u662f\uff1a\u8d85\u559c\u6b22\u4f60\u3002", effect:"soft"},
    {type:"date", month:12, day:25, title:"\u5723\u8bde\u604b\u7231\u5929\u6c14", desc:"\u4eca\u5929\u9002\u5408\u7275\u624b\u3001\u62cd\u7167\u3001\u5403\u70b9\u751c\u7684\u3002", note:"\u5723\u8bde\u5feb\u4e50\uff0c\u6211\u7684\u5c0f\u670b\u53cb\u3002", effect:"snow"}
];

function getRandomLoveWeather() {
    var hour = new Date().getHours();
    if (hour >= 22 || hour < 6) {
        for (var i = 0; i < loveWeatherList.length; i++) {
            if (loveWeatherList[i].title === "晚安模式") {
                return loveWeatherList[i];
            }
        }
    }
    return loveWeatherList[Math.floor(Math.random() * loveWeatherList.length)];
}

function getLoveDayCount(date) {
    var now = date || new Date();
    return Math.floor((now - loveStartDate) / 86400000) + 1;
}

function getSpecialLoveDay(date) {
    var now = date || new Date();
    var dayCount = getLoveDayCount(now);
    var month = now.getMonth() + 1;
    var day = now.getDate();
    var dateMatch = null;

    for (var i = 0; i < specialDays.length; i++) {
        var item = specialDays[i];
        if (item.type === "days" && item.value === dayCount) {
            return item;
        }
        if (item.type === "date" && item.month === month && item.day === day) {
            dateMatch = item;
        }
    }
    return dateMatch;
}

function getLoveWeatherItem() {
    return getSpecialLoveDay() || getRandomLoveWeather();
}

function pickLoveWeather() {
    var item = getLoveWeatherItem();
    var title = document.getElementById("weatherTitle");
    var desc = document.getElementById("weatherDesc");
    var index = document.getElementById("loveIndex");
    var note = document.getElementById("dailyNote");
    if (!title || !desc || !index || !note) return;

    title.textContent = item.title;
    desc.textContent = item.desc;
    index.textContent = item.index;
    note.textContent = item.note;
    applySpecialLoveEffect(item);

    if (window.gsap) {
        gsap.fromTo(
            ".weather-card",
            {y: 8, opacity: 0.75, scale: 0.98},
            {y: 0, opacity: 1, scale: 1, duration: 0.32, ease: "power2.out"}
        );
    }
}

function toggleLoveWeather(forceOpen) {
    var panel = document.getElementById("loveWeather");
    if (!panel) return;
    if (forceOpen) {
        panel.classList.add("is-open");
    }
    else {
        panel.classList.toggle("is-open");
    }
    if (panel.classList.contains("is-open")) {
        pickLoveWeather();
    }
}

function initLoveWeather() {
    var panel = document.getElementById("loveWeather");
    var tab = document.getElementById("weatherTab");
    var refresh = document.getElementById("noteRefresh");
    if (!panel || !tab || !refresh) return;

    tab.addEventListener("click", function() {
        toggleLoveWeather();
    });
    refresh.addEventListener("click", function(e) {
        e.stopPropagation();
        pickLoveWeather();
    });
    pickLoveWeather();
}

function heartTap() {
    clearPageSelection();
    heartTapState.count++;
    clearTimeout(heartTapState.timer);
    heartTapState.timer = setTimeout(function() {
        heartTapState.count = 0;
    }, 900);

    if (heartTapState.count === 5) {
        toggleLoveWeather(true);
    }
    if (heartTapState.count >= 10) {
        heartTapState.count = 0;
        triggerLoveBurst();
    }
}

function triggerLoveBurst() {
    createLoveBurst(36);
    showLoveSecretText("\u9690\u85cf\u5f69\u86cb\u89e6\u53d1\uff1a\u4eca\u5929\u7684\u559c\u6b22\u503c\u7206\u8868\u4e86 \u2665");
}

function createLoveBurst(count) {
    for (var i = 0; i < count; i++) {
        createFloatingHeart();
    }
}

function createFloatingHeart() {
    var heart = document.createElement("span");
    heart.className = "floating-heart";
    heart.textContent = Math.random() > 0.5 ? "\u2665" : "\u2661";
    heart.style.left = (45 + Math.random() * 10) + "vw";
    heart.style.top = (45 + Math.random() * 10) + "vh";
    heart.style.setProperty("--x", (Math.random() * 160 - 80) + "px");
    heart.style.setProperty("--y", (-80 - Math.random() * 160) + "px");
    heart.style.setProperty("--r", (Math.random() * 80 - 40) + "deg");
    document.body.appendChild(heart);
    setTimeout(function() {
        heart.remove();
    }, 1400);
}

function showLoveSecretText(message) {
    var old = document.querySelector(".love-secret-toast");
    if (old) old.remove();

    var toast = document.createElement("div");
    toast.className = "love-secret-toast";
    toast.textContent = message || "\u9690\u85cf\u5f69\u86cb\u89e6\u53d1\uff1a\u4eca\u5929\u7684\u559c\u6b22\u503c\u7206\u8868\u4e86 \u2665";
    document.body.appendChild(toast);

    if (window.gsap) {
        gsap.fromTo(
            toast,
            {y: 12, opacity: 0, scale: 0.96},
            {y: 0, opacity: 1, scale: 1, duration: 0.32, ease: "power2.out"}
        );
    }

    setTimeout(function() {
        if (window.gsap) {
            gsap.to(toast, {
                y: -8,
                opacity: 0,
                duration: 0.28,
                ease: "power2.in",
                onComplete: function() {
                    toast.remove();
                }
            });
        }
        else {
            toast.remove();
        }
    }, 2200);
}

function applySpecialLoveEffect(item) {
    var effect = item && item.effect;
    document.body.classList.remove("special-love-soft", "special-love-big-heart", "special-love-lucky", "special-love-memory", "special-love-anniversary", "special-love-snow");
    if (!effect) return;
    document.body.classList.add("special-love-" + effect);

    var key = (item.type || "weather") + ":" + (item.value || (item.month + "-" + item.day)) + ":" + effect;
    if (heartTapState.lastSpecialEffectKey === key) return;
    heartTapState.lastSpecialEffectKey = key;

    if (effect === "big-heart") {
        createLoveBurst(52);
        showLoveSecretText("\u4eca\u5929\u662f\u7279\u522b\u7684\u4e00\u5929\uff1a\u559c\u6b22\u503c\u6b63\u5728\u53d1\u5149 \u2665");
    }
    else if (effect === "lucky") {
        createLoveBurst(28);
        showLoveSecretText("\u604b\u7231\u8fd0\u52bf\uff1a\u8d85\u7ea7\u5927\u5409 \u2665");
    }
    else if (effect === "anniversary") {
        createLoveBurst(40);
        showLoveSecretText("\u5468\u5e74\u5feb\u4e50\uff0c\u6211\u4eec\u53c8\u4e00\u8d77\u8d70\u8fc7\u4e86\u4e00\u6574\u5e74 \u2665");
    }
}

var musicTracks = [
    {name: "Fly Me to the Moon", src: "src/music/flymetothemoon.mp3"},
    {name: "Just the 2 of Us", src: "src/music/justthe2ofus.mp3"},
    {name: "MyGO!!!!!", src: "src/music/mygo.mp3"},
    {name: "勾指起誓", src: "src/music/勾指起誓.mp3"}
];
var musicState = {
    index: 2,
    mode: "loop",
    listOpen: false,
    openTimer: null,
    closeTimer: null,
    audioContext: null,
    analyser: null,
    sourceNode: null,
    frequencyData: null,
    visualFrame: null,
    visualLevel: 0
};

function musicSrc(path) {
    return encodeURI(path);
}

function initMusicAnalyser(audio) {
    if (musicState.analyser) return;
    var AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    try {
        musicState.audioContext = new AudioContextClass();
        musicState.analyser = musicState.audioContext.createAnalyser();
        musicState.analyser.fftSize = 256;
        musicState.analyser.smoothingTimeConstant = 0.78;
        musicState.frequencyData = new Uint8Array(musicState.analyser.frequencyBinCount);
        if (audio.captureStream || audio.mozCaptureStream) {
            var stream = (audio.captureStream || audio.mozCaptureStream).call(audio);
            musicState.sourceNode = musicState.audioContext.createMediaStreamSource(stream);
        }
        else {
            musicState.analyser = null;
            return;
        }
        musicState.sourceNode.connect(musicState.analyser);
    } catch(e) {
        musicState.analyser = null;
    }
}

function setMusicBackground(level) {
    var root = document.body;
    root.style.setProperty("--music-pulse", level.toFixed(3));
    root.style.setProperty("--music-brightness", (1 + level * 0.08).toFixed(3));
    root.style.setProperty("--music-saturation", (1 + level * 0.18).toFixed(3));
    root.style.setProperty("--music-bg-shift", (level * 9).toFixed(2) + "vmax");
}

function startMusicVisuals(audio) {
    initMusicAnalyser(audio);
    if (musicState.audioContext && musicState.audioContext.state === "suspended") {
        musicState.audioContext.resume();
    }
    if (musicState.visualFrame) return;
    var tick = function() {
        var target = 0;
        if (musicState.analyser && musicState.frequencyData && !audio.paused) {
            musicState.analyser.getByteFrequencyData(musicState.frequencyData);
            var bass = 0;
            var mids = 0;
            for (var i = 1; i < 14; i++) bass += musicState.frequencyData[i];
            for (var j = 14; j < 46; j++) mids += musicState.frequencyData[j];
            bass = bass / 13 / 255;
            mids = mids / 32 / 255;
            target = Math.min(1, bass * 0.72 + mids * 0.28);
        }
        else if (!audio.paused) {
            target = 0.14 + Math.sin(Date.now() / 180) * 0.04;
        }
        musicState.visualLevel += (target - musicState.visualLevel) * 0.12;
        setMusicBackground(musicState.visualLevel);
        if (!audio.paused || musicState.visualLevel > 0.01) {
            musicState.visualFrame = requestAnimationFrame(tick);
        }
        else {
            musicState.visualFrame = null;
            setMusicBackground(0);
        }
    };
    musicState.visualFrame = requestAnimationFrame(tick);
}

function initMiniPlayer() {
    var player = document.getElementById("miniPlayer");
    var audio = document.getElementById("music");
    var toggle = document.getElementById("playerToggle");
    var playPause = document.getElementById("playPauseBtn");
    var nextBtn = document.getElementById("nextTrackBtn");
    var modeBtn = document.getElementById("playModeBtn");
    var listBtn = document.getElementById("playlistBtn");
    var volumeSlider = document.getElementById("volumeSlider");
    var volumeIcon = document.getElementById("volumeIcon");
    var popover = document.getElementById("playlistPopover");
    if (!player || !audio || !toggle || !playPause || !nextBtn || !modeBtn || !listBtn || !volumeSlider || !volumeIcon || !popover) return;

    audio.removeAttribute("controls");
    audio.src = musicSrc(musicTracks[musicState.index].src);
    audio.preload = "metadata";
    audio.volume = Number(volumeSlider.value);

    var openPlayer = function() {
        clearTimeout(musicState.closeTimer);
        if (player.classList.contains("is-open")) return;
        player.classList.remove("is-droplet");
        void player.offsetWidth;
        player.classList.add("is-droplet");
        setTimeout(function() {
            player.classList.remove("is-droplet");
        }, 460);
        player.classList.add("is-open");
        if (window.gsap) {
            gsap.killTweensOf(player);
            gsap.fromTo(player, {opacity: 0.78}, {opacity: 0.96, duration: 0.22, ease: "power2.out"});
            gsap.fromTo(".music-strip", {x: 18, opacity: 0, filter: "blur(5px)"}, {x: 0, opacity: 1, filter: "blur(0px)", duration: 0.28, delay: 0.04, ease: "power2.out"});
        }
    };

    var scheduleOpen = function() {
        clearTimeout(musicState.closeTimer);
        clearTimeout(musicState.openTimer);
        musicState.openTimer = setTimeout(openPlayer, 60);
    };

    var closePlayer = function() {
        clearTimeout(musicState.openTimer);
        clearTimeout(musicState.closeTimer);
        if (musicState.listOpen) return;
        player.classList.remove("is-droplet");
        player.classList.remove("is-open");
        if (window.gsap) {
            gsap.killTweensOf(player);
            gsap.set(player, {opacity: 0.72});
        }
    };

    var scheduleClose = function() {
        clearTimeout(musicState.openTimer);
        clearTimeout(musicState.closeTimer);
        closePlayer();
    };

    var closeList = function() {
        musicState.listOpen = false;
        player.classList.remove("list-open");
        if (window.gsap) {
            gsap.to(popover, {opacity: 0, y: 8, scale: 0.98, duration: 0.18, ease: "power2.in"});
        }
    };

    var refresh = function() {
        var track = musicTracks[musicState.index];
        document.getElementById("trackName").textContent = track.name;
        playPause.textContent = audio.paused ? "▶" : "Ⅱ";
        toggle.querySelector(".orb-icon").textContent = audio.paused ? "♪" : "Ⅱ";
        modeBtn.textContent = musicState.mode === "loop" ? "↻" : "⤨";
        volumeIcon.textContent = audio.volume <= 0.01 ? "○" : (audio.volume < 0.5 ? "◔" : "◕");
        player.classList.toggle("is-playing", !audio.paused);
        var items = popover.querySelectorAll("button");
        for (var i = 0; i < items.length; i++) {
            items[i].classList.toggle("is-active", i === musicState.index);
        }
    };

    var playCurrent = function() {
        startMusicVisuals(audio);
        var p = audio.play();
        if (p && p.catch) p.catch(function(){});
        refresh();
        if (window.gsap) {
            gsap.fromTo(".orb-icon", {scale: 0.92}, {scale: 1, duration: 0.18, ease: "power2.out"});
        }
    };

    var setTrack = function(index, shouldPlay) {
        musicState.index = index;
        audio.src = musicSrc(musicTracks[musicState.index].src);
        audio.load();
        refresh();
        if (shouldPlay) playCurrent();
    };

    var togglePlay = function() {
        if (audio.paused) {
            playCurrent();
        }
        else {
            audio.pause();
            startMusicVisuals(audio);
            refresh();
        }
    };

    var nextTrack = function() {
        if (musicState.mode === "random") {
            var next = musicState.index;
            while (musicTracks.length > 1 && next === musicState.index) {
                next = Math.floor(Math.random() * musicTracks.length);
            }
            setTrack(next, true);
        }
        else {
            setTrack((musicState.index + 1) % musicTracks.length, true);
        }
        if (window.gsap) {
            gsap.fromTo(nextBtn, {x: -3, opacity: 0.75}, {x: 0, opacity: 1, duration: 0.2, ease: "power2.out"});
        }
    };

    for (var i = 0; i < musicTracks.length; i++) {
        (function(index) {
            var item = document.createElement("button");
            item.type = "button";
            item.textContent = musicTracks[index].name;
            item.addEventListener("click", function(e) {
                e.stopPropagation();
                setTrack(index, true);
                closeList();
            });
            popover.appendChild(item);
        })(i);
    }

    toggle.addEventListener("click", togglePlay);
    toggle.addEventListener("pointerenter", scheduleOpen);
    toggle.addEventListener("pointerenter", function() {
        if (window.gsap) {
            gsap.to(".orb-icon", {scale: 1.08, duration: 0.18, ease: "power2.out", transformOrigin: "50% 50%"});
        }
    });
    toggle.addEventListener("pointerleave", function() {
        if (window.gsap) {
            gsap.to(".orb-icon", {scale: 1, duration: 0.22, ease: "power2.out", transformOrigin: "50% 50%"});
        }
    });
    playPause.addEventListener("click", togglePlay);
    nextBtn.addEventListener("click", nextTrack);
    modeBtn.addEventListener("click", function() {
        musicState.mode = musicState.mode === "loop" ? "random" : "loop";
        refresh();
        if (window.gsap) {
            gsap.fromTo(modeBtn, {opacity: 0.68}, {opacity: 1, duration: 0.18, ease: "power2.out"});
        }
    });
    listBtn.addEventListener("click", function(e) {
        e.stopPropagation();
        musicState.listOpen = !musicState.listOpen;
        player.classList.add("is-open");
        player.classList.toggle("list-open", musicState.listOpen);
        if (window.gsap) {
            gsap.fromTo(
                popover,
                {opacity: musicState.listOpen ? 0 : 1, y: musicState.listOpen ? 8 : 0, scale: musicState.listOpen ? 0.98 : 1},
                {opacity: musicState.listOpen ? 1 : 0, y: musicState.listOpen ? 0 : 8, scale: musicState.listOpen ? 1 : 0.98, duration: 0.28, ease: "power3.out"}
            );
        }
    });
    volumeSlider.addEventListener("input", function() {
        audio.volume = Number(volumeSlider.value);
        refresh();
    });
    player.addEventListener("mouseenter", function() {
        scheduleOpen();
    });
    player.addEventListener("mouseleave", function() {
        scheduleClose();
    });
    document.addEventListener("click", function(e) {
        if (!player.contains(e.target)) {
            closeList();
            closePlayer();
        }
    });
    audio.addEventListener("play", function() {
        startMusicVisuals(audio);
        refresh();
    });
    audio.addEventListener("pause", function() {
        startMusicVisuals(audio);
        refresh();
    });
    audio.addEventListener("ended", function() {
        nextTrack();
    });

    window.miniPlayerControls = {
        togglePlay: togglePlay,
        play: playCurrent,
        pause: function() {
            audio.pause();
            startMusicVisuals(audio);
            refresh();
        },
        refresh: refresh,
        next: nextTrack,
        setTrack: setTrack
    };

    refresh();
    startMusicVisuals(audio);
    var autoplay = audio.play();
    if (autoplay && autoplay.catch) {
        autoplay.catch(function() {
            refresh();
        });
    }
}

var Vector3 = {};
var Matrix44 = {};
Vector3.create = function(x, y, z) {
    return {'x':x, 'y':y, 'z':z};
};
Vector3.dot = function (v0, v1) {
    return v0.x * v1.x + v0.y * v1.y + v0.z * v1.z;
};
Vector3.cross = function (v, v0, v1) {
    v.x = v0.y * v1.z - v0.z * v1.y;
    v.y = v0.z * v1.x - v0.x * v1.z;
    v.z = v0.x * v1.y - v0.y * v1.x;
};
Vector3.normalize = function (v) {
    var l = v.x * v.x + v.y * v.y + v.z * v.z;
    if(l > 0.00001) {
        l = 1.0 / Math.sqrt(l);
        v.x *= l;
        v.y *= l;
        v.z *= l;
    }
};
Vector3.arrayForm = function(v) {
    if(v.array) {
        v.array[0] = v.x;
        v.array[1] = v.y;
        v.array[2] = v.z;
    }
    else {
        v.array = new Float32Array([v.x, v.y, v.z]);
    }
    return v.array;
};
Matrix44.createIdentity = function () {
    return new Float32Array([1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0]);
};
Matrix44.loadProjection = function (m, aspect, vdeg, near, far) {
    var h = near * Math.tan(vdeg * Math.PI / 180.0 * 0.5) * 2.0;
    var w = h * aspect;
    
    m[0] = 2.0 * near / w;
    m[1] = 0.0;
    m[2] = 0.0;
    m[3] = 0.0;
    
    m[4] = 0.0;
    m[5] = 2.0 * near / h;
    m[6] = 0.0;
    m[7] = 0.0;
    
    m[8] = 0.0;
    m[9] = 0.0;
    m[10] = -(far + near) / (far - near);
    m[11] = -1.0;
    
    m[12] = 0.0;
    m[13] = 0.0;
    m[14] = -2.0 * far * near / (far - near);
    m[15] = 0.0;
};
Matrix44.loadLookAt = function (m, vpos, vlook, vup) {
    var frontv = Vector3.create(vpos.x - vlook.x, vpos.y - vlook.y, vpos.z - vlook.z);
    Vector3.normalize(frontv);
    var sidev = Vector3.create(1.0, 0.0, 0.0);
    Vector3.cross(sidev, vup, frontv);
    Vector3.normalize(sidev);
    var topv = Vector3.create(1.0, 0.0, 0.0);
    Vector3.cross(topv, frontv, sidev);
    Vector3.normalize(topv);
    
    m[0] = sidev.x;
    m[1] = topv.x;
    m[2] = frontv.x;
    m[3] = 0.0;
    
    m[4] = sidev.y;
    m[5] = topv.y;
    m[6] = frontv.y;
    m[7] = 0.0;
    
    m[8] = sidev.z;
    m[9] = topv.z;
    m[10] = frontv.z;
    m[11] = 0.0;
    
    m[12] = -(vpos.x * m[0] + vpos.y * m[4] + vpos.z * m[8]);
    m[13] = -(vpos.x * m[1] + vpos.y * m[5] + vpos.z * m[9]);
    m[14] = -(vpos.x * m[2] + vpos.y * m[6] + vpos.z * m[10]);
    m[15] = 1.0;
};

//
var timeInfo = {
    'start':0, 'prev':0, // Date
    'delta':0, 'elapsed':0 // Number(sec)
};

//
var gl;
function createRenderSpec() {
    var spec = {
        'width':0,
        'height':0,
        'aspect':1,
        'array':new Float32Array(3),
        'halfWidth':0,
        'halfHeight':0,
        'halfArray':new Float32Array(3)
        // and some render targets. see setViewport()
    };
    spec.setSize = function(w, h) {
        spec.width = w;
        spec.height = h;
        spec.aspect = spec.width / spec.height;
        spec.array[0] = spec.width;
        spec.array[1] = spec.height;
        spec.array[2] = spec.aspect;
        
        spec.halfWidth = Math.floor(w / 2);
        spec.halfHeight = Math.floor(h / 2);
        spec.halfArray[0] = spec.halfWidth;
        spec.halfArray[1] = spec.halfHeight;
        spec.halfArray[2] = spec.halfWidth / spec.halfHeight;
    };
    return spec;
}
var renderSpec = createRenderSpec();

function deleteRenderTarget(rt) {
    gl.deleteFramebuffer(rt.frameBuffer);
    gl.deleteRenderbuffer(rt.renderBuffer);
    gl.deleteTexture(rt.texture);
}

function createRenderTarget(w, h) {
    var ret = {
        'width':w,
        'height':h,
        'sizeArray':new Float32Array([w, h, w / h]),
        'dtxArray':new Float32Array([1.0 / w, 1.0 / h])
    };
    ret.frameBuffer = gl.createFramebuffer();
    ret.renderBuffer = gl.createRenderbuffer();
    ret.texture = gl.createTexture();
    
    gl.bindTexture(gl.TEXTURE_2D, ret.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    
    gl.bindFramebuffer(gl.FRAMEBUFFER, ret.frameBuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, ret.texture, 0);
    
    gl.bindRenderbuffer(gl.RENDERBUFFER, ret.renderBuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, w, h);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, ret.renderBuffer);
    
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    
    return ret;
}

function compileShader(shtype, shsrc) {
	var retsh = gl.createShader(shtype);
	
	gl.shaderSource(retsh, shsrc);
	gl.compileShader(retsh);
	
	if(!gl.getShaderParameter(retsh, gl.COMPILE_STATUS)) {
		var errlog = gl.getShaderInfoLog(retsh);
		gl.deleteShader(retsh);
		console.error(errlog);
		return null;
	}
	return retsh;
}

function createShader(vtxsrc, frgsrc, uniformlist, attrlist) {
    var vsh = compileShader(gl.VERTEX_SHADER, vtxsrc);
    var fsh = compileShader(gl.FRAGMENT_SHADER, frgsrc);
    
    if(vsh == null || fsh == null) {
        return null;
    }
    
    var prog = gl.createProgram();
    gl.attachShader(prog, vsh);
    gl.attachShader(prog, fsh);
    
    gl.deleteShader(vsh);
    gl.deleteShader(fsh);
    
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        var errlog = gl.getProgramInfoLog(prog);
        console.error(errlog);
        return null;
    }
    
    if(uniformlist) {
        prog.uniforms = {};
        for(var i = 0; i < uniformlist.length; i++) {
            prog.uniforms[uniformlist[i]] = gl.getUniformLocation(prog, uniformlist[i]);
        }
    }
    
    if(attrlist) {
        prog.attributes = {};
        for(var i = 0; i < attrlist.length; i++) {
            var attr = attrlist[i];
            prog.attributes[attr] = gl.getAttribLocation(prog, attr);
        }
    }
    
    return prog;
}

function useShader(prog) {
    gl.useProgram(prog);
    for(var attr in prog.attributes) {
        gl.enableVertexAttribArray(prog.attributes[attr]);;
    }
}

function unuseShader(prog) {
    for(var attr in prog.attributes) {
        gl.disableVertexAttribArray(prog.attributes[attr]);;
    }
    gl.useProgram(null);
}

/////
var projection = {
    'angle':60,
    'nearfar':new Float32Array([0.1, 100.0]),
    'matrix':Matrix44.createIdentity()
};
var camera = {
    'position':Vector3.create(0, 0, 100),
    'lookat':Vector3.create(0, 0, 0),
    'up':Vector3.create(0, 1, 0),
    'dof':Vector3.create(10.0, 4.0, 8.0),
    'matrix':Matrix44.createIdentity()
};

var pointFlower = {};
var meshFlower = {};
var sceneStandBy = false;
var sakuraLayers = [];

function createProjection() {
    return {
        'angle':60,
        'nearfar':new Float32Array([0.1, 100.0]),
        'matrix':Matrix44.createIdentity()
    };
}

function createCamera() {
    return {
        'position':Vector3.create(0, 0, 100),
        'lookat':Vector3.create(0, 0, 0),
        'up':Vector3.create(0, 1, 0),
        'dof':Vector3.create(10.0, 4.0, 8.0),
        'matrix':Matrix44.createIdentity()
    };
}

function activateSakuraLayer(layer) {
    gl = layer.gl;
    renderSpec = layer.renderSpec;
    projection = layer.projection;
    camera = layer.camera;
    pointFlower = layer.pointFlower;
    effectLib = layer.effectLib;
    sceneStandBy = layer.sceneStandBy;
}

function saveSakuraLayer(layer) {
    layer.sceneStandBy = sceneStandBy;
}

var BlossomParticle = function () {
    this.velocity = new Array(3);
    this.rotation = new Array(3);
    this.position = new Array(3);
    this.euler = new Array(3);
    this.size = 1.0;
    this.alpha = 1.0;
    this.zkey = 0.0;
};

BlossomParticle.prototype.setVelocity = function (vx, vy, vz) {
    this.velocity[0] = vx;
    this.velocity[1] = vy;
    this.velocity[2] = vz;
};

BlossomParticle.prototype.setRotation = function (rx, ry, rz) {
    this.rotation[0] = rx;
    this.rotation[1] = ry;
    this.rotation[2] = rz;
};

BlossomParticle.prototype.setPosition = function (nx, ny, nz) {
    this.position[0] = nx;
    this.position[1] = ny;
    this.position[2] = nz;
};

BlossomParticle.prototype.setEulerAngles = function (rx, ry, rz) {
    this.euler[0] = rx;
    this.euler[1] = ry;
    this.euler[2] = rz;
};

BlossomParticle.prototype.setSize = function (s) {
    this.size = s;
};

BlossomParticle.prototype.update = function (dt, et) {
    this.position[0] += this.velocity[0] * dt;
    this.position[1] += this.velocity[1] * dt;
    this.position[2] += this.velocity[2] * dt;
    
    this.euler[0] += this.rotation[0] * dt;
    this.euler[1] += this.rotation[1] * dt;
    this.euler[2] += this.rotation[2] * dt;
};

function createPointFlowers() {
    // get point sizes
    var prm = gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE);
    renderSpec.pointSize = {'min':prm[0], 'max':prm[1]};
    
    var vtxsrc = document.getElementById("sakura_point_vsh").textContent;
    var frgsrc = document.getElementById("sakura_point_fsh").textContent;
    
    pointFlower.program = createShader(
        vtxsrc, frgsrc,
        ['uProjection', 'uModelview', 'uResolution', 'uOffset', 'uDOF', 'uFade'],
        ['aPosition', 'aEuler', 'aMisc']
    );
    
    useShader(pointFlower.program);
    pointFlower.offset = new Float32Array([0.0, 0.0, 0.0]);
    pointFlower.fader = Vector3.create(0.0, 10.0, 0.0);
    
    // Mobile Safari renders high-DPR WebGL petals brighter and denser; use a
    // separate density profile so the visual weight matches desktop.
    var mobileSakura = window.innerWidth <= 720 || window.matchMedia("(pointer: coarse)").matches;
    pointFlower.numFlowers = pointFlower.layerRole === 'front'
        ? (mobileSakura ? 260 : 520)
        : (mobileSakura ? 850 : 1600);
    if (pointFlower.layerRole === 'front') {
        pointFlower.depthMin = 7.0;
        pointFlower.depthMax = 18.0;
        pointFlower.sizeMin = 0.95;
        pointFlower.sizeMax = 1.18;
    }
    else {
        pointFlower.depthMin = -20.0;
        pointFlower.depthMax = 3.0;
        pointFlower.sizeMin = 0.82;
        pointFlower.sizeMax = 1.0;
    }
    pointFlower.particles = new Array(pointFlower.numFlowers);
    // vertex attributes {position[3], euler_xyz[3], size[1]}
    pointFlower.dataArray = new Float32Array(pointFlower.numFlowers * (3 + 3 + 2));
    pointFlower.positionArrayOffset = 0;
    pointFlower.eulerArrayOffset = pointFlower.numFlowers * 3;
    pointFlower.miscArrayOffset = pointFlower.numFlowers * 6;
    
    pointFlower.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pointFlower.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, pointFlower.dataArray, gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    
    unuseShader(pointFlower.program);
    
    for(var i = 0; i < pointFlower.numFlowers; i++) {
        pointFlower.particles[i] = new BlossomParticle();
    }
}

function initPointFlowers() {
    //area
    pointFlower.area = Vector3.create(20.0, 20.0, 20.0);
    pointFlower.area.x = pointFlower.area.y * renderSpec.aspect;
    
    pointFlower.fader.x = 10.0; //env fade start
    pointFlower.fader.y = pointFlower.area.z; //env fade half
    pointFlower.fader.z = 0.1;  //near fade start
    
    //particles
    var PI2 = Math.PI * 2.0;
    var tmpv3 = Vector3.create(0, 0, 0);
    var tmpv = 0;
    var symmetryrand = function() {return (Math.random() * 2.0 - 1.0);};
    for(var i = 0; i < pointFlower.numFlowers; i++) {
        var tmpprtcl = pointFlower.particles[i];
        
        //velocity
        tmpv3.x = symmetryrand() * 0.3 + 0.8;
        tmpv3.y = symmetryrand() * 0.2 - 1.0;
        tmpv3.z = symmetryrand() * 0.3 + 0.5;
        Vector3.normalize(tmpv3);
        tmpv = 2.0 + Math.random() * 1.0;
        tmpprtcl.setVelocity(tmpv3.x * tmpv, tmpv3.y * tmpv, tmpv3.z * tmpv);
        
        //rotation
        tmpprtcl.setRotation(
            symmetryrand() * PI2 * 0.5,
            symmetryrand() * PI2 * 0.5,
            symmetryrand() * PI2 * 0.5
        );
        
        //position
        tmpprtcl.setPosition(
            symmetryrand() * pointFlower.area.x,
            symmetryrand() * pointFlower.area.y,
            pointFlower.depthMin + Math.random() * (pointFlower.depthMax - pointFlower.depthMin)
        );
        
        //euler
        tmpprtcl.setEulerAngles(
            Math.random() * Math.PI * 2.0,
            Math.random() * Math.PI * 2.0,
            Math.random() * Math.PI * 2.0
        );
        
        //size
        tmpprtcl.setSize(pointFlower.sizeMin + Math.random() * (pointFlower.sizeMax - pointFlower.sizeMin));
    }
}

function renderPointFlowers() {
    //update
    var PI2 = Math.PI * 2.0;
    var limit = [pointFlower.area.x, pointFlower.area.y, pointFlower.area.z];
    var repeatPos = function (prt, cmp, limit) {
        if(Math.abs(prt.position[cmp]) - prt.size * 0.5 > limit) {
            //out of area
            if(prt.position[cmp] > 0) {
                prt.position[cmp] -= limit * 2.0;
            }
            else {
                prt.position[cmp] += limit * 2.0;
            }
        }
    };
    var repeatDepth = function (prt) {
        if(prt.position[2] > pointFlower.depthMax) {
            prt.position[2] -= pointFlower.depthMax - pointFlower.depthMin;
        }
        else if(prt.position[2] < pointFlower.depthMin) {
            prt.position[2] += pointFlower.depthMax - pointFlower.depthMin;
        }
    };
    var repeatEuler = function (prt, cmp) {
        prt.euler[cmp] = prt.euler[cmp] % PI2;
        if(prt.euler[cmp] < 0.0) {
            prt.euler[cmp] += PI2;
        }
    };
    
    for(var i = 0; i < pointFlower.numFlowers; i++) {
        var prtcl = pointFlower.particles[i];
        prtcl.update(timeInfo.delta, timeInfo.elapsed);
        repeatPos(prtcl, 0, pointFlower.area.x);
        repeatPos(prtcl, 1, pointFlower.area.y);
        repeatDepth(prtcl);
        repeatEuler(prtcl, 0);
        repeatEuler(prtcl, 1);
        repeatEuler(prtcl, 2);
        
        prtcl.alpha = 1.0;//(pointFlower.area.z - prtcl.position[2]) * 0.5;
        
        prtcl.zkey = (camera.matrix[2] * prtcl.position[0]
                    + camera.matrix[6] * prtcl.position[1]
                    + camera.matrix[10] * prtcl.position[2]
                    + camera.matrix[14]);
    }
    
    // sort
    pointFlower.particles.sort(function(p0, p1){return p0.zkey - p1.zkey;});
    
    // update data
    var ipos = pointFlower.positionArrayOffset;
    var ieuler = pointFlower.eulerArrayOffset;
    var imisc = pointFlower.miscArrayOffset;
    for(var i = 0; i < pointFlower.numFlowers; i++) {
        var prtcl = pointFlower.particles[i];
        pointFlower.dataArray[ipos] = prtcl.position[0];
        pointFlower.dataArray[ipos + 1] = prtcl.position[1];
        pointFlower.dataArray[ipos + 2] = prtcl.position[2];
        ipos += 3;
        pointFlower.dataArray[ieuler] = prtcl.euler[0];
        pointFlower.dataArray[ieuler + 1] = prtcl.euler[1];
        pointFlower.dataArray[ieuler + 2] = prtcl.euler[2];
        ieuler += 3;
        pointFlower.dataArray[imisc] = prtcl.size;
        pointFlower.dataArray[imisc + 1] = prtcl.alpha;
        imisc += 2;
    }
    
    //draw
    gl.enable(gl.BLEND);
    //gl.disable(gl.DEPTH_TEST);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    
    var prog = pointFlower.program;
    useShader(prog);
    
    gl.uniformMatrix4fv(prog.uniforms.uProjection, false, projection.matrix);
    gl.uniformMatrix4fv(prog.uniforms.uModelview, false, camera.matrix);
    gl.uniform3fv(prog.uniforms.uResolution, renderSpec.array);
    gl.uniform3fv(prog.uniforms.uDOF, Vector3.arrayForm(camera.dof));
    gl.uniform3fv(prog.uniforms.uFade, Vector3.arrayForm(pointFlower.fader));
    
    gl.bindBuffer(gl.ARRAY_BUFFER, pointFlower.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, pointFlower.dataArray, gl.DYNAMIC_DRAW);
    
    gl.vertexAttribPointer(prog.attributes.aPosition, 3, gl.FLOAT, false, 0, pointFlower.positionArrayOffset * Float32Array.BYTES_PER_ELEMENT);
    gl.vertexAttribPointer(prog.attributes.aEuler, 3, gl.FLOAT, false, 0, pointFlower.eulerArrayOffset * Float32Array.BYTES_PER_ELEMENT);
    gl.vertexAttribPointer(prog.attributes.aMisc, 2, gl.FLOAT, false, 0, pointFlower.miscArrayOffset * Float32Array.BYTES_PER_ELEMENT);
    
    // Draw distant repeated tiles only on the background layer. The foreground
    // layer must stay near the viewer so its apparent size matches its z-order.
    var repeatTiles = pointFlower.layerRole === 'front' ? 1 : 2;
    for(var i = 1; i < repeatTiles; i++) {
        var zpos = i * -2.0;
        pointFlower.offset[0] = pointFlower.area.x * -1.0;
        pointFlower.offset[1] = pointFlower.area.y * -1.0;
        pointFlower.offset[2] = pointFlower.area.z * zpos;
        gl.uniform3fv(prog.uniforms.uOffset, pointFlower.offset);
        gl.drawArrays(gl.POINT, 0, pointFlower.numFlowers);
        
        pointFlower.offset[0] = pointFlower.area.x * -1.0;
        pointFlower.offset[1] = pointFlower.area.y *  1.0;
        pointFlower.offset[2] = pointFlower.area.z * zpos;
        gl.uniform3fv(prog.uniforms.uOffset, pointFlower.offset);
        gl.drawArrays(gl.POINT, 0, pointFlower.numFlowers);
        
        pointFlower.offset[0] = pointFlower.area.x *  1.0;
        pointFlower.offset[1] = pointFlower.area.y * -1.0;
        pointFlower.offset[2] = pointFlower.area.z * zpos;
        gl.uniform3fv(prog.uniforms.uOffset, pointFlower.offset);
        gl.drawArrays(gl.POINT, 0, pointFlower.numFlowers);
        
        pointFlower.offset[0] = pointFlower.area.x *  1.0;
        pointFlower.offset[1] = pointFlower.area.y *  1.0;
        pointFlower.offset[2] = pointFlower.area.z * zpos;
        gl.uniform3fv(prog.uniforms.uOffset, pointFlower.offset);
        gl.drawArrays(gl.POINT, 0, pointFlower.numFlowers);
    }
    
    //main
    pointFlower.offset[0] = 0.0;
    pointFlower.offset[1] = 0.0;
    pointFlower.offset[2] = 0.0;
    gl.uniform3fv(prog.uniforms.uOffset, pointFlower.offset);
    gl.drawArrays(gl.POINT, 0, pointFlower.numFlowers);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    unuseShader(prog);
    
    gl.enable(gl.DEPTH_TEST);
    gl.disable(gl.BLEND);
}

// effects
//common util
function createEffectProgram(vtxsrc, frgsrc, exunifs, exattrs) {
    var ret = {};
    var unifs = ['uResolution', 'uSrc', 'uDelta'];
    if(exunifs) {
        unifs = unifs.concat(exunifs);
    }
    var attrs = ['aPosition'];
    if(exattrs) {
        attrs = attrs.concat(exattrs);
    }
    
    ret.program = createShader(vtxsrc, frgsrc, unifs, attrs);
    useShader(ret.program);
    
    ret.dataArray = new Float32Array([
        -1.0, -1.0,
         1.0, -1.0,
        -1.0,  1.0,
         1.0,  1.0
    ]);
    ret.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, ret.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, ret.dataArray, gl.STATIC_DRAW);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    unuseShader(ret.program);
    
    return ret;
}

// basic usage
// useEffect(prog, srctex({'texture':texid, 'dtxArray':(f32)[dtx, dty]})); //basic initialize
// gl.uniform**(...); //additional uniforms
// drawEffect()
// unuseEffect(prog)
// TEXTURE0 makes src
function useEffect(fxobj, srctex) {
    var prog = fxobj.program;
    useShader(prog);
    gl.uniform3fv(prog.uniforms.uResolution, renderSpec.array);
    
    if(srctex != null) {
        gl.uniform2fv(prog.uniforms.uDelta, srctex.dtxArray);
        gl.uniform1i(prog.uniforms.uSrc, 0);
        
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, srctex.texture);
    }
}
function drawEffect(fxobj) {
    gl.bindBuffer(gl.ARRAY_BUFFER, fxobj.buffer);
    gl.vertexAttribPointer(fxobj.program.attributes.aPosition, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}
function unuseEffect(fxobj) {
    unuseShader(fxobj.program);
}

var effectLib = {};
function createEffectLib() {
    
    var vtxsrc, frgsrc;
    //common
    var cmnvtxsrc = document.getElementById("fx_common_vsh").textContent;
    
    //background
    frgsrc = document.getElementById("bg_fsh").textContent;
    effectLib.sceneBg = createEffectProgram(cmnvtxsrc, frgsrc, ['uTimes'], null);
    
    // make brightpixels buffer
    frgsrc = document.getElementById("fx_brightbuf_fsh").textContent;
    effectLib.mkBrightBuf = createEffectProgram(cmnvtxsrc, frgsrc, null, null);
    
    // direction blur
    frgsrc = document.getElementById("fx_dirblur_r4_fsh").textContent;
    effectLib.dirBlur = createEffectProgram(cmnvtxsrc, frgsrc, ['uBlurDir'], null);
    
    //final composite
    vtxsrc = document.getElementById("pp_final_vsh").textContent;
    frgsrc = document.getElementById("pp_final_fsh").textContent;
    effectLib.finalComp = createEffectProgram(vtxsrc, frgsrc, ['uBloom'], null);
}

// background
function createBackground() {
    //console.log("create background");
}
function initBackground() {
    //console.log("init background");
}
function renderBackground() {
    gl.disable(gl.DEPTH_TEST);
    
    useEffect(effectLib.sceneBg, null);
    gl.uniform2f(effectLib.sceneBg.program.uniforms.uTimes, timeInfo.elapsed, timeInfo.delta);
    drawEffect(effectLib.sceneBg);
    unuseEffect(effectLib.sceneBg);
    
    gl.enable(gl.DEPTH_TEST);
}

// post process
var postProcess = {};
function createPostProcess() {
    //console.log("create post process");
}
function initPostProcess() {
    //console.log("init post process");
}

function renderPostProcess() {
    gl.enable(gl.TEXTURE_2D);
    gl.disable(gl.DEPTH_TEST);
    var bindRT = function (rt, isclear) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, rt.frameBuffer);
        gl.viewport(0, 0, rt.width, rt.height);
        if(isclear) {
            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        }
    };
    
    //make bright buff
    bindRT(renderSpec.wHalfRT0, true);
    useEffect(effectLib.mkBrightBuf, renderSpec.mainRT);
    drawEffect(effectLib.mkBrightBuf);
    unuseEffect(effectLib.mkBrightBuf);
    
    // make bloom
    for(var i = 0; i < 2; i++) {
        var p = 1.5 + 1 * i;
        var s = 2.0 + 1 * i;
        bindRT(renderSpec.wHalfRT1, true);
        useEffect(effectLib.dirBlur, renderSpec.wHalfRT0);
        gl.uniform4f(effectLib.dirBlur.program.uniforms.uBlurDir, p, 0.0, s, 0.0);
        drawEffect(effectLib.dirBlur);
        unuseEffect(effectLib.dirBlur);
        
        bindRT(renderSpec.wHalfRT0, true);
        useEffect(effectLib.dirBlur, renderSpec.wHalfRT1);
        gl.uniform4f(effectLib.dirBlur.program.uniforms.uBlurDir, 0.0, p, 0.0, s);
        drawEffect(effectLib.dirBlur);
        unuseEffect(effectLib.dirBlur);
    }
    
    //display
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, renderSpec.width, renderSpec.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    useEffect(effectLib.finalComp, renderSpec.mainRT);
    gl.uniform1i(effectLib.finalComp.program.uniforms.uBloom, 1);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, renderSpec.wHalfRT0.texture);
    drawEffect(effectLib.finalComp);
    unuseEffect(effectLib.finalComp);
    
    gl.enable(gl.DEPTH_TEST);
}

/////
var SceneEnv = {};
function createScene() {
    createEffectLib();
    createBackground();
    createPointFlowers();
    createPostProcess();
    sceneStandBy = true;
}

function initScene() {
    initBackground();
    initPointFlowers();
    initPostProcess();
    
    //camera.position.z = 17.320508;
    camera.position.z = pointFlower.area.z + projection.nearfar[0];
    projection.angle = Math.atan2(pointFlower.area.y, camera.position.z + pointFlower.area.z) * 180.0 / Math.PI * 2.0;
    Matrix44.loadProjection(projection.matrix, renderSpec.aspect, projection.angle, projection.nearfar[0], projection.nearfar[1]);
}

function renderScene() {
    //draw
    Matrix44.loadLookAt(camera.matrix, camera.position, camera.lookat, camera.up);
    
    gl.enable(gl.DEPTH_TEST);
    
    //gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, renderSpec.mainRT.frameBuffer);
    gl.viewport(0, 0, renderSpec.mainRT.width, renderSpec.mainRT.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // renderBackground();  // skip opaque sky so HTML behind canvas shows through
    renderPointFlowers();
    renderPostProcess();
}

/////
function onResize(e) {
    for (var i = 0; i < sakuraLayers.length; i++) {
        var layer = sakuraLayers[i];
        activateSakuraLayer(layer);
        makeCanvasFullScreen(layer.canvas);
        setViewports();
        if(sceneStandBy) {
            initScene();
        }
        saveSakuraLayer(layer);
    }
}

function setViewports() {
    renderSpec.setSize(gl.canvas.width, gl.canvas.height);
    
    gl.clearColor(0, 0, 0, 0);
    gl.viewport(0, 0, renderSpec.width, renderSpec.height);
    
    var rtfunc = function (rtname, rtw, rth) {
        var rt = renderSpec[rtname];
        if(rt) deleteRenderTarget(rt);
        renderSpec[rtname] = createRenderTarget(rtw, rth);
    };
    rtfunc('mainRT', renderSpec.width, renderSpec.height);
    rtfunc('wFullRT0', renderSpec.width, renderSpec.height);
    rtfunc('wFullRT1', renderSpec.width, renderSpec.height);
    rtfunc('wHalfRT0', renderSpec.halfWidth, renderSpec.halfHeight);
    rtfunc('wHalfRT1', renderSpec.halfWidth, renderSpec.halfHeight);
}

function render() {
    for (var i = 0; i < sakuraLayers.length; i++) {
        var layer = sakuraLayers[i];
        activateSakuraLayer(layer);
        renderScene();
        saveSakuraLayer(layer);
    }
}

var animating = true;
function toggleAnimation(elm) {
    animating ^= true;
    if(animating) animate();
    if(elm) {
        elm.innerHTML = animating? "Stop":"Start";
    }
}

function stepAnimation() {
    if(!animating) animate();
}

function animate() {
    var curdate = new Date();
    timeInfo.elapsed = (curdate - timeInfo.start) / 1000.0;
    timeInfo.delta = (curdate - timeInfo.prev) / 1000.0;
    timeInfo.prev = curdate;
    if (!isFinite(timeInfo.delta) || timeInfo.delta < 0) {
        timeInfo.delta = 0;
    }
    timeInfo.delta = Math.min(timeInfo.delta, 1.0 / 30.0);
    
    if(animating) requestAnimationFrame(animate);
    render();
}

function makeCanvasFullScreen(canvas) {
    var mobileSakura = window.innerWidth <= 720 || window.matchMedia("(pointer: coarse)").matches;
    var dpr = Math.min(window.devicePixelRatio || 1, mobileSakura ? 1.75 : 2.5);
    var fullw = Math.max(1, Math.floor(window.innerWidth * dpr));
    var fullh = Math.max(1, Math.floor(window.innerHeight * dpr));
    canvas.width = fullw;
    canvas.height = fullh;
    canvas.style.position = "fixed";
    canvas.style.left = "0";
    canvas.style.top = "0";
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";
    canvas.style.zIndex = canvas.id === "sakura-front" ? "30" : "0";
    canvas.style.opacity = mobileSakura
        ? (canvas.id === "sakura-front" ? "0.68" : "0.82")
        : "1";
    canvas.style.pointerEvents = "none";
    canvas.style.display = "block";
}

function createSakuraLayer(canvas, role) {
    makeCanvasFullScreen(canvas);
    var layer = {
        canvas: canvas,
        role: role,
        gl: canvas.getContext('experimental-webgl', {
            alpha: true,
            premultipliedAlpha: false
        }),
        renderSpec: createRenderSpec(),
        projection: createProjection(),
        camera: createCamera(),
        pointFlower: {'layerRole': role},
        effectLib: {},
        sceneStandBy: false
    };
    if (!layer.gl) {
        throw new Error("WebGL not supported.");
    }
    activateSakuraLayer(layer);
    setViewports();
    createScene();
    initScene();
    saveSakuraLayer(layer);
    return layer;
}

window.addEventListener('load', function(e) {
    try {
        sakuraLayers = [
            createSakuraLayer(document.getElementById("sakura"), "back"),
            createSakuraLayer(document.getElementById("sakura-front"), "front")
        ];
    } catch(e) {
        alert("WebGL not supported." + e);
        console.error(e);
        return;
    }
    
    window.addEventListener('resize', onResize);

    timeInfo.start = new Date();
    timeInfo.prev = timeInfo.start;
    initUiMotion();
    initHeartInteractionGuards();
    initLoveWeather();
    initMiniPlayer();
    animate();
});

document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        timeInfo.prev = new Date();
    }
});

//set window.requestAnimationFrame
(function (w, r) {
    w['r'+r] = w['r'+r] || w['webkitR'+r] || w['mozR'+r] || w['msR'+r] || w['oR'+r] || function(c){ w.setTimeout(c, 1000 / 60); };
})(window, 'requestAnimationFrame');

//鼠标滑动
(function(window,document,undefined){
    var aaa;
    var hearts = [];
    window.requestAnimationFrame = (function(){
        return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback){
            setTimeout(callback,1000/60);
        }
    })();
    init();
    function init(){
        css(".heart{width: 1px;height: 1px;position: fixed;");
        attachEvent();
        
        gameloop();
    }
    function gameloop(){
        for(var i=0;i<hearts.length;i++){
            if(hearts[i].alpha <= 0){
                document.body.removeChild(hearts[i].el);
                hearts.splice(i,1);
                continue;
            }
            hearts[i].y++;
            hearts[i].x+=hearts[i].xx;
            hearts[i].scale -= 0.01;
            hearts[i].alpha -= 0.008;
            hearts[i].el.style.cssText = "left:"+hearts[i].x+"px;top:"+hearts[i].y+"px;opacity:"+hearts[i].alpha+";transform:scale("+hearts[i].scale+","+hearts[i].scale+") rotate(45deg);color:"+hearts[i].color;
        }
        requestAnimationFrame(gameloop);
        
    }
    function attachEvent(){
        var old = typeof window.onmousemove==="function" && window.onmousemove;
        window.onmousemove = function(event){
            old && old();
            createHeart(event);
        }
    }
    function createHeart(event){
        var d = document.createElement("samp");
        d.className = "heart";
        d.innerHTML = "*";
        hearts.push({
            el : d,
            x : event.clientX - 8,
            y : event.clientY - 13,
            xx : Math.pow(-1,(Math.round(Math.random()))) * Math.random(),
            scale : 1,
            alpha : 1,
            color : randomColor()
        });
        document.body.appendChild(d);
    }
    function css(css){
        var style = document.createElement("style");
        style.type="text/css";
        try{
            style.appendChild(document.createTextNode(css));
        }catch(ex){
            style.styleSheet.cssText = css;
        }
        document.getElementsByTagName('head')[0].appendChild(style);
    }
    function randomColor(){
        return "rgb("+(~~(Math.random()*255))+","+(~~(Math.random()*255))+","+(~~(Math.random()*255))+")";
    }
})(window,document);
        

//bgm
