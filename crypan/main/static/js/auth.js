

$("input").on({
    keydown: function(e) {
      if (e.which === 32)
        return false;
    },
    change: function() {
      this.value = this.value.replace(/\s/g, "");
    }
  });

$('#submitButton').on('click', function(e){
    e.preventDefault();

    let login = $('#login').val();
    let password = $('#password').val();
    let data = {
        "username": login,
        "password": password
    };

    $.ajax({
        type: "POST",
        url: "/login",
        data:data
    })
    .done(function(json){
        MakeAuth(json);
    })
})

function HandleResponse(json){
    if (json.success){
        $('.success').fadeIn(500);
        setTimeout(
            function(){
                location.reload()
            }, 2000
        )
    }
    else if(!json.success){
        $('.error').fadeIn(500)
        $('.error').text(json.message);
        setTimeout(
            function(){
                $('.error').fadeOut(500)
            }, 2000
        )
    } 
}

function MakeAuth(json) {
    $("#submitButton").attr("disabled", true);

    if(json.success){
        HandleResponse(json)
        setTimeout(() => { location.reload() }, 2000);
    }
    else if(!json.success){
        HandleResponse(json)
        $("#submitButton").removeAttr("disabled");
    }
}