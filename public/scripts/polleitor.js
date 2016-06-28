function getPoll(poll, done) {
    $.ajax({
        url: '/' + poll,
        type: "GET",
        cache: false,
        success: function(data) {
            done(null, data);
        },
        error: function(xhr, status, err) {
            done(new Error(err));
        }
    });
}

function getAnswers(poll, done) {
    $.ajax({
        url: '/' + poll + '/resultados',
        type: "GET",
        cache: false,
        success: function(data) {
            done(null, data);
        },
        error: function(xhr, status, err) {
            done(new Error(err));
        }
    });
}

function postAnswers(poll, answers, done) {
    $.ajax({
        url: '/' + poll,
        type: "POST",
        data: answers,
        dataType: 'json',
        cache: false,
        success: function(data) {
            done(null, data);
        },
        error: function(xhr, status, err) {
            done(new Error(err));
        }
    });
}

$(function() {
    var name = $(".poll").attr('data-poll-name');
    console.log(name);

    getPoll(name, function(err, res) {
        if (err) {
            console.log(err);
        } else {
            $.each(res, function(id_p, val_p) {
                console.log(val_p);
                $(".poll").append("<p>" + val_p.question + "</p>");
                var def = false;

                $.each(val_p.options, function(id_r, val_r) {
                    if (!def) {
                        $(".poll").append("<input type='radio' name='" + id_p + "' value='" + id_r + "' checked='checked'>" + val_r + "<br>");
                        def = true;
                    } else {
                        $(".poll").append("<input type='radio' name='" + id_p + "' value='" + id_r + "'>" + val_r + "<br>");
                    }
                });
            });

            //$(".poll").text(JSON.stringify(res));
        }
    });

    $("#enviar").click(function() {
        var answers = new Array();

        $.each($('input[type=radio]'), function() {
            if ($(this).is(":checked")) {
                console.log("Question: " + $(this).attr("name") + " - Answer: " + $(this).val());
                answers.push($(this).val());
            }
        });
    });

});
