function getPoll(poll,done){
    $.ajax({
			url: '/'+poll,
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


$(function(){
    var name=$(".poll").attr('data-poll-name');
    console.log(name);
    getPoll(name,function(err,res){
        if(err) console.log(err);
        else {
            $(".poll").text(JSON.stringify(res));
        }
    });
});
