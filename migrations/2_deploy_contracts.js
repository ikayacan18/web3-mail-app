const MailSystem = artifacts.require("MailSystem");

module.exports = function(deployer) {
  deployer.deploy(MailSystem);
};
