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
    console.log( answers );
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
    $(".poll").each( function() {
	var this_div = $(this);
	var name =  this_div.attr( 'data-poll-name');
	
	getPoll(name, function(err, res) {

            if (err) {
		console.log(err);
            } else {
		for ( var i in res ) {
                    this_div.append("<p>" + res[i].question + "</p>");
                    for ( var j in res[i].options) {
			this_div.append("<button type='button' class='submit' data-question='"
					+ i + "' data-poll='"+name+"' id='" + j + "' value='" + res[i].id
					+  "'name='" +name + "-" + j + "'>" + res[i].options[j] + "</button>");
                    }
		    
		    
		};
            }
	});
	
    });

});

// Binding a elementos generados dinámicamente según http://stackoverflow.com/questions/203198/event-binding-on-dynamically-created-elements
$(document).on( "click", ".submit", function() {
    function Answer(id, answer) {
	this.id = id;
	this.answer = answer;
    }
    
    var answer = new Answer($(this).attr("value"), $(this).attr('id'));
    var name = $(this).attr('data-poll');
    console.log( answer );
    postAnswers(name, [answer], function(err, res) {
	if (err) {
	    console.log(err);
	} else {
	    console.log(res);
	}
    });
});
