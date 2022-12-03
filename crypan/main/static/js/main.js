function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

const csrf_token = getCookie('csrftoken');

$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!/^(GET|HEAD|OPTIONS|TRACE)$/i.test(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrf_token);
        }
    }
});

function val(selector) {
    return $(selector).val()
}

function reloadPage() {
    setTimeout(function () {
        location.reload();
    }, 2000)
}

function toggleDisabled(object) {
    if ($(object).prop('disabled')){
        $(object).prop('disabled', false);
    } else {
        $(object).prop('disabled', true);
    }
}

function HandleResponse (data) {
    if (data.success) {
        $.toast({
            heading: 'Успешно!',
            text: data.message,
            icon: 'success'
        })
    } else if (!data.success) {
        $.toast({
            heading: 'Ошибка!',
            text: data.message,
            icon: 'error'
        })
    }
}

$('.deleteDomain').on('click', function(e){
    e.preventDefault();
    let _this = this;
    toggleDisabled(_this);
    let tr = $(this).closest('tr');
    let id = $(tr).attr('id');
    let data = {
        "do":"deleteDomain",
        "id":id
    };

    $.ajax({
        type:"POST",
        url: "/domains",
        data:data
    }).done(function(data){
        toggleDisabled(_this);
        HandleResponse(data);
        $(tr).fadeOut('slow', function(){
            $( this ).remove();
        });
    });
})

$('#addDomain').on('click', function (e){
    e.preventDefault();
    let _this = this;
    toggleDisabled(_this);

    let data = {};
    data.do = 'addDomain';
    data.podDomain = val('#podDomain');
    data.name = val('#name');
    data.publicDomain = val('#publicDomain');

    if (data.podDomain.includes(".") || data.podDomain.includes("https") || !data.name.includes(".") || data.name.includes("https")){
        $.toast({
            heading: 'Ошибка!',
            text: 'Не правильный домен',
            icon: 'error'
        })
        toggleDisabled(_this);
        return;
    }

    $.ajax({
        'type': 'POST',
        'url': '/domains',
        data: data
    })
    .done(function (data) {
        if (data.success) { 
            reloadPage();
        }
        toggleDisabled(_this);
        HandleResponse(data);
    })
})


$(document).on('click', '.checkConnect', function(e){
    e.preventDefault();
    let _this = this;
    toggleDisabled(_this);
    let tr = $(this).closest('tr');
    let data = {};
    data.do = 'checkConnect';
    data.id = tr.attr('id');
    $.ajax({
        type: "POST",
        url: '/domains',
        data: data
    })
    .done(function(data){
        HandleResponse(data);
        toggleDisabled(_this);
    })
})

$('#addLink').on('click', function (e){
    e.preventDefault();
    let _this = this;
    toggleDisabled(_this);

    let data = {};
    data.do = 'addLink';
    data.domain = val('#domain');
    data.path = val('#path');
    data.redirect = val('#redirect');
    data.design = val('#selectDesign');

    if (data.path.includes(".") || data.domain.includes("https") || !data.domain.includes(".") || data.domain.includes("https")){
        $.toast({
            heading: 'Ошибка!',
            text: 'Не правильно заполнено ссылка',
            icon: 'error'
        })
        toggleDisabled(_this);
        return;
    }

    $.ajax({
        'type': 'POST',
        'url': '/links',
        data: data
    })
    .done(function (data) {
        if (data.success) { 
            reloadPage();
        }
        toggleDisabled(_this);
        HandleResponse(data);
    })
})