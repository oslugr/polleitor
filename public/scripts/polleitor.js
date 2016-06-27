function getPoll(poll, done) {
    $.ajax({
			url: '/'+poll,
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

function getAnswers(poll,done){
    $.ajax({
            url: '/'+poll+'/resultados',
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
function postAnswers(poll,answers,done){
    $.ajax({
            url: '/'+poll,
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

$(function(){
    var name=$(".poll").attr('data-poll-name');
    console.log(name);
    getPoll(name, function(err, res) {
        if (err) {
            console.log(err);
        } else {
            $.each(res, function(id_p, val_p) {
                console.log(val_p);
                $(".poll").append("<p>" + val_p.question + "</p>");
                $.each(val_p.options, function(id_r, val_r) {
                    //console.log(value);
                    $(".poll").append("<input type='radio' name='" + id_p + "' value='" + id_r + "'>" + val_r + "<br>");
                });
            });

            //$(".poll").text(JSON.stringify(res));
        }
    });
});
