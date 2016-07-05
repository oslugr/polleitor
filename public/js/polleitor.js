// # Polleitor Client
// Cliente de **polleitor**

//Desarrollado por la Oficina de Software Libre bajo licencia MIT


// `getPoll(poll,done)` Obtiene la poll del servidor, ejecuta el callback `done(err,poll)`
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

// `getAnswers(poll,done)` Similar a getPoll, pero incluye además las respuestas
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

// `postAnswers(poll,answers,done)` envía las respuestas a una poll, como un array de enteros, ejecuta el callback con el resultado del servidor
function postAnswers(poll, answers, done) {
    console.log(answers);
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

// `plot_chart(poll_id,chart_id)` Dibuja los resultados de una poll en el objeto con id _chat\_id_
function plot_chart(poll_id, chart_id) {
    getAnswers(poll_id, function(error, answers) {

        console.log(answers);
        var answer = answers[0];
        var chart_label = answer.question;
        var ctx = document.getElementById(chart_id);
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: answer.options,
                datasets: [{
                    label: chart_label,
                    data: answer.answers,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    });
}

// Genera una poll para todos los objetos de clase poll en el html
$(function() {
    $(".poll").each(function() {
        var this_div = $(this);
        var name = this_div.attr('data-poll-name');

        getPoll(name, function(err, res) {

            if (err) {
                console.log(err);
            } else {
                for (var i in res) {
                    this_div.append("<p>" + res[i].question + "</p>");
                    for (var j in res[i].options) {
                        this_div.append("<button round big  class='width-2' type='primary' class='submit' data-question='" + i + "' data-poll='" + name + "' id='" + j + "' value='" + res[i].id + "'name='" + name + "-" + j + "'>" + res[i].options[j] + "</button>");
                    }
                }
            }
        });

    });

});

//Binding a elementos generados dinámicamente según http://stackoverflow.com/questions/203198/event-binding-on-dynamically-created-elements
// Envía respuesta al realizar click
$(document).on("click", ".submit", function() {
    function Answer(id, answer) {
        this.id = id;
        this.answer = answer;
    }

    var answer = new Answer($(this).attr("value"), $(this).attr('id'));
    var name = $(this).attr('data-poll');
    $("button[data-poll='" + name + "']").each(function() {
        $(this).attr('disabled', true);
    });
    console.log(answer);
    postAnswers(name, [answer], function(err, res) {
        if (err) {
            console.log(err);
        } else {
            console.log(res);
        }
    });
});
