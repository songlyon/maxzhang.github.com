(function(window) {
    var navigator = window.navigator,
        adapter = window.adapter,
        support = window.support,
        result = function(val, defaultValue) {
            var type = typeof val;
            return type === 'undefined' ? defaultValue : (type === 'function' ? val.call(window) : val);
        };

    var initialized = false,
        callbackFn, options,
        lastWidth, lastHeight;

    function init() {
        if (!initialized) {
            initialized = true;
            window.addEventListener('resize', resize, false);
            window.addEventListener('orientationchange', adapter.createOrientationChangeProxy(resize), false);
        }
    }

    function resize() {
        var innerWidth = window.innerWidth,
            innerHeight = window.innerHeight,
            screenWidth = window.screen.width,
            screenHeight = window.screen.height,
            offsetLeft = result(options.offsetLeft, 0),
            offsetRight = result(options.offsetRight, 0),
            offsetTop = result(options.offsetTop, 0),
            offsetBottom = result(options.offsetBottom, 0),
            width = innerWidth, height;

        if (support.isSmartDevice && support.isSafari && !support.os.ios7) { // 计算高度，收起 iOS6 顶部导航条
            height = navigator.standalone ? innerHeight : (window.orientation === 0 ? screenHeight - 44 : screenWidth - 32) - 20;
            height = height < innerHeight ? innerHeight : height;
        } else {
            height = innerHeight;
        }

        width -= offsetLeft - offsetRight;
        height -= offsetTop - offsetBottom;

        if (width != lastWidth || height != lastHeight) {
            lastWidth = width;
            lastHeight = height;
            if (callbackFn) callbackFn.call(window, width, height);
        }
    }

    window.resizer = function(cb, opts) {
        callbackFn = cb;
        options = opts || {};
        init();
        resize();
    };
})(window);