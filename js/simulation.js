jQuery.fn.extend({
    insertAtCaret: function(myValue) {
        return this.each(function(i) {
            if (document.selection) {
                //For browsers like Internet Explorer
                this.focus();
                var sel = document.selection.createRange();
                sel.text = myValue;
                this.focus();
            } else if (this.selectionStart || this.selectionStart == '0') {
                //For browsers like Firefox and Webkit based
                var startPos = this.selectionStart;
                var endPos = this.selectionEnd;
                var scrollTop = this.scrollTop;
                this.value = this.value.substring(0, startPos) + myValue + this.value.substring(endPos, this.value.length);
                this.focus();
                this.selectionStart = startPos + myValue.length;
                this.selectionEnd = startPos + myValue.length;
                this.scrollTop = scrollTop;
            } else {
                this.value += myValue;
                this.focus();
            }
        });
    }
});


(function() {
    // Variable declaration
    var html_editor = document.querySelector('#html textarea'),
        css_editor = document.querySelector('#css textarea'),
        js_editor = document.querySelector('#js textarea');

    var editors = [html_editor, css_editor, js_editor];
    var base_template =
        "<!doctype html>\n" +
        "<html>\n\t" +
        "<head>\n\t\t" +
        "<meta charset=\"utf-8\">\n\t\t" +
        "<title>Test</title>\n\n\t\t\n\t" +
        "</head>\n\t" +
        "<body>\n\t\n\t" +
        '<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>' +
        "</body>\n" +
        "</html>";

    var prepareSource = function() {
        var html = html_editor.value,
            css = css_editor.value,
            js = js_editor.value,
            src = '';

        // html
        src = base_template.replace('</body>', html + '</body>');

        // css
        css = '<style>' + css + '</style>';
        src = src.replace('</head>', css + '</head>');

        //  javascript
        js = '<script>' + js + '</script>';
        src = src.replace('</body>', js + '</body>');

        return src;
    };


    var render = function() {
        var source = prepareSource();

        var iframe = document.getElementById("outputFrame"),
            iframe_doc = iframe.contentDocument;

        iframe_doc.open();
        iframe_doc.write(source);
        iframe_doc.close();
    }

    function Init() {
        $('#cssArea').keyup(function(e) {
            var code = e.which;
            if (code == 219) {
                if (e.shiftKey) {
                    $('#cssArea').insertAtCaret('}');
                }
            }
        });

        $('#jsArea').keyup(function(e) {
            var code = e.which;
            if (code == 219) {
                if (e.shiftKey) {
                    $('#jsArea').insertAtCaret('}');
                } else {
                    $('#jsArea').insertAtCaret(']');
                }
            } else if (code == 57) {
                if(e.shiftKey) {
                    $('#jsArea').insertAtCaret(')');
                }
            }
        });

        $('#run').click(function(e) {
            //console.log("adasdasdasda");
            render();
        });

        // Allow the text area to handle the tab character
        $(document).delegate('.textbox', 'keydown', function(e) {
            var keyCode = e.keyCode || e.which;

            if (keyCode == 9) {
                e.preventDefault();
                var start = $(this).get(0).selectionStart;
                var end = $(this).get(0).selectionEnd;

                // set textarea value to: text before caret + tab + text after caret
                $(this).val($(this).val().substring(0, start) + "\t" + $(this).val().substring(end));

                // put caret at right position again
                $(this).get(0).selectionStart =
                    $(this).get(0).selectionEnd = start + 1;
            }
        });

        $(".lined").linedtextarea(
            {selectedLine: 1}
        );

    }
    // add page load listener
    $(Init);

})();