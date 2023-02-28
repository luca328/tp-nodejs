let socket = io();
const sleep = (ms)=> {
    return new Promise((resolve)=> setTimeout(resolve, ms))
}
let messages = document.getElementById("messages");
let form = document.getElementById("form");
let input = document.getElementById("input");

form.addEventListener("submit",(event)=>{
    event.preventDefault();
    if (input.value){
        socket.emit("chat_message", `you: ${input.value}`);
        input.value = "";
    }
})
socket.on("chat_message", async ({msg, bot_msg}) => {
    messages.value += msg + "\n";
    messages.scrollTo(0, messages.scrollHeight);
    await sleep(1000);
    messages.value += bot_msg + "\n";
    messages.scrollTo(0, messages.scrollHeight);
})