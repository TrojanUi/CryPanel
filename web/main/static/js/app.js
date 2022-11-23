const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
var selectedCard = null;
var selectedLink = null;

function HandleResponce(responce) {
    if (responce.success){
        ohSnap(responce.message, {color: 'green'})
        return true
    } else if (!responce.success){
        ohSnap(responce.message, {color: 'red'})
        return false
    }
}

$(document).on('click', '#saveWallets', function(e){
    e.preventDefault();
    let button = $(this);
    button.prop('disabled', true);
    let data = {};
    data.do = 'saveWallets';
    data.walletBtc = $('#walletBtc').val();
    data.walletEth = $('#walletEth').val();
    data.walletXmr = $("#walletXmr").val();
    $.ajax({
        url: '/profile',
        type: "POST",
        data: data
    })
    .done(function(responce){
        HandleResponce(responce)
    })
    .always(function(){
        button.prop('disabled', false);
    })
})

$(document).on('click', '#submitAddDomain', function(e){
    e.preventDefault();
    let button = $(this);
    button.prop('disabled', true);
    let data = {};
    data.do = 'addDomain';
    data.name = $('#domain').val()
    $.ajax({
        type: 'POST',
        url: '/domains',
        data: data
    })
    .done(function(responce){
        let success = HandleResponce(responce)
        if (success){
            setTimeout(function(){
                location.reload()
            }, 2000)
        }
    })
    .always(function(){
        button.prop('disabled', false);
    })
})


$(document).on('click', '.deleteDomain', function(e){
    e.preventDefault();
    let button = $(this);
    button.prop('disabled', true);
    let tr = $(this).closest('tr')
    let data = {};
    data.do = 'deleteDomain';
    data.id = tr.attr('id')
    $.ajax({
        type: "POST",
        url: '/domains',
        data: data
    })
    .done(function(responce){
        HandleResponce(responce);
        if (responce.success){
            tr.hide(500)
        } 
    })
    .always(function(){
        button.prop('disabled', false);
    })
})

$(document).on('click', '.checkConnect', function(e){
    e.preventDefault();
    let button = $(this);
    button.prop('disabled', true);
    let tr = $(this).closest('tr');
    let data = {};
    data.do = 'checkConnect';
    data.id = tr.attr('id');
    $.ajax({
        type: "POST",
        url: '/domains',
        data: data
    })
    .done(function(responce){
        HandleResponce(responce);
    })
    .always(function(){
        button.prop('disabled', false);
    })
})

$(document).on('click', '#submitAddLink', function(e){
    e.preventDefault();
    let button = $(this);
    button.prop('disabled', true);
    let data = {};
    data.do = 'addLink';
    data.name = $("#selectDomain").val();
    data.path = $('#path').val();
    $.ajax({
        type: 'POST',
        url: '/links',
        data: data
    })
    .done(function(responce){
        let success = HandleResponce(responce)
        if (success){
            setTimeout(function(){
                location.reload()
            }, 2000)
        }
    })
    .always(function(){
        button.prop('disabled', false);
    })
})


$(document).on('click', '.selectCard', function(e){
    e.preventDefault();
    let card = $(this);
    selectedCard = card.find('.card-title').text();
    console.log(selectedCard);
    card.toggleClass('bg-secondary');
    card.toggleClass('bg-primary');
})


$(document).on('click', '#submitSetDesign', function(e){
    e.preventDefault();
    let button = $(this);
    button.prop('disabled', true);
    let data = {};
    data.do = 'setDesign';
    data.design = selectedCard;
    data.link = selectedLink;

    $.ajax({
        type: 'POST',
        url: '/links',
        data: data
    })
    .done(function(responce){
        HandleResponce(responce)
        if (responce.success){
            setTimeout(function(){
                location.reload()
            }, 2000)
        }
    })
    .always(function(){
        button.prop('disabled', false);
    })
})

$(document).on('click', '.setDesignButton', function(e){
    e.preventDefault();
    selectedLink = $(this).closest('tr').attr('id');
})

$(document).on('click', '.deleteLink', function(e){
    e.preventDefault();
    let button = $(this);
    button.prop('disabled', true);
    let tr = $(this).closest('tr')
    let data = {};
    data.do = 'deleteLink';
    data.id = tr.attr('id')
    $.ajax({
        type: "POST",
        url: '/links',
        data: data
    })
    .done(function(responce){
        HandleResponce(responce);
        if (responce.success){
            tr.hide(500)
        } 
    })
    .always(function(){
        button.prop('disabled', false);
    })
})


$(document).on('click', '#submitRequestWithdraw', function(e){
    e.preventDefault();
    let button = $(this);
    let data = {};
    data.do = 'createWithdrawRequest';
    data.coin = $('#coin').val();
    data.sum = $('#sum').val();
    $.ajax({
        type: 'POST',
        url: '/profile',
        data: data
    })
    .done(function(responce){
        HandleResponce(responce);
        if (responce.success){
            tr.hide(500)
        } 
    })
    .always(function(){
        button.prop('disabled', false);
    })
})