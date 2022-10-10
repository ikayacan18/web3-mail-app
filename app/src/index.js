import Web3 from "web3";
import mailSystemArtifact from "../../build/contracts/MailSystem.json";
import { ethers } from "ethers";

const App = {
  web3: null,
  account: null,
  withsigner: null,
  
  start: async function() {
    //const { web3 } = this;
    
    try {
      const addr = mailSystemArtifact.networks[11155111].address;
      document.getElementById("smartaddr").textContent="Smart Contract Address: "+addr;
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      this.withsigner = await new ethers.Contract(addr, mailSystemArtifact.abi, signer);
      const signerAddress = await signer.getAddress();
      document.getElementById("youraddr").textContent="Your Address: "+signerAddress;
    } catch (error) {
      console.error("Could not connect to contract or chain.");
    }
  },
  
  sendMail: async function() {
    let receiver=document.getElementById("sendMailAddress").value;
    let title=document.getElementById("title").value;
    let text=document.getElementById("text").value;
    let priority=document.getElementById("priority").value;
    await this.withsigner.sendMail(receiver, title, text, priority);
  },
  
  mailsOpened: false,
  seeAllMails: async function() {

    let result = await this.withsigner.seeMails();
    let tableHTML=`<table>
    <tr>
      <th>ID</th>
      <th>SENDER</th>
      <th>TITLE</th>
      <th>DATE</th>
      <th>PRIORITY</th>
      <th>WAS READ?</th>
    </tr>`;

    for(let i=0; i<result.length; i++){

      tableHTML+=`<tr>
        <td>${i}</td>
        <td>${result[i].sender}</td>
        <td>${result[i].title}</td>
        <td>${new Date(parseInt(result[i].time)*1000).toLocaleDateString("en-US") +", "+new Date(parseInt(result[i].time)*1000).toLocaleTimeString("en-US")}</td>
        <td>${result[i].priority}</td>
        <td>${result[i].wasRead ? "Yes" : "No"}</td>
      </tr>`;
    }
  
    tableHTML+=`</table>`;
    document.getElementById("seeAllMailsDiv").innerHTML= `<button onclick="App.seeAllMails()">SEE MY ALL MAILS</button>`+tableHTML +'<label for="chosenIndex">Enter index of the mail you want to open:</label><input id="chosenIndex"></input> <button id="open" onclick="App.openMail()">OPEN</button><button id="exit" onclick="App.exitMails()">EXIT</button>';
  },
  
  seeAllMailsSortedByPriority: async function() {
    let result = await this.withsigner.getMailsSortedByPriority();

    let tableHTML=`<table>
    <tr>
      
      <th>SENDER</th>
      <th>TITLE</th>
      <th>DATE</th>
      <th>PRIORITY</th>
      <th>WAS READ?</th>
    </tr>`;

    for(let i=0; i<result.length; i++){

      tableHTML+=`<tr>
        
        <td>${result[i].sender}</td>
        <td>${result[i].title}</td>
        <td>${new Date(parseInt(result[i].time)*1000).toLocaleDateString("en-US") +", "+new Date(parseInt(result[i].time)*1000).toLocaleTimeString("en-US")}</td>
        <td>${result[i].priority}</td>
        <td>${result[i].wasRead ? "Yes" : "No"}</td>
      </tr>`;
    }
    tableHTML+=`</table>`;
    document.getElementById("seeAllMailsSortedByPriorityDiv").innerHTML=`<button onclick="App.seeAllMailsSortedByPriority()">SEE MY ALL MAILS SORTED BY PRIORITY</button>`+tableHTML+'<button onclick="App.exitMailsSorted()">EXIT</button>';
  },
  
  openMail: async function() {
    let index = parseInt(document.getElementById("chosenIndex").value);
    let tx=await this.withsigner.readMail(index);
    await tx.wait();
    
    let result = await this.withsigner.seeMails();
    document.getElementById("seeAllMailsDiv").innerHTML += '<p>Content of Mail#'+index+": "+result[index].content+'</p>';
  },
  exitMails: async function() {
    document.getElementById("seeAllMailsDiv").innerHTML = '<button onclick="App.seeAllMails()">SEE MY ALL MAILS</button>';
    this.mailsOpened = false;
  },
  exitMailsSorted: async function() {
    document.getElementById("seeAllMailsSortedByPriorityDiv").innerHTML = '<button onclick="App.seeAllMailsSortedByPriority()">SEE MY ALL MAILS SORTED BY PRIORITY</button>';
    this.mailsOpened = false;
  },
  seeData: async function() {
    let result = await this.withsigner.getInfoAboutMails();
    document.getElementById("seeDataResult").innerText = "Number of mails sent until now: " + result[0] +"\nNumber of mails sent in last 1 hour: " + result[1];
  },

  seeMailsInLastSeconds: async function() {
    let seconds = parseInt(document.getElementById("lastSeconds").value);
    let result = await this.withsigner.getCountOfMailsInLast(seconds);
    document.getElementById("seeMailsInLastSecondsResult").innerText = "Number of mails sent in last "+ seconds+" seconds: " + result;
  },

  searchInTitle: async function() {

    let result = await this.withsigner.seeMails();
    let word = document.getElementById("wordToSearch").value;
    let tableHTML=`<table>
    <tr>
      
      <th>SENDER</th>
      <th>TITLE</th>
      <th>DATE</th>
      <th>PRIORITY</th>
      <th>WAS READ?</th>
    </tr>`;

    for(let i=0; i<result.length; i++){
      if(result[i].title.includes(word)){
        tableHTML+=`<tr>
        
        <td>${result[i].sender}</td>
        <td>${result[i].title}</td>
        <td>${new Date(parseInt(result[i].time)*1000).toLocaleDateString("en-US") +", "+new Date(parseInt(result[i].time)*1000).toLocaleTimeString("en-US")}</td>
        <td>${result[i].priority}</td>
        <td>${result[i].wasRead ? "Yes" : "No"}</td>
      </tr>`;
      }
    }
  
    tableHTML+=`</table>`;
    document.getElementById("searchInTitleDiv").innerHTML= `<label for="wordToSearch">Enter a string to find mails whose title including it:</label>
    <input id="wordToSearch"></input>
    <button onclick="App.searchInTitle()">FIND MAILS</button>`+tableHTML;
  },
};

window.App = App;

window.addEventListener("load", function() {
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    window.ethereum.enable(); // get permission to access accounts
  } else {
    console.warn(
      "No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live",
      );
      // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
      App.web3 = new Web3(
        new Web3.providers.HttpProvider("http://127.0.0.1:8545"),
        );
      }
      
      App.start();
    });