# web3-mail-app
 
This project contains a smart contract for a mail system on blockchain, and a front-end app which interacts with it.  

Deploying to the blockchain is not needed, since I already deployed it into the blockchain (Sepolia testnet) and added "build" folder to GitHub.  
But, if you still want to deploy it again, run the followings:  
  ```
truffle console --network sepolia  
migrate  
  ```
Note: truffle, hdwallet-provider, etc. must be installed before deploying.  
Note: Deployment might be unsuccessful when the ETH balance on the account runs out, so I advise not to deploy again.  
  
  
For running Front-end:  
  ```
Enter the "app" directory (by running "cd app")  
Install webpack-cli (by running "npm install webpack-cli")
Run "npm run dev"  
  ```  
  
Then, open http://localhost:8080 with your browser, and you can start using the app.  
  
  
I also deployed the web site into server. You can directly reach and use the app by going [https://web3mail.tk/app/dist/index.html](https://web3mail.tk/app/dist/index.html) without doing any steps above.  
  
    
Note: For both the local server and online website, you should connect your Metamask to the app to be able to use it. Please make sure that you have switched to "Sepolia Test Network". You need some test ETH to cover gas fees in some transactions such as sending mail. You can get free test ETHs from faucets. I recommend you to use a wallet which does not contain any real funds to prevent any possible loss.
