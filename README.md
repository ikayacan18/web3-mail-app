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
Install webpack-cli (by running npm install webpack-cli)
Run "npm run dev"  
  ```  
  
Then, open http://localhost:8080 with your browser, and you can start using the app.
