// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21;

contract MailSystem {

    address public owner;
    
    constructor(){
        owner=msg.sender;
    }

    struct Mail {
        address sender;
        address receiver;
        string title;
        string content;
        bool wasRead;
        uint priority;
        uint256 time;
    }

    Mail[] private mails;
    mapping(address => Mail[]) private receivedMails;
    mapping(address => Mail[]) private sentMails;

    event sendMailEvent(address sender, address receiver, uint time);
    
    modifier onlyOwnerModifier {
        require(msg.sender==owner, "Only owner can use this functionality.");
        _;
    }

    //Send mail to another address.
    function sendMail(address receiver, string memory title, string memory content, uint priority) external {
        require(msg.sender!=receiver, "You cannot send mail to yourself.");
        Mail memory mail = Mail(msg.sender, receiver, title, content, false, priority, block.timestamp);
        sentMails[msg.sender].push(mail);
        receivedMails[receiver].push(mail);
        mails.push(mail);
        emit sendMailEvent(msg.sender, receiver, block.timestamp);
    }

    //User sees all mails he/she received.
    function seeMails() external view returns (Mail[] memory){
        return receivedMails[msg.sender];
    }

    //User chooses a mail and sees its content.
    function readMail(uint index) external returns(string memory) {
        Mail storage mail = receivedMails[msg.sender][index];
        mail.wasRead=true;
        return mail.content;
    }

    //For the user to see the mails he/she recevied sorted by the priority.
    function getMailsSortedByPriority() external view returns(Mail[] memory) { 
        Mail[] memory sortedMails = new Mail[](receivedMails[msg.sender].length);
        uint count=0;
        for (uint j=5; j>=1; j--){
            for (uint i=0; i<receivedMails[msg.sender].length; i++) {
                if(receivedMails[msg.sender][i].priority == j){
                    sortedMails[count]=receivedMails[msg.sender][i];
                    count++;
                }
            }
        }
        return sortedMails;
    }

    //For the owner to see the usage data of the app.
    //Currently only the number of mails sent in all the time, and in last 24 hours, but other data can be added.
    function getInfoAboutMails() onlyOwnerModifier external view returns(uint256, uint)  {
        uint256 count=mails.length;
        uint countLess24Hours=0;
        for(uint i=0; i<mails.length; i++){
            if(mails[i].time > block.timestamp - 1 days){
                countLess24Hours++;
            }
        }
        return (count, countLess24Hours);
    }

    //For owner to see how many mails were sent in the specified time.
    function getCountOfMailsInLast(uint scnds) external view returns(uint){ 
        require(msg.sender==owner, "Only owner can get data.");
        uint count=0;
        for(uint i=0; i < mails.length; i++){
            if(mails[i].time > block.timestamp - scnds){
                count++;
            }
        }
        return count;
    }
    
}