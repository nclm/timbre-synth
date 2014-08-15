// initialise

function init() {
    "use strict";
    
    sc.use("prototype");
    
    timbre.setup({f64:true});
    if (timbre.envmobile) {
        timbre.setup({samplerate:timbre.samplerate * 0.5});
    }
    
    var nowPlaying;
    var current;
    
    var onreset = function() {
        nowPlaying = null;
        $(window).off("keydown").off("keyup");
        $(".play-button").text("Turn ON");
    };
    
    timbre.on("play", function() {
        if (current) {
            $(current.button).text("Turn OFF");
        }
    }).on("pause", onreset).on("reset", onreset).amp = 0.6;
    
    function playCode(code) {
        code = code.split("\n").map(function(line) {
            return line.replace(/([\d\D])?\/\/[\d\D]*$/, function(m, a, b) {
                return (a === ":") ? m : ""; // url??
            });
        }).join("\n");
        if (timbre.isPlaying && nowPlaying === code) {
            timbre.reset();
            timbre.pause();
        } else {
            timbre.reset();
            eval(code);
            nowPlaying = code;
        }
    }
    
    $(".codemirror").each(function(i, e) {
        var container = $("<div>").addClass("editor").appendTo(e);
        var textarea = $("<textarea>").val($(e).attr("source")).appendTo(container);

        var lang = $(e).attr("lang");
        var mode = (lang === "timbre" || lang === "js") ? "javascript" : lang;
        
        if (mode === "html") mode = "htmlmixed";
        
        var editor = CodeMirror.fromTextArea(textarea.get(0), {
            lineNumbers:true, readOnly:(lang !== "timbre"), mode:mode
        });
        
        if (lang === "timbre") {
            $("<button>").addClass("play-button").on("click", function() {
                current = {container:container, button:$(this)};
                playCode(editor.getValue().trim());
            }).append("Turn ON").appendTo(".play");
        }
    });
}

// presets

function presetchange() {
 var selectBox = document.getElementById('preset-select');
 var selectedValue = selectBox.options[selectBox.selectedIndex].value;
 presetset(selectedValue);
}

function presetread(preset){
 code = $('#'+preset).html();
} 

function presetset(preset) {
$('.editor').remove();
$('.play-button').remove();
timbre.reset();
presetread(preset);
$('.codemirror').attr('source',code);
init();
}


