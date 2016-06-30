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
	console.log(name);
	
	getPoll(name, function(err, res) {
	    console.log( "getPoll " + name );
	    console.log( res );
            if (err) {
		console.log(err);
            } else {
		for ( var i in res ) {
                    console.log(res[i]);
                    this_div.append("<p>" + res[i].question + "</p>");
		    //                    var def = false;
		    
                    for ( var j in res[i].options) {
			this_div.append("<button type='button' class='submit' data-question='"
					+ i + "' data-poll='"+name+"' id='" + j + "' value='" + res[i].id
					+  "'name='" +name + "-" + j + "'>" + res[i].options[j] + "</button>");
                    }
		    
		    
		};
            }
	});

	$(".submit").click(function() {
	    function Answer(id, answer) {
		this.id = id;
		this.answer = answer;
	    }
	    
	    var answers = [];
	    
	    console.log(JSON.stringify(answers));
	    
	    postAnswers(name, answers, function(err, res) {
		if (err) {
		    console.log(err);
		} else {
		    console.log(res);
		}
	    });
	});
	
    });
});
