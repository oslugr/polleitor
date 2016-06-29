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
        type: "PUT",
        data: JSON.stringify({
            "answers": answers
        }),
        contentType: 'application/json',
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
            $.each(res, function(id_que, val_que) {
                console.log(val_que);
                $(".poll").append("<p>" + val_que.question + "</p>");
                var def = false;

                $.each(val_que.options, function(id_ans, val_ans) {
                    if (!def) {
                        $(".poll").append("<input type='radio' name='" + val_que.id + "' value='" + id_ans + "' checked='checked'>" + val_ans + "<br>");
                        def = true;
                    } else {
                        $(".poll").append("<input type='radio' name='" + val_que.id + "' value='" + id_ans + "'>" + val_ans + "<br>");
                    }
                });

                $(".poll").append("<br><button type='button' class='submit' id='" + val_que.id + "'>Enviar respuestas</button>");

                $(".submit").click(function() {
                    function Answer(id, answer) {
                        this.id = id;
                        this.answer = answer;
                    }

                    var answers = [];

                    $.each($('input[type=radio]'), function() {
                        if ($(this).is(":checked")) {
                            //console.log("Question: " + $(this).attr("name") + " - Answer: " + $(this).val());
                            var answer = new Answer($(this).attr("name"), $(this).val());
                            answers.push(answer);
                        }
                    });

                    //console.log(JSON.stringify(answers));

                    postAnswers(name, answers, function(err, res) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(res);
                        }
                    });
                });

            });
        }
    });
});
