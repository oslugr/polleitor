function getPoll(poll, done) {
    $.ajax({
        url: '/' + poll,
        type: "GET",
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
            $.each(res, function(index, value) {
                console.log(value);
                $(".poll").append("<p>" + value.question + "</p>");
                $(".poll").append("<ul>");
                $.each(value.options, function(index, value) {
                    //console.log(value);
                    $(".poll").append("<li>" + value + "</li>");
                });
                $(".poll").append("</ul>");
            });

            //$(".poll").text(JSON.stringify(res));
        }
    });
});
