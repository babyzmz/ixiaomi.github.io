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

function getSkinMode() {
    var body = document.body;
    if (body) {
        if (body.classList.contains("skin-doodle")) return "doodle";
        if (body.classList.contains("skin-classic")) return "classic";
        if (body.dataset && body.dataset.skin) return body.dataset.skin;
    }
    return /heart-doodle\.html/i.test(window.location.pathname) ? "doodle" : "classic";
}

function getSkinTargetMode() {
    return getSkinMode() === "doodle" ? "classic" : "doodle";
}

function getSkinTargetName(mode) {
    return (mode || getSkinTargetMode()) === "doodle" ? "\u624b\u8d26\u98ce" : "\u67d4\u5149\u98ce";
}

var skinTransitionLock = false;

function getDoodleStylesheet() {
    var link = document.getElementById("doodleSkinStylesheet");
    if (link) return link;

    var links = document.querySelectorAll('link[rel="stylesheet"]');
    for (var i = 0; i < links.length; i++) {
        if (/heart-doodle\.css/i.test(links[i].getAttribute("href") || "")) {
            links[i].id = "doodleSkinStylesheet";
            return links[i];
        }
    }
    return null;
}

function ensureDoodleStylesheet() {
    var link = getDoodleStylesheet();
    if (link) return link;

    link = document.createElement("link");
    link.id = "doodleSkinStylesheet";
    link.rel = "stylesheet";
    link.href = "./heart-doodle.css?v=20260530-18";
    link.media = "all";
    document.head.appendChild(link);
    return link;
}

function waitForDoodleStylesheet(link) {
    return new Promise(function(resolve) {
        if (!link || link.dataset.loaded === "true") {
            resolve();
            return;
        }

        try {
            if (link.sheet && link.sheet.cssRules) {
                link.dataset.loaded = "true";
                resolve();
                return;
            }
        } catch(e) {
            link.dataset.loaded = "true";
            resolve();
            return;
        }

        var done = function() {
            link.dataset.loaded = "true";
            resolve();
        };
        link.addEventListener("load", done, {once: true});
        link.addEventListener("error", done, {once: true});
        setTimeout(done, 420);
    });
}

function updateSkinSwitcherUi() {
    var switcher = document.getElementById("skinSwitcher");
    if (!switcher) return;

    var label = switcher.querySelector(".skin-switcher__label");
    var targetName = getSkinTargetName();
    if (label) label.textContent = targetName;
    switcher.setAttribute("aria-label", "\u5207\u6362\u5230" + targetName);
}

function applySkinMode(mode) {
    var body = document.body;
    var root = document.documentElement;
    var link = ensureDoodleStylesheet();
    var isDoodle = mode === "doodle";

    if (link) {
        link.disabled = false;
    }

    if (root) {
        root.classList.toggle("skin-doodle-root", isDoodle);
        root.classList.toggle("skin-classic-root", !isDoodle);
    }

    if (body) {
        body.classList.toggle("skin-doodle", isDoodle);
        body.classList.toggle("skin-classic", !isDoodle);
        body.dataset.skin = mode;
    }

    setDoodleBackdropVisible(isDoodle, true);
    updateSkinSwitcherUi();
}

function initSkinMode() {
    var body = document.body;
    if (!body) return;

    var initialMode = body.dataset.initialSkin || (/heart-doodle\.html/i.test(window.location.pathname) ? "doodle" : "classic");
    applySkinMode(initialMode === "doodle" ? "doodle" : "classic");
}

function captureSkinRects() {
    var selectors = [
        ".love-note",
        ".box",
        ".timer-panel",
        ".love-weather",
        ".music-player",
        ".skin-switcher"
    ];
    var entries = [];
    selectors.forEach(function(selector) {
        var elements = selector === "body" ? [document.body] : Array.prototype.slice.call(document.querySelectorAll(selector));
        elements.forEach(function(el) {
            if (!el) return;
            var rect = el.getBoundingClientRect();
            if (!rect.width || !rect.height) return;
            entries.push({
                el: el,
                selector: selector,
                rect: {
                    left: rect.left,
                    top: rect.top,
                    width: rect.width,
                    height: rect.height
                }
            });
        });
    });
    return entries;
}

function removeCloneIds(root) {
    if (!root || !root.querySelectorAll) return;
    if (root.removeAttribute) root.removeAttribute("id");
    Array.prototype.forEach.call(root.querySelectorAll("[id]"), function(el) {
        el.removeAttribute("id");
    });
}

function freezeElementStyles(source, clone) {
    if (!source || !clone || !window.getComputedStyle) return;

    var properties = [
        "display", "align-items", "justify-content", "gap",
        "box-sizing", "width", "height", "min-width", "min-height", "max-width", "max-height",
        "padding", "margin", "border", "border-color", "border-radius", "outline",
        "background", "background-color", "background-image", "background-size", "background-position",
        "box-shadow", "color", "font", "font-family", "font-size", "font-weight", "line-height",
        "letter-spacing", "text-align", "text-shadow", "white-space",
        "overflow", "overflow-x", "overflow-y",
        "opacity", "filter", "backdrop-filter", "-webkit-backdrop-filter",
        "fill", "stroke", "stroke-width"
    ];

    function freezeNode(src, dst) {
        if (!src || !dst || !dst.style) return;
        var styles = getComputedStyle(src);
        properties.forEach(function(prop) {
            var value = styles.getPropertyValue(prop);
            if (value) dst.style.setProperty(prop, value);
        });
    }

    freezeNode(source, clone);
    var sourceChildren = source.querySelectorAll ? source.querySelectorAll("*") : [];
    var cloneChildren = clone.querySelectorAll ? clone.querySelectorAll("*") : [];
    var count = Math.min(sourceChildren.length, cloneChildren.length);
    for (var i = 0; i < count; i++) {
        freezeNode(sourceChildren[i], cloneChildren[i]);
    }
}

function createSkinElementGhosts(entries) {
    if (!entries || !entries.length) return [];
    return entries.map(function(entry) {
        var rect = entry.rect;
        var clone = entry.el.cloneNode(true);
        removeCloneIds(clone);
        freezeElementStyles(entry.el, clone);
        clone.classList.add("skin-element-ghost");
        clone.setAttribute("aria-hidden", "true");
        clone.style.position = "fixed";
        clone.style.left = rect.left + "px";
        clone.style.top = rect.top + "px";
        clone.style.width = rect.width + "px";
        clone.style.height = rect.height + "px";
        clone.style.margin = "0";
        clone.style.transform = "none";
        clone.style.transformOrigin = "center center";
        clone.style.pointerEvents = "none";
        clone.style.zIndex = entry.selector === ".skin-switcher" ? "180" : "150";
        clone.style.willChange = "opacity, transform, filter";
        document.body.appendChild(clone);
        return {
            entry: entry,
            ghost: clone
        };
    });
}

function setFixedCloneRect(clone, rect, zIndex) {
    clone.style.position = "fixed";
    clone.style.left = rect.left + "px";
    clone.style.top = rect.top + "px";
    clone.style.width = rect.width + "px";
    clone.style.height = rect.height + "px";
    clone.style.margin = "0";
    clone.style.pointerEvents = "auto";
    clone.style.zIndex = zIndex;
    clone.style.visibility = "visible";
    clone.style.opacity = "1";
    clone.style.transform = "none";
    clone.style.transformOrigin = "center center";
    clone.style.backfaceVisibility = "hidden";
    clone.style.transformStyle = "preserve-3d";
    clone.style.willChange = "opacity, transform, filter";
}

function forwardSkinCloneClick(selector) {
    if (!selector || selector === ".skin-switcher") return;

    var target = null;
    if (selector === ".box") {
        target = document.querySelector(".box");
    }
    else if (selector === ".love-weather") {
        target = document.getElementById("weatherTab");
    }
    else if (selector === ".music-player") {
        target = document.getElementById("playerToggle");
    }
    else {
        target = document.querySelector(selector);
    }

    if (target && target.click) {
        target.click();
    }
}

function getSkinCloneZIndex(selector) {
    if (selector === ".skin-switcher") return "190";
    if (selector === ".music-player" || selector === ".love-weather") return "175";
    if (selector === ".box") return "170";
    return "165";
}

function createSkinFlipStage() {
    var oldStage = document.querySelector(".skin-flip-stage");
    if (oldStage) oldStage.remove();

    var stage = document.createElement("div");
    stage.className = "skin-flip-stage";
    stage.setAttribute("aria-hidden", "true");
    stage.addEventListener("click", function(e) {
        var clone = e.target && e.target.closest && e.target.closest(".skin-style-flip");
        if (!clone || !stage.contains(clone)) return;
        e.preventDefault();
        e.stopPropagation();
        forwardSkinCloneClick(clone.dataset.skinSelector);
    });
    document.body.appendChild(stage);
    return stage;
}

function createSkinFlipSources(entries, stage) {
    if (!entries || !entries.length) return [];
    var parent = stage || document.body;
    var fragment = document.createDocumentFragment();

    var sources = entries.map(function(entry) {
        var clone = entry.el.cloneNode(true);
        removeCloneIds(clone);
        freezeElementStyles(entry.el, clone);
        clone.classList.add("skin-style-flip", "skin-style-flip--from");
        clone.dataset.skinSelector = entry.selector;
        clone.setAttribute("aria-hidden", "true");
        setFixedCloneRect(clone, entry.rect, getSkinCloneZIndex(entry.selector));
        fragment.appendChild(clone);
        return {
            entry: entry,
            fromClone: clone
        };
    });

    parent.appendChild(fragment);
    return sources;
}

function createSkinFlipPairs(sources, stage) {
    if (!sources || !sources.length) return [];
    var parent = stage || document.body;
    var fragment = document.createDocumentFragment();

    var pairs = sources.map(function(item) {
        var entry = item.entry;
        var rect = entry.rect;
        var after = entry.el.getBoundingClientRect();

        if (!after.width || !after.height) {
            after = rect;
        }

        var targetRect = {
            left: after.left,
            top: after.top,
            width: after.width,
            height: after.height
        };
        var clone = entry.el.cloneNode(true);

        removeCloneIds(clone);
        clone.classList.add("skin-style-flip", "skin-style-flip--to");
        clone.dataset.skinSelector = entry.selector;
        clone.setAttribute("aria-hidden", "true");
        setFixedCloneRect(clone, targetRect, getSkinCloneZIndex(entry.selector));
        fragment.appendChild(clone);

        return {
            entry: entry,
            fromClone: item.fromClone,
            toClone: clone,
            before: rect,
            after: targetRect,
            dx: rect.left - targetRect.left,
            dy: rect.top - targetRect.top,
            scaleX: Math.max(0.62, Math.min(1.42, rect.width / targetRect.width)),
            scaleY: Math.max(0.62, Math.min(1.42, rect.height / targetRect.height))
        };
    });

    parent.appendChild(fragment);
    return pairs;
}

function cleanupSkinFlipPairs(pairs, stage) {
    if (stage) {
        stage.remove();
        return;
    }

    (pairs || []).forEach(function(pair) {
        if (pair.fromClone) pair.fromClone.remove();
        if (pair.toClone) pair.toClone.remove();
    });
}

function animateSkinFlipPairs(pairs) {
    if (!window.gsap || !pairs || !pairs.length) return null;

    var tl = gsap.timeline({
        defaults: {
            ease: "power3.inOut",
            overwrite: "auto"
        }
    });

    pairs.forEach(function(pair, index) {
        var entryDelay = (pair.entry.delay || 0) * 0.64;
        var delay = 0.18 + entryDelay + (Math.random() * 0.08);
        var flipDirection = index % 2 === 0 ? 1 : -1;

        gsap.set(pair.fromClone, {
            autoAlpha: 1,
            x: 0,
            y: 0,
            scaleX: 1,
            scaleY: 1,
            rotationY: 0,
            rotationX: 0,
            z: 0,
            filter: "blur(0px)",
            transformPerspective: 900,
            transformOrigin: "center center",
            force3D: true
        });
        gsap.set(pair.toClone, {
            autoAlpha: 0,
            x: pair.dx,
            y: pair.dy,
            scaleX: pair.scaleX,
            scaleY: pair.scaleY,
            rotationY: 72 * flipDirection,
            rotationX: -10 * flipDirection,
            z: -72,
            filter: "blur(14px)",
            transformPerspective: 900,
            transformOrigin: "center center",
            force3D: true
        });

        tl.to(pair.fromClone, {
            autoAlpha: 0,
            rotationY: -72 * flipDirection,
            rotationX: 8 * flipDirection,
            z: -84,
            scale: 0.975,
            filter: "blur(12px)",
            duration: 0.78
        }, delay);

        tl.to(pair.toClone, {
            autoAlpha: 1,
            x: 0,
            y: 0,
            scaleX: 1,
            scaleY: 1,
            rotationY: 0,
            rotationX: 0,
            z: 0,
            filter: "blur(0px)",
            duration: 1.28,
            ease: "expo.out"
        }, delay + 0.16);
    });

    return tl;
}

function animateSkinElementGhosts(ghosts) {
    if (!window.gsap || !ghosts || !ghosts.length) {
        (ghosts || []).forEach(function(item) {
            if (item.ghost) item.ghost.remove();
        });
        return;
    }

    ghosts.forEach(function(item) {
        var delay = (item.entry.delay || 0) + 0.18;
        gsap.to(item.ghost, {
            opacity: 0,
            x: Math.random() * 14 - 7,
            y: Math.random() * 10 - 5,
            scale: 0.988,
            filter: "blur(8px)",
            duration: 0.78,
            delay: delay,
            ease: "sine.inOut",
            onComplete: function() {
                item.ghost.remove();
            }
        });
    });
}

function shuffleSkinEntries(entries) {
    var copy = entries.slice();
    for (var i = copy.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = copy[i];
        copy[i] = copy[j];
        copy[j] = temp;
    }
    return copy;
}

function prepareSkinMorph(entries) {
    var order = shuffleSkinEntries(entries);
    order.forEach(function(entry, index) {
        var delay = Math.min(920, index * 52 + Math.random() * 140);
        entry.delay = delay / 1000;
        if (entry.el && entry.el.style) {
            entry.el.style.setProperty("--skin-delay", Math.round(delay) + "ms");
        }
    });
    return order;
}

function cleanupSkinMorph(entries) {
    entries.forEach(function(entry) {
        if (!entry.el || !entry.el.style) return;
        entry.el.style.removeProperty("--skin-delay");
    });
}

function decorateSkinBackgroundLayer(layer, mode, options) {
    if (!layer || mode !== "doodle") return;
    options = options || {};

    var doodles = document.createElement("span");
    var symbols = [
        "\u2661", "\u2606", "\u2601", "\u273F", "\u266A", ":3", "+520", "memo",
        "xoxo", "candy", "\u8d34\u8d34", "\u7cd6", "\u559c\u6b22", "\u2726", "\u2606",
        "\u2665", "\u82b1\u82b1", "wow", "\u2661", "\u2601", "\u273F", "\u266A"
    ];
    doodles.className = "skin-background-morph__doodles";
    symbols.forEach(function(symbol, index) {
        var piece = document.createElement("i");
        piece.className = "skin-background-morph__piece";
        piece.textContent = symbol;
        piece.style.left = (4 + ((index * 19) % 88)) + "%";
        piece.style.top = (12 + ((index * 31) % 72)) + "%";
        piece.style.setProperty("--skin-piece-tilt", ((index % 7) - 3) * 3 + "deg");
        piece.style.setProperty("--skin-piece-size", (index % 5 === 0 ? "1.34" : index % 3 === 0 ? "1.12" : "1"));
        doodles.appendChild(piece);
    });
    layer.appendChild(doodles);

    if (options.skipBars) return;

    var topBar = document.createElement("span");
    topBar.className = "skin-background-morph__bar skin-background-morph__bar--top";
    topBar.textContent = "\u2661  \u2606  \u273F  \u2601  \u266A    \u8d34\u8d34  +520  candy  memo  \u559c\u6b22  \u2726    \u2661  \u2606  \u273F";

    var bottomBar = document.createElement("span");
    bottomBar.className = "skin-background-morph__bar skin-background-morph__bar--bottom";
    bottomBar.textContent = "\u2727  \u2661  \u82b1\u82b1  \u2601  \u751c\u5ea6 +99  \u266A  \u5c0f\u7eb8\u6761  \u273F  \u7cd6\u679c  \u2606  xoxo  \u2661     [ pastel memo ]";

    layer.appendChild(topBar);
    layer.appendChild(bottomBar);
}

function ensureDoodleBackdrop() {
    var layer = document.getElementById("doodleBackdrop");
    if (layer) return layer;

    layer = document.createElement("div");
    layer.id = "doodleBackdrop";
    layer.className = "doodle-backdrop skin-background-morph--doodle";
    layer.setAttribute("aria-hidden", "true");
    decorateSkinBackgroundLayer(layer, "doodle", {skipBars: true});
    document.body.appendChild(layer);
    return layer;
}

function setDoodleBackdropVisible(isVisible, immediate) {
    if (!document.body) return;

    var layer = ensureDoodleBackdrop();
    document.body.classList.toggle("has-doodle-backdrop", isVisible);

    if (!window.gsap || immediate) {
        layer.style.opacity = isVisible ? "1" : "0";
        layer.style.visibility = isVisible ? "visible" : "hidden";
        return;
    }

    gsap.to(layer, {
        autoAlpha: isVisible ? 1 : 0,
        duration: 0.36,
        ease: "sine.out",
        overwrite: "auto"
    });
}

function createSkinBackgroundMorph(mode, role) {
    var layer = document.createElement("div");
    layer.className = "skin-background-morph skin-background-morph--" + (mode === "doodle" ? "doodle" : "classic");
    if (role) layer.classList.add("skin-background-morph--" + role);

    layer.setAttribute("aria-hidden", "true");
    decorateSkinBackgroundLayer(layer, mode);
    document.body.appendChild(layer);
    return layer;
}

function syncDoodleTilesFromPage(layer) {
    if (!layer || !layer.classList.contains("skin-background-morph--doodle") || !window.getComputedStyle) return;

    var styles = getComputedStyle(document.body, "::after");
    if (styles.display === "none" || styles.content === "none") return;
    if (!styles || !styles.backgroundImage || styles.backgroundImage === "none") return;

    layer.classList.add("skin-background-morph--has-tiles");

    var field = document.createElement("span");
    field.className = "skin-background-morph__tile-field";
    field.style.backgroundImage = styles.backgroundImage;
    field.style.backgroundRepeat = styles.backgroundRepeat;
    field.style.backgroundSize = styles.backgroundSize;
    field.style.backgroundPosition = styles.backgroundPosition;
    field.style.opacity = styles.opacity || "0.62";
    field.style.top = styles.top || "92px";
    field.style.right = styles.right || "0px";
    field.style.bottom = styles.bottom || "62px";
    field.style.left = styles.left || "0px";
    layer.appendChild(field);

    var viewportWidth = Math.max(320, window.innerWidth || document.documentElement.clientWidth || 1280);
    var viewportHeight = Math.max(480, window.innerHeight || document.documentElement.clientHeight || 900);
    var cards = [
        [0.05, 0.14, 0.2, 0.16], [0.31, 0.1, 0.18, 0.18], [0.58, 0.12, 0.21, 0.16],
        [0.77, 0.26, 0.16, 0.22], [0.12, 0.36, 0.18, 0.22], [0.43, 0.34, 0.18, 0.18],
        [0.66, 0.46, 0.22, 0.18], [0.05, 0.62, 0.24, 0.18], [0.34, 0.66, 0.18, 0.18],
        [0.59, 0.68, 0.18, 0.18], [0.79, 0.7, 0.16, 0.14]
    ];

    cards.forEach(function(card, index) {
        var patch = document.createElement("span");
        patch.className = "skin-background-morph__tile-card";
        patch.style.backgroundImage = styles.backgroundImage;
        patch.style.backgroundRepeat = styles.backgroundRepeat;
        patch.style.backgroundSize = styles.backgroundSize;
        patch.style.backgroundPosition = styles.backgroundPosition;
        patch.style.left = Math.round(card[0] * viewportWidth) + "px";
        patch.style.top = Math.round(card[1] * viewportHeight) + "px";
        patch.style.width = Math.round(card[2] * viewportWidth) + "px";
        patch.style.height = Math.round(card[3] * viewportHeight) + "px";
        patch.style.setProperty("--skin-tile-tilt", ((index % 5) - 2) * 1.4 + "deg");
        layer.appendChild(patch);
    });
}

function clearSkinBackgroundMorphs() {
    Array.prototype.forEach.call(document.querySelectorAll(".skin-background-morph"), function(layer) {
        layer.remove();
    });
    document.body.classList.remove("is-skin-bg-crossfade");
}

function getTargetSakuraStyle(mode, isFront) {
    if (mode === "doodle") {
        return {
            opacity: isFront ? 0.62 : 0.48,
            filter: "saturate(0.95) contrast(1.25) sepia(0.16) drop-shadow(1px 1px 0 rgba(48, 34, 92, 0.26))",
            mixBlendMode: "multiply"
        };
    }

    return {
        opacity: 1,
        filter: "none",
        mixBlendMode: "normal"
    };
}

function freezeSakuraLayerStyles() {
    var layers = ["#sakura", "#sakura-front"].map(function(selector) {
        var el = document.querySelector(selector);
        if (!el || !window.getComputedStyle) return null;
        var styles = getComputedStyle(el);
        el.style.opacity = styles.opacity;
        el.style.filter = styles.filter;
        el.style.mixBlendMode = styles.mixBlendMode;
        el.style.transition = "none";
        return el;
    }).filter(Boolean);

    return layers;
}

function animateSakuraLayerStyles(layers, targetMode) {
    if (!window.gsap || !layers || !layers.length) return;

    layers.forEach(function(layer) {
        var target = getTargetSakuraStyle(targetMode, layer.id === "sakura-front");
        gsap.to(layer, {
            opacity: target.opacity,
            filter: target.filter,
            mixBlendMode: target.mixBlendMode,
            duration: 1.6,
            ease: "sine.inOut",
            overwrite: "auto",
            clearProps: "opacity,filter,mixBlendMode,transition"
        });
    });
}

function animateSkinBackgroundMorph(fromLayer, toLayer, targetMode) {
    if (!window.gsap || !fromLayer || !toLayer) return null;

    gsap.killTweensOf([fromLayer, toLayer]);
    gsap.set(fromLayer, {
        autoAlpha: 1,
        scale: 1,
        filter: "none",
        transformOrigin: "center center",
        transition: "none",
        force3D: true
    });
    gsap.set(toLayer, {
        autoAlpha: 0,
        scale: 1,
        filter: "none",
        transformOrigin: "center center",
        transition: "none",
        force3D: true
    });

    var tl = gsap.timeline({
        defaults: {
            duration: 1.9,
            ease: "sine.inOut",
            overwrite: "auto"
        }
    });

    tl.addLabel("skinBg", 0)
        .to(fromLayer, {
            autoAlpha: 0,
            scale: 1,
            filter: "none"
        }, "skinBg")
        .to(toLayer, {
            autoAlpha: 1,
            scale: 1,
            filter: "none"
        }, "skinBg");

    var fromDetails = fromLayer.querySelectorAll(".skin-background-morph__piece, .skin-background-morph__tile-card");
    var toDetails = toLayer.querySelectorAll(".skin-background-morph__piece, .skin-background-morph__tile-card");
    var fromBars = fromLayer.querySelectorAll(".skin-background-morph__bar");
    var toBars = toLayer.querySelectorAll(".skin-background-morph__bar");
    var fromTileField = fromLayer.querySelector(".skin-background-morph__tile-field");
    var toTileField = toLayer.querySelector(".skin-background-morph__tile-field");

    if (fromDetails.length) {
        tl.to(fromDetails, {
            autoAlpha: 0,
            rotationY: 64,
            rotationX: -18,
            z: -90,
            y: -10,
            scale: 0.86,
            filter: "blur(10px)",
            duration: 0.95,
            stagger: {amount: 0.75, from: "random"},
            ease: "power2.inOut"
        }, 0.08);
    }

    if (toDetails.length) {
        gsap.set(toDetails, {
            autoAlpha: 0,
            rotationY: -76,
            rotationX: 20,
            z: -120,
            y: 12,
            scale: 0.78,
            filter: "blur(12px)",
            transformPerspective: 900,
            transformOrigin: "center center",
            force3D: true
        });
        tl.to(toDetails, {
            autoAlpha: 1,
            rotationY: 0,
            rotationX: 0,
            z: 0,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 1.22,
            stagger: {amount: 1.1, from: "random"},
            ease: "expo.out"
        }, 0.32);
    }

    if (fromBars.length) {
        tl.to(fromBars, {
            autoAlpha: 0,
            filter: "blur(8px)",
            duration: 0.82,
            stagger: {amount: 0.12, from: "edges"},
            ease: "sine.inOut"
        }, 0.06);
    }

    if (toBars.length) {
        gsap.set(toBars, {
            autoAlpha: 0,
            filter: "blur(10px)"
        });
        tl.to(toBars, {
            autoAlpha: 1,
            filter: "blur(0px)",
            duration: 1.2,
            stagger: {amount: 0.16, from: "start"},
            ease: "sine.out"
        }, 0.22);
    }

    if (fromTileField) {
        tl.to(fromTileField, {
            autoAlpha: 0,
            scale: 1.018,
            filter: "blur(12px)",
            duration: 1.25,
            ease: "sine.inOut"
        }, 0.05);
    }

    if (toTileField) {
        gsap.set(toTileField, {
            autoAlpha: 0,
            scale: 0.982,
            filter: "blur(14px)",
            transformOrigin: "center center",
            force3D: true
        });
        tl.to(toTileField, {
            autoAlpha: 1,
            scale: 1,
            filter: "blur(0px)",
            duration: 1.55,
            ease: "sine.inOut"
        }, 0.18);
    }

    return tl;
}

function waitForSkinLayout() {
    return new Promise(function(resolve) {
        requestAnimationFrame(function() {
            requestAnimationFrame(resolve);
        });
    });
}

function afterNextPaint(callback) {
    requestAnimationFrame(function() {
        requestAnimationFrame(callback);
    });
}

function animateSkinElementMorph(beforeRects) {
    if (!window.gsap || !beforeRects || !beforeRects.length) return;

    beforeRects.forEach(function(entry) {
        var el = entry.el;
        if (!el || el === document.body) return;
        var after = el.getBoundingClientRect();
        if (!after.width || !after.height) return;

        var dx = entry.rect.left - after.left;
        var dy = entry.rect.top - after.top;
        var scaleX = Math.max(0.72, Math.min(1.28, entry.rect.width / after.width));
        var scaleY = Math.max(0.72, Math.min(1.28, entry.rect.height / after.height));

        gsap.fromTo(
            el,
            {
                x: dx,
                y: dy,
                scaleX: scaleX,
                scaleY: scaleY,
                opacity: 0,
                filter: "blur(12px)",
                transformOrigin: "center center",
                force3D: true
            },
            {
                x: 0,
                y: 0,
                scaleX: 1,
                scaleY: 1,
                opacity: 1,
                filter: "blur(0px)",
                duration: 1.28,
                delay: (entry.delay || 0) + 0.2,
                ease: "expo.out",
                clearProps: "transform,opacity,filter,transformOrigin"
            }
        );

        gsap.fromTo(
            el,
            {rotate: (Math.random() * 3 - 1.5)},
            {rotate: 0, duration: 1.04, delay: (entry.delay || 0) + 0.28, ease: "elastic.out(1, 0.7)", clearProps: "rotate"}
        );
    });

    gsap.fromTo(
        ".box svg",
        {scale: 0.96, rotate: getSkinMode() === "doodle" ? -2 : 2},
        {scale: 1, rotate: 0, duration: 1.28, ease: "elastic.out(1, 0.58)", clearProps: "transform"}
    );
}

function refreshHeartRenderLayer() {
    var nodes = [
        document.querySelector(".box"),
        document.querySelector(".box svg")
    ].filter(Boolean);

    nodes.forEach(function(el) {
        if (window.gsap) {
            gsap.killTweensOf(el);
        }
        el.style.removeProperty("filter");
        el.style.removeProperty("-webkit-filter");
        el.style.removeProperty("backdrop-filter");
        el.style.removeProperty("-webkit-backdrop-filter");
    });

    // iOS Safari can keep the old blur compositor cache after a skin morph.
    // A transient webkit-filter reset forces the SVG layer to repaint.
    var svg = nodes[1];
    if (svg) {
        svg.style.webkitFilter = "none";
        void svg.getBoundingClientRect().width;
        svg.style.removeProperty("-webkit-filter");
    }
}

function initSkinSwitcher() {
    initSkinMode();

    var switcher = document.getElementById("skinSwitcher");
    if (!switcher) {
        return;
    }

    updateSkinSwitcherUi();

    switcher.addEventListener("click", function(e) {
        e.preventDefault();
        if (skinTransitionLock || document.body.classList.contains("is-skin-transitioning")) return;
        transitionToOtherSkin(switcher);
    });

    if (window.gsap) {
        gsap.fromTo(
            switcher,
            {scale: 0.9, opacity: 0, y: -8},
            {scale: 1, opacity: 1, y: 0, duration: 0.44, delay: 0.36, ease: "back.out(1.8)"}
        );
        switcher.addEventListener("mouseenter", function() {
            gsap.to(switcher, {scale: 1.035, y: -1, duration: 0.2, ease: "power2.out"});
            gsap.to(".skin-switcher__icon", {rotation: 18, scale: 1.08, duration: 0.24, ease: "power2.out"});
        });
        switcher.addEventListener("mouseleave", function() {
            gsap.to(switcher, {scale: 1, y: 0, duration: 0.24, ease: "power2.out"});
            gsap.to(".skin-switcher__icon", {rotation: 0, scale: 1, duration: 0.28, ease: "power2.out"});
        });
    }

}

async function transitionToOtherSkin(trigger) {
    if (skinTransitionLock) return;
    skinTransitionLock = true;

    if (window.gsap && trigger) {
        gsap.to(trigger, {
            scale: 0.965,
            duration: 0.12,
            ease: "sine.out",
            yoyo: true,
            repeat: 1,
            overwrite: "auto"
        });
    }

    await new Promise(function(resolve) {
        requestAnimationFrame(resolve);
    });

    var currentMode = getSkinMode();
    var targetMode = getSkinTargetMode();
    var beforeRects = captureSkinRects();
    var morphEntries = prepareSkinMorph(beforeRects);
    clearSkinBackgroundMorphs();
    var fromBgLayer = createSkinBackgroundMorph(currentMode, "from");
    var toBgLayer = createSkinBackgroundMorph(targetMode, "to");
    if (currentMode === "doodle") {
        syncDoodleTilesFromPage(fromBgLayer);
    }
    document.body.classList.add("is-skin-transitioning");
    document.documentElement.classList.add("is-skin-transitioning-root");

    if (!window.gsap) {
        applySkinMode(targetMode);
        clearSkinBackgroundMorphs();
        document.body.classList.remove("is-skin-transitioning");
        document.documentElement.classList.remove("is-skin-transitioning-root");
        cleanupSkinMorph(morphEntries);
        skinTransitionLock = false;
        return;
    }

    var realElements = morphEntries.map(function(entry) { return entry.el; });
    var flipStage = createSkinFlipStage();
    var flipSources = createSkinFlipSources(morphEntries, flipStage);
    var flipPairs = [];
    var sakuraLayers = freezeSakuraLayerStyles();

    gsap.killTweensOf(realElements);
    gsap.set(realElements, {
        opacity: 0.001,
        visibility: "visible",
        pointerEvents: "auto",
        transformOrigin: "center center",
        overwrite: true
    });

    if (targetMode === "doodle") {
        var link = ensureDoodleStylesheet();
        await waitForDoodleStylesheet(link);
    }

    document.body.classList.add("is-skin-morphing");
    applySkinMode(targetMode);
    await waitForSkinLayout();
    if (targetMode === "doodle") {
        syncDoodleTilesFromPage(toBgLayer);
    }
    flipPairs = createSkinFlipPairs(flipSources, flipStage);

    var backgroundTimeline = animateSkinBackgroundMorph(fromBgLayer, toBgLayer, targetMode);
    animateSakuraLayerStyles(sakuraLayers, targetMode);
    var flipTimeline = animateSkinFlipPairs(flipPairs);

    gsap.fromTo(
        ".skin-style-flip--to .skin-switcher__icon",
        {rotation: -42, scale: 0.78},
        {rotation: 0, scale: 1, duration: 1.05, ease: "elastic.out(1, 0.52)", clearProps: "transform"}
    );

    var cleanupDelay = 2.78;
    if (backgroundTimeline && backgroundTimeline.duration) {
        cleanupDelay = Math.max(cleanupDelay, backgroundTimeline.duration() + 0.18);
    }
    if (flipTimeline && flipTimeline.duration) {
        cleanupDelay = Math.max(cleanupDelay, flipTimeline.duration() + 0.18);
    }

    gsap.delayedCall(cleanupDelay, function() {
        if (backgroundTimeline && backgroundTimeline.progress) {
            backgroundTimeline.progress(1).pause();
        }
        if (flipTimeline && flipTimeline.progress) {
            flipTimeline.progress(1).pause();
        }

        document.body.classList.remove("is-skin-morphing");
        gsap.set(realElements, {
            opacity: 1,
            visibility: "visible",
            overwrite: true
        });
        gsap.set(realElements, {
            clearProps: "opacity,visibility,pointerEvents,filter,transform,transformOrigin,scale,x,y,scaleX,scaleY,rotation,rotationX,rotationY,z"
        });
        refreshHeartRenderLayer();

        afterNextPaint(function() {
            cleanupSkinFlipPairs(flipPairs, flipStage);
            gsap.killTweensOf([fromBgLayer, toBgLayer]);
            if (targetMode !== "doodle") {
                setDoodleBackdropVisible(false, true);
            }
            clearSkinBackgroundMorphs();
            document.body.classList.remove("is-skin-transitioning");
            document.documentElement.classList.remove("is-skin-transitioning-root");
            cleanupSkinMorph(morphEntries);
            refreshHeartRenderLayer();
            skinTransitionLock = false;
        });
    });
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

function pickLoveWeather(options) {
    options = options || {};
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

    if (window.gsap && !options.silent) {
        gsap.fromTo(
            ".weather-card > :not(.weather-tab)",
            {y: 6, opacity: 0.58},
            {y: 0, opacity: 1, duration: 0.28, stagger: 0.035, ease: "power2.out"}
        );
    }
}

function clearWeatherCardInlineStyles(card, panel) {
    if (!card) return;
    card.style.height = "";
    card.style.overflow = "";
    card.style.willChange = "";
    if (panel) panel.classList.remove("is-weather-animating");
}

function getWeatherCardContents(card) {
    if (!card) return [];
    var children = card.children;
    var contents = [];
    for (var i = 0; i < children.length; i++) {
        if (!children[i].classList.contains("weather-tab")) {
            contents.push(children[i]);
        }
    }
    return contents;
}

function measureWeatherCardHeight(panel, isOpen) {
    if (!panel) return 0;
    var rect = panel.getBoundingClientRect();
    var clone = panel.cloneNode(true);
    clone.classList.toggle("is-open", !!isOpen);
    clone.classList.remove("is-weather-animating");
    clone.style.position = "fixed";
    clone.style.left = "-9999px";
    clone.style.top = "0";
    clone.style.bottom = "auto";
    clone.style.width = rect.width + "px";
    clone.style.transform = "none";
    clone.style.visibility = "hidden";
    clone.style.pointerEvents = "none";
    clone.style.zIndex = "-1";
    document.body.appendChild(clone);
    var cloneCard = clone.querySelector(".weather-card");
    if (cloneCard) {
        cloneCard.style.height = "";
        cloneCard.style.overflow = "";
        cloneCard.style.willChange = "";
    }
    var height = cloneCard ? cloneCard.getBoundingClientRect().height : 0;
    clone.remove();
    return height;
}

function animateLoveWeatherPanel(panel, shouldOpen) {
    var card = panel && panel.querySelector(".weather-card");
    if (!panel || !card || !window.gsap) {
        panel.classList.toggle("is-open", shouldOpen);
        if (shouldOpen) pickLoveWeather({silent: true});
        return;
    }

    gsap.killTweensOf(card);
    var contents = getWeatherCardContents(card);
    gsap.killTweensOf(contents);

    var startHeight = card.getBoundingClientRect().height;
    var endHeight = 0;
    panel.classList.add("is-weather-animating");
    card.style.height = startHeight + "px";
    card.style.overflow = "hidden";
    card.style.willChange = "height";

    if (shouldOpen) {
        panel.classList.add("is-open");
        pickLoveWeather({silent: true});
        endHeight = measureWeatherCardHeight(panel, true);
    }
    else {
        endHeight = measureWeatherCardHeight(panel, false);
    }

    requestAnimationFrame(function() {
        gsap.fromTo(card, {
            height: startHeight
        }, {
            height: endHeight,
            duration: shouldOpen ? 0.66 : 0.76,
            ease: shouldOpen ? "power3.out" : "power3.inOut",
            overwrite: true,
            onComplete: function() {
                if (!shouldOpen) {
                    panel.classList.remove("is-open");
                }
                clearWeatherCardInlineStyles(card, panel);
                gsap.set(contents, {clearProps: "opacity,transform,filter"});
            }
        });

        if (shouldOpen) {
            gsap.fromTo(
                contents,
                {opacity: 0, y: 8},
                {opacity: 1, y: 0, duration: 0.42, delay: 0.18, stagger: 0.04, ease: "power2.out"}
            );
        }
        else {
            gsap.to(contents, {
                opacity: 0,
                y: -4,
                duration: 0.3,
                stagger: 0.018,
                ease: "power2.in"
            });
        }
    });
}

function toggleLoveWeather(forceOpen) {
    var panel = document.getElementById("loveWeather");
    if (!panel) return;
    var shouldOpen = forceOpen === true ? true : !panel.classList.contains("is-open");
    if (panel.classList.contains("is-open") === shouldOpen) return;
    animateLoveWeatherPanel(panel, shouldOpen);
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
    initSkinSwitcher();
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
