import React from 'react'
import web3Obj from './helper'
import pets from './seed/pets.json'

class App extends React.Component {
  state = {
    account: '',
    balance: '',
    pets: []
  }

  componentDidMount() {
    web3Obj.initialize().then(() => { this.getPetsAdoptionStatus() }).then(() => {
      this.setStateInfo()
    })

  }

  setStateInfo = () => {

    web3Obj.web3.eth.getAccounts().then(accounts => {
      this.setState({ account: accounts[0] })
      web3Obj.web3.eth.getBalance(accounts[0]).then(balance => {
        this.setState({ balance: balance })
      })
    })
  }

  handleAdopt = (petId) => {
    let account = this.state.account;

    web3Obj.contracts.Adoption.deployed().then((instance) => {
      // Execute adopt as a transaction by sending account
      instance.adopt(petId, {from: account}).then((result) => {
        return this.getPetsAdoptionStatus();
      }).then(() => {
        this.setStateInfo()
      }).catch(function(err) {
        console.log(err.message);
      })
    }).catch(function(err) {
      console.log(err.message);
    });
  }

  getPetsAdoptionStatus = () => {

    web3Obj.contracts.Adoption.deployed().then((instance) => {
      return instance.getAdopters.call();
    }).then((adopters) => {
      let newPets = [...pets]

      for (let petId = 0; petId < adopters.length; petId++) {
        if (adopters[petId] !== '0x0000000000000000000000000000000000000000') {
          newPets[petId].adopted = true
        } else {
          newPets[petId].adopted = false
        }
      }


      this.setState({
        pets: newPets
      })

    }).catch(function(err) {
      console.error(err.message);
    });
  }

  enableTorus = async () => {
    try {
      await web3Obj.initialize()
      this.setStateInfo()
    } catch (error) {
      console.error(error)
    }
  }

  render() {
    const petsHtml = this.state.pets.map((pet) => {
      return (
        <div className="col-sm-6 col-md-4 col-lg-3" key={pet.id}>
          <div className="panel panel-default panel-pet">
            <div className="panel-heading">
              <h3 className="panel-title">{pet.name}</h3>
            </div>
            <div className="panel-body">
              <img alt="140x140" data-src="holder.js/140x140" className="img-rounded img-center" style={{width: '100%'}} src={pet.picture} data-holder-rendered="true" />
              <br/><br/>
              <strong>Breed</strong>: <span className="pet-breed">{pet.breed}</span><br/>
              <strong>Age</strong>: <span className="pet-age">{pet.age}</span><br/>
              <strong>Location</strong>: <span className="pet-location">{pet.location}</span><br/><br/>
              <button className="btn btn-default btn-adopt" type="button" onClick={() => this.handleAdopt(pet.id)} disabled={pet.adopted}>{pet.adopted ? "This one's taken" : 'Adopt this pupper'}</button>
            </div>
          </div>
        </div>
      )
    });

    return (
      <div className="App">
        <div>
          <div>Account: {this.state.account}</div>
          <div>Balance: {this.state.balance}</div>
        </div>

        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-sm-8 col-sm-push-2">
              <h1 className="text-center">Decentral Pet Adoption</h1>
              <hr/>
              <br/>
            </div>
          </div>

          <div id="petsRow" className="row">
            {petsHtml}
          </div>
        </div>
      </div>
    )
  }
}

export default App
