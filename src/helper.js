import Web3 from 'web3'
import Torus from '@toruslabs/torus-embed'
import AdoptionArtifact from './seed/Adoption.json'

const web3Obj = {

  web3: new Web3(),

  contracts: {},

  initContract: () => {
    // Get the necessary contract artifact file and instantiate it with truffle-contract
    web3Obj.contracts.Adoption = window.TruffleContract(AdoptionArtifact);
  
    // Set the provider for our contract
    web3Obj.contracts.Adoption.setProvider(web3Obj.web3.currentProvider);
  },

  setweb3: function(provider) {
    const web3Inst = new Web3(provider);
    // const web3Inst = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));
    web3Obj.web3 = web3Inst
    sessionStorage.setItem('pageUsingTorus', true)
  },

  initialize: async () => {
    
    const torus = new Torus({
    })
    
    await torus.init({
      buildEnv: 'testing',
      enableLogging: false,
      network: {
        host: 'http://localhost:8546',
        networkName: 'Local Ganache'
      },
      showTorusButton: true
    });
    
    await torus.login()
    
    web3Obj.setweb3(torus.provider)
    web3Obj.initContract();
  }
}

export default web3Obj
