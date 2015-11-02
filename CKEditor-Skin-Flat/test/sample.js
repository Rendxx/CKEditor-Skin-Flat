$(function () {
    var _createEditor = function () {
        var ele = $("textarea.ckeditor-flat");
        ele.ckeditor();
        var _editorObj = ele.ckeditorGet();
        var _editorBody = null;

        // bind event
        var textBackup = "";
        _editorObj.on('instanceReady', function (e) {
            // First time
            _editorBody = e.editor.document.getBody();
        });
        _editorObj.on("focus", function () {
            _editorBody.setStyle('background-color', "#f9f9f9");
            textBackup = ele.val();
            //if (that.callback && that.callback["focus"]) that.callback["focus"]();
        })
        _editorObj.on("blur", function () {
            _editorBody.setStyle('background-color', "#fff");
        })
        _editorObj.on("key", function (e) {
            if (e.data.keyCode == 27) {
                // ESC
                ele.val(textBackup);
                ele.blur();
                return false;
            }
        });

        _editorObj.on("change", function (e) {
            //if (that.callback && that.callback["change"]) that.callback["change"]();
        });
    };
    _createEditor();
});